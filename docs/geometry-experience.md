# Geometry experience

This document describes the design and frontend UI/UX implementation for the three geometry topics: **Area**, **Volume**, and **Pythagorean Theorem**.

## Visual Direction & Diagram Architecture

Rather than reusing generic bar models or static mockups, each geometry topic provides custom, dynamically scaled SVG diagrams tailored specifically to each shape and solid identity, adhering to the Folio design system (warm copper accents, serif numbers, high clarity, dark/light theme awareness):

1. **Area (`area`)**:
   - **Rectangle**: Dynamic width × height rectangle with top and side dimension labels (`m`), shaded area region (`m²`), and clamped aspect ratios (0.28 to 3.5) for honest visual schematics.
   - **Triangle**: Polygon with perpendicular height altitude line (dashed), right-angle corner indicator, base label (`b = ... m`), altitude height label (`h = ... m`), and shaded area region (`m²`).
   - **Circle**: Circle with center point, radial line, radius label (`r = ... m`), and shaded area region (`m²`).

2. **Volume (`volume`)**:
   - **Rectangular Prism**: 3D isometric perspective cuboid with front, top, and side faces, dashed hidden interior edges, labeled width (`w`), height (`h`), depth (`d`), and cubic meter volume (`m³`).
   - **Cylinder**: 3D cylinder with top ellipse, side edges, dashed bottom back arc, radius line (`r`), height (`h`), and volume (`m³`).
   - **Sphere**: 3D sphere with outer circle, equatorial 3D ellipse (solid front arc, dashed back arc), radius line (`r`), center point, and volume (`m³`).

3. **Pythagorean Theorem (`pythagorean`)**:
   - **Right Triangle**: Right triangle with perpendicular legs `a` (horizontal) and `b` (vertical), diagonal hypotenuse `c`, right-angle marker, and dynamic leg ratio clamping (0.28 to 3.5).
   - **Solved Side Highlight**: Solved side (`c` for `missing-hypotenuse`, `b` for `missing-leg`) is rendered with a bold stroke (`var(--oc-accent)`) and highlighted label badge.

## Working Equations & Substitution Precision

Substituted equation working steps use explicit quantity notation to prevent unit-exponent ambiguity:

- **Circle Area**: `π × ({radius} m)² = {answer} m²`
- **Cylinder Volume**: `π × ({radius} m)² × {height} m = {answer} m³`
- **Sphere Volume**: `4π × ({radius} m)³ ÷ 3 = {answer} m³`
- **Missing Hypotenuse**: `c = √({a}² + {b}²) = {hypotenuse} m`
- **Missing Leg**: `b = √({hypotenuse}² − {leg}²) = {answer} m`

Intermediate arithmetic uses 50-digit precision without presentation rounding.

## Unit Formatting & Copying

- Copying typed quantities returns the exact canonical decimal formatted with the topic's explicit unit (`m` for length, `m²` for area, `m³` for volume).
- Invalid inputs or degenerate shapes (e.g. nonpositive dimensions or hypotenuse ≤ leg) produce clear, localized error notices.
