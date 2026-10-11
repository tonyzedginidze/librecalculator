/**
 * Pure helper utilities for finance interactive chart mapping and axis tick selection.
 * Operates strictly on normalized ratios and integer indices; performs no money math.
 */

export function findNearestIndex(ratio: number, totalCount: number): number {
  if (totalCount <= 0) return 0;
  if (totalCount === 1) return 0;
  const clamped = Math.min(1, Math.max(0, ratio));
  return Math.min(
    totalCount - 1,
    Math.max(0, Math.round(clamped * (totalCount - 1))),
  );
}

export function pointerToNearestIndex(
  clientX: number,
  rectLeft: number,
  rectWidth: number,
  totalCount: number,
  svgViewBoxWidth: number = 500,
  plotLeftSvg: number = 40,
  plotRightSvg: number = 480,
): number {
  if (totalCount <= 0 || rectWidth <= 0) return 0;
  const svgX = ((clientX - rectLeft) / rectWidth) * svgViewBoxWidth;
  const plotWidthSvg = plotRightSvg - plotLeftSvg;
  const plotRatio =
    (svgX - plotLeftSvg) / (plotWidthSvg > 0 ? plotWidthSvg : 1);
  return findNearestIndex(plotRatio, totalCount);
}

export function selectAxisTicks(
  totalCount: number,
  maxTicks: number = 6,
): number[] {
  if (totalCount <= 0) return [];
  if (totalCount <= maxTicks) {
    return Array.from({ length: totalCount }, (_, i) => i);
  }
  const ticks: number[] = [];
  const step = (totalCount - 1) / (maxTicks - 1);
  for (let i = 0; i < maxTicks; i++) {
    const idx = Math.min(totalCount - 1, Math.round(i * step));
    if (ticks.length === 0 || ticks[ticks.length - 1] !== idx) {
      ticks.push(idx);
    }
  }
  return ticks;
}

export function calculateNormalizedY(
  centsVal: bigint | number | string,
  maxCentsVal: bigint | number | string,
  plotHeight: number,
  plotBottomY: number,
): number {
  const current = Number(BigInt(centsVal));
  const max = Math.max(1, Number(BigInt(maxCentsVal)));
  const ratio = Math.min(1, Math.max(0, current / max));
  return plotBottomY - ratio * plotHeight;
}
