import { expect, test } from "bun:test";
import { deflateSync } from "node:zlib";
import { readPngPixels } from "./png";

function screenshot(channels: 3 | 4, uniform = false) {
  const stride = 320 * channels;
  const pixels = Buffer.alloc(stride * 180);
  for (let index = 0; index < pixels.length; index++)
    pixels[index] = uniform
      ? 128
      : (index * 17 + Math.floor(index / stride)) % 256;
  const scanlines = Buffer.alloc((stride + 1) * 180);
  const paeth = (a: number, b: number, c: number) => {
    const p = a + b - c;
    const distances = [Math.abs(p - a), Math.abs(p - b), Math.abs(p - c)];
    return distances[0] === Math.min(...distances)
      ? a
      : distances[1] === Math.min(...distances)
        ? b
        : c;
  };
  for (let y = 0; y < 180; y++) {
    const filter = y % 5;
    scanlines[y * (stride + 1)] = filter;
    for (let x = 0; x < stride; x++) {
      const index = y * stride + x;
      const a = x >= channels ? (pixels[index - channels] ?? 0) : 0;
      const b = y ? (pixels[index - stride] ?? 0) : 0;
      const c =
        y && x >= channels ? (pixels[index - stride - channels] ?? 0) : 0;
      const prediction =
        [0, a, b, Math.floor((a + b) / 2), paeth(a, b, c)][filter] ?? 0;
      scanlines[y * (stride + 1) + x + 1] =
        ((pixels[index] ?? 0) - prediction) & 255;
    }
  }
  const chunk = (name: string, data: Buffer) => {
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length);
    // Decoder only consumes chunk data; CRCs are not part of pixel decoding.
    return Buffer.concat([length, Buffer.from(name), data, Buffer.alloc(4)]);
  };
  const header = Buffer.alloc(13);
  header.writeUInt32BE(320);
  header.writeUInt32BE(180, 4);
  header[8] = 8;
  header[9] = channels === 3 ? 2 : 6;
  return {
    pixels,
    png: Buffer.concat([
      Buffer.from("89504e470d0a1a0a", "hex"),
      chunk("IHDR", header),
      chunk("IDAT", deflateSync(scanlines)),
      chunk("IEND", Buffer.alloc(0)),
    ]),
  };
}

test("decodes all five PNG filters for RGB and RGBA", () => {
  for (const channels of [3, 4] as const) {
    const { png, pixels } = screenshot(channels);
    expect(readPngPixels(png).equals(pixels)).toBe(true);
  }
});

test("rejects uniform art, but permits a uniform comparison background", () => {
  const { png, pixels } = screenshot(3, true);
  expect(() => readPngPixels(png)).toThrow("uniform empty image");
  expect(readPngPixels(png, true).equals(pixels)).toBe(true);
});

test("rejects invalid, truncated and non-native screenshots", () => {
  expect(() => readPngPixels(Buffer.alloc(0))).toThrow("not a PNG");
  const { png } = screenshot(3);
  expect(() => readPngPixels(png.subarray(0, 80))).toThrow();
  const resized = Buffer.from(png);
  resized.writeUInt32BE(640, 16);
  expect(() => readPngPixels(resized)).toThrow("exactly 320x180");
});
