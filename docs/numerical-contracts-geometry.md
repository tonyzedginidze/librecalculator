# Geometry numerical contracts

All three calculators use the shared canonical-decimal parser: signed syntax is accepted by the parser, but geometry dimensions must be strictly positive; inputs are finite, ungrouped, non-exponential decimals with at most 30 significant digits, a 256-character text cap, and adjusted exponent magnitude no greater than 100. Inputs are explicitly metres. There is no unit guessing or unit selector. Areas are returned in m², volumes in m³, and lengths in m. Shared decimal arithmetic uses 50 significant digits, with no intermediate presentation rounding; values outside the shared output exponent range are rejected. Invalid canonical decimals, nonpositive dimensions, degenerate/impossible geometry, and output overflow have explicit error codes.

## Area

- Rectangle: `A = width × height`; width and height are positive perpendicular side lengths in m.
- Triangle: `A = base × perpendicularHeight ÷ 2`; both lengths are positive, and height is the perpendicular altitude to the specified base (not a sloping edge).
- Circle: `A = π × radius²`; radius is positive and measured from the centre to the circumference.

The calculator's π constant is `3.14159265358979323846264338327950288419716939937510` (50 decimal places). Circle results are approximate; comparisons use absolute tolerance `1e-12 + 1e-12 × |reference|`.

## Volume

- Rectangular prism: `V = width × height × depth`; all three positive dimensions are in m.
- Right circular cylinder: `V = π × radius² × height`; positive radius and perpendicular height are in m.
- Sphere: `V = 4π × radius³ ÷ 3`; radius is positive and in m.

The same 50-decimal π constant is used. Cylinder and sphere results are approximate and use the same absolute-plus-relative comparison tolerance. Outputs are in m³.

## Pythagorean theorem

Exactly one side is unknown. Given sides are positive lengths in m. For a missing hypotenuse, `c = √(a² + b²)`. For a missing leg, the inputs are hypotenuse `c` and known leg `a`; require exact input comparison `c > a` before calculating `b = √(c² − a²)`. Equality is degenerate and `c < a` is impossible; neither is accepted with any tolerance. The square root uses the shared 50-significant-digit Decimal context and is not rounded before presentation. Root comparisons use `1e-12 + 1e-12 × |reference|`.

## Independent fixture basis

Fixtures are specified from geometric identities, not generated from the engines: rectangle 3 × 4 = 12 m²; triangle base 3 and height 4 = 6 m²; radius-1 circle equals the stated 50-decimal π constant; prism 2 × 3 × 4 = 24 m³; cylinder radius 2, height 3 = 12π m³; sphere radius 3 = 36π m³; right triangle legs 3 and 4 has hypotenuse 5; hypotenuse 5 and leg 3 has missing leg 4. Additional tests cover small positive dimensions, accepted high-magnitude inputs, output overflow, malformed/zero/negative dimensions, and `c ≤ a`.

## References

Geometric definitions and worked measurement applications: [OpenStax Prealgebra 2e](https://openstax.org/details/books/prealgebra-2e), including its measurement and geometry material. The formulas are standard Euclidean identities; lessons' examples are checked against the independent fixture basis above.

## Geometry launch pack

The shape topics provide measurements beyond core area and volume: rectangle area, perimeter and diagonal; triangle area from perpendicular base/height, perimeter from three sides and altitude from area/base; circle area, circumference and diameter; sphere volume, surface area and diameter; right circular cylinder volume, total exterior area and curved area. Inputs are metres, except triangle's supplied area in m². All dimensions are strictly positive under the shared decimal bounds. Triangle perimeter rejects a longest side greater than or equal to the sum of the other two; it compares the smallest side against longest minus middle, avoiding loss of a tiny side in a large sum. No triangle shape is inferred from the base/altitude operation. Diagrams are schematic, with exact result tables.

Formulas: rectangle P=2(w+h), d=√(w²+h²); triangle P=a+b+c, h=2A/b; circle C=2πr, d=2r; sphere S=4πr², d=2r; cylinder S=2πr(r+h), curved L=2πrh. Total cylinder surface includes both disks; curved surface excludes them. Roots and π outputs use absolute tolerance 1e-12 plus relative tolerance 1e-12, without intermediate presentation rounding. Independent fixtures include rectangle 3×4 with area 12, perimeter 14 and diagonal 5; triangle 3,4,5 with perimeter 12, base 3/height 4 area 6 and area 6/base 3 altitude 4; radius-1 circle with area π, circumference 2π and diameter 2; radius-3 sphere volume and area both 36π and diameter 6; radius-2, height-3 cylinder volume 12π, total surface 20π and curved surface 12π.
