import type { ReactNode } from "react";

/**
 * 24x24 stroke icons for geometry operations. Each shape keeps one base glyph and
 * adds one clear modifier: hatching for an area or volume, a dot or arrow run for a
 * boundary, a line for a length across the shape.
 */
export const geometryOperationPaths: Record<string, ReactNode> = {
  "rectangle-area": (
    <>
      <rect x="4" y="6" width="16" height="12" rx="1.5" />
      <path d="M4 13l7-7M8.5 18l12-12M15 18l5-5" />
    </>
  ),
  "rectangle-perimeter": (
    <>
      <path d="M4 10V7.5A1.5 1.5 0 0 1 5.5 6h13A1.5 1.5 0 0 1 20 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 16.5V15" />
      <path d="M2 12.5L4 10l2 2.5" />
    </>
  ),
  "rectangle-diagonal": (
    <>
      <rect x="4" y="6" width="16" height="12" rx="1.5" />
      <path d="M7 15.5l10-7" />
      <circle cx="7" cy="15.5" r="1" fill="currentColor" />
      <circle cx="17" cy="8.5" r="1" fill="currentColor" />
    </>
  ),
  "triangle-area": (
    <>
      <path d="M3.5 19L12 4.5 20.5 19z" />
      <path d="M8 15.5h8M10 12h4" />
    </>
  ),
  "triangle-perimeter": (
    <>
      <path d="M3.5 19L12 4.5 20.5 19z" />
      <circle cx="3.5" cy="19" r="1.5" fill="currentColor" />
      <circle cx="12" cy="4.5" r="1.5" fill="currentColor" />
      <circle cx="20.5" cy="19" r="1.5" fill="currentColor" />
    </>
  ),
  "triangle-altitude": <path d="M3.5 19L12 4.5 20.5 19zM12 4.5V19M12 16h3v3" />,
  "circle-area": (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M6.5 15.5l9-9M9 18.5l9.5-9.5M5 11l6-6" />
    </>
  ),
  "circle-circumference": (
    <>
      <path d="M20 12a8 8 0 1 1-2.35-5.65" />
      <path d="M18 3v3.5h-3.5" />
    </>
  ),
  "circle-diameter": (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M4 12h16" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </>
  ),
  "sphere-volume": (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M4 12a8 3 0 0 0 16 0M6.5 17.5h11M9 20h6" />
    </>
  ),
  "sphere-surface": (
    <>
      <circle cx="12" cy="12" r="8" />
      <ellipse cx="12" cy="12" rx="3.5" ry="8" />
      <path d="M4.6 9h14.8M4.6 15h14.8" />
    </>
  ),
  "sphere-diameter": (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M4 12h16" />
      <circle cx="4" cy="12" r="1.25" fill="currentColor" />
      <circle cx="20" cy="12" r="1.25" fill="currentColor" />
    </>
  ),
  "cylinder-volume": (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="2.5" />
      <path d="M5 6v12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6" />
      <path d="M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5M8 17.5l3-1M12.5 18l3.5-1.2" />
    </>
  ),
  "cylinder-surface": (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="2.5" />
      <path d="M5 6v12M19 6v12" />
      <ellipse cx="12" cy="18" rx="7" ry="2.5" />
    </>
  ),
  "cylinder-lateral": (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="2.5" />
      <path d="M5 6v12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6" />
      <path d="M9 9v10.2M12 9.5v10.5M15 9v10.2" />
    </>
  ),
};
