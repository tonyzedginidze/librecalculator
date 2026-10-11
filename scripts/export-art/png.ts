import { inflateSync } from "node:zlib";

/** Decode native Chromium RGB/RGBA screenshots for empty-image comparisons. */
export function readPngPixels(png: Buffer, allowUniform = false): Buffer {
  if (!png.subarray(0, 8).equals(Buffer.from("89504e470d0a1a0a", "hex")))
    throw new Error("Screenshot is not a PNG");
  if (png.readUInt32BE(16) !== 320 || png.readUInt32BE(20) !== 180)
    throw new Error("Screenshot must be exactly 320x180 pixels");
  const channels = png[25] === 2 ? 3 : png[25] === 6 ? 4 : 0;
  if (png[24] !== 8 || !channels || png[28] !== 0)
    throw new Error("Expected a non-interlaced 8-bit RGB/RGBA screenshot");
  const chunks: Buffer[] = [];
  for (let offset = 8; offset + 12 <= png.length; ) {
    const length = png.readUInt32BE(offset);
    if (offset + length + 12 > png.length) throw new Error("Truncated PNG");
    if (png.toString("ascii", offset + 4, offset + 8) === "IDAT")
      chunks.push(png.subarray(offset + 8, offset + 8 + length));
    offset += length + 12;
  }
  const raw = inflateSync(Buffer.concat(chunks));
  const stride = 320 * channels;
  if (raw.length !== (stride + 1) * 180)
    throw new Error("Invalid PNG pixel data");
  const pixels = Buffer.alloc(stride * 180);
  const paeth = (left: number, above: number, diagonal: number) => {
    const prediction = left + above - diagonal;
    const a = Math.abs(prediction - left);
    const b = Math.abs(prediction - above);
    const c = Math.abs(prediction - diagonal);
    return a <= b && a <= c ? left : b <= c ? above : diagonal;
  };
  for (let y = 0; y < 180; y++) {
    const filter = raw[y * (stride + 1)] ?? 0;
    if (filter > 4) throw new Error("Invalid PNG row filter");
    for (let x = 0; x < stride; x++) {
      const index = y * stride + x;
      const left = x >= channels ? (pixels[index - channels] ?? 0) : 0;
      const above = y > 0 ? (pixels[index - stride] ?? 0) : 0;
      const diagonal =
        y > 0 && x >= channels ? (pixels[index - stride - channels] ?? 0) : 0;
      const predictor =
        [
          0,
          left,
          above,
          Math.floor((left + above) / 2),
          paeth(left, above, diagonal),
        ][filter] ?? 0;
      pixels[index] = ((raw[y * (stride + 1) + x + 1] ?? 0) + predictor) & 255;
    }
  }
  if (
    !allowUniform &&
    pixels.every((value, index) => value === pixels[index % channels])
  )
    throw new Error("Screenshot is a uniform empty image");
  return pixels;
}
