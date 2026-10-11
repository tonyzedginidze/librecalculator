import type { ReactNode } from "react";
import type { Category } from "../catalog";
import {
  constructionOperationPaths,
  constructionScenes,
} from "../topics/construction-art";
import { financeOperationPaths, financeScenes } from "../topics/finance-art";
import { healthOperationPaths, healthScenes } from "../topics/health-art";
import { cookingOperationPaths } from "./cooking-art";
import { dateOperationPaths, dateScenes } from "./date-art";
import { educationOperationPaths } from "./education-art";
import { geometryOperationPaths } from "./geometry-art";
import { bakingRatiosArt } from "./illustrations/baking-ratios";
import { caloriesPerServingArt } from "./illustrations/calories-per-serving";
import { circleArt } from "./illustrations/circle";
import { cookingMeasuresArt } from "./illustrations/cooking-measures";
import { cupGramConversionArt } from "./illustrations/cup-gram-conversion";
import { cylinderArt } from "./illustrations/cylinder";
import { durationArt } from "./illustrations/duration";
import { finalGradeArt } from "./illustrations/final-grade";
import { gpaArt } from "./illustrations/gpa";
import { gradeArt } from "./illustrations/grade";
import { lengthArt } from "./illustrations/length";
import { massArt } from "./illustrations/mass";
import { ovenTemperatureArt } from "./illustrations/oven-temperature";
import { recipeScalingArt } from "./illustrations/recipe-scaling";
import { rectangleArt } from "./illustrations/rectangle";
import { speedConversionArt } from "./illustrations/speed-conversion";
import { sphereArt } from "./illustrations/sphere";
import { temperatureArt } from "./illustrations/temperature";
import { testScoreArt } from "./illustrations/test-score";
import { triangleArt } from "./illustrations/triangle";
import { mathOperationPaths, mathScenes } from "./math-art";
import { packIconPaths } from "./pack-icon";
import { scienceOperationPaths, scienceScenes } from "./science-art";

const ink = "var(--oc-ink)";
const accent = "var(--oc-accent)";
const soft = "var(--oc-accent-soft)";
const surface = "var(--oc-surface)";
const line = "var(--oc-line)";
const muted = "var(--oc-muted)";

function slice(cx: number, cy: number, r: number, from: number, to: number) {
  const rad = (deg: number) => ((deg - 90) * Math.PI) / 180;
  const x = (deg: number) => cx + r * Math.cos(rad(deg));
  const y = (deg: number) => cy + r * Math.sin(rad(deg));
  return `M${cx} ${cy}L${x(from)} ${y(from)}A${r} ${r} 0 0 1 ${x(to)} ${y(to)}Z`;
}

const mono = {
  fontFamily: "var(--oc-font-mono)",
  textAnchor: "middle" as const,
};

const stroke = {
  stroke: accent,
  strokeWidth: 2.5,
  strokeLinejoin: "round" as const,
};
const ground = (x1: number, x2: number) => (
  <line
    x1={x1}
    y1="146"
    x2={x2}
    y2="146"
    stroke={line}
    strokeWidth="2"
    strokeLinecap="round"
  />
);

const scenes: Record<string, ReactNode> = {
  length: lengthArt,
  mass: massArt,
  temperature: temperatureArt,
  "speed-conversion": speedConversionArt,
  duration: durationArt,
  "cooking-measures": cookingMeasuresArt,

  ...scienceScenes,
  gpa: gpaArt,
  grade: gradeArt,
  "final-grade": finalGradeArt,
  "test-score": testScoreArt,

  ...mathScenes,
  ...financeScenes,
  ...constructionScenes,
  ...dateScenes,
  ...healthScenes,
  "recipe-scaling": recipeScalingArt,
  "cup-gram-conversion": cupGramConversionArt,
  "oven-temperature": ovenTemperatureArt,
  "baking-ratios": bakingRatiosArt,
  "calories-per-serving": caloriesPerServingArt,

  rectangle: rectangleArt,
  triangle: triangleArt,
  circle: circleArt,
  sphere: sphereArt,
  cylinder: cylinderArt,

  percentage: (
    <>
      {ground(48, 272)}
      <circle
        cx="160"
        cy="86"
        r="50"
        fill="none"
        stroke={line}
        strokeWidth="16"
      />
      <circle
        cx="160"
        cy="86"
        r="50"
        fill="none"
        stroke={accent}
        strokeWidth="16"
        pathLength="100"
        strokeDasharray="25 75"
        transform="rotate(-90 160 86)"
      />
      <text x="160" y="93" fontSize="22" fill={ink} {...mono}>
        25%
      </text>
    </>
  ),
  "percentage-change": (
    <>
      {ground(48, 272)}
      <rect x="84" y="94" width="44" height="52" rx="4" fill={line} />
      <rect x="168" y="54" width="44" height="92" rx="4" fill={accent} />
      <path
        d="M106 82C110 40 150 30 186 46"
        fill="none"
        stroke={ink}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M180 38l6 8-10 1"
        fill="none"
        stroke={ink}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="226"
        y="40"
        width="66"
        height="30"
        rx="4"
        fill={soft}
        {...stroke}
      />
      <text x="259" y="61" fontSize="17" fill={accent} {...mono}>
        +80%
      </text>
    </>
  ),
  fractions: (
    <>
      {Array.from({ length: 8 }, (_, i) => (
        <path
          key={`slice-${i * 45}`}
          d={slice(108, 90, 54, i * 45, (i + 1) * 45)}
          fill={i < 3 ? accent : surface}
          stroke={line}
          strokeWidth="2"
        />
      ))}
      <circle cx="108" cy="90" r="54" fill="none" {...stroke} />
      <text fontSize="46" fill={ink} {...mono}>
        <tspan x="224" y="82">
          3
        </tspan>
        <tspan x="224" y="138">
          8
        </tspan>
      </text>
      <line
        x1="202"
        y1="94"
        x2="246"
        y2="94"
        stroke={ink}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </>
  ),
  // Two aligned rulers: 1 m on top lines up with 3.28 ft below.
  "unit-conversion": (
    <>
      <rect x="48" y="40" width="224" height="28" rx="4" fill={surface} />
      <rect x="48" y="40" width="112" height="28" rx="4" fill={soft} />
      <rect
        x="48"
        y="40"
        width="224"
        height="28"
        rx="4"
        fill="none"
        {...stroke}
      />
      {Array.from({ length: 7 }, (_, i) => (
        <line
          key={`m-${i * 28}`}
          x1={76 + i * 28}
          y1="68"
          x2={76 + i * 28}
          y2={i % 4 === 3 ? 50 : 58}
          stroke={accent}
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      ))}
      <rect
        x="48"
        y="84"
        width="224"
        height="28"
        rx="4"
        fill={surface}
        {...stroke}
      />
      {Array.from({ length: 6 }, (_, i) => (
        <line
          key={`ft-${(i + 1) * 34}`}
          x1={48 + (i + 1) * 34}
          y1="84"
          x2={48 + (i + 1) * 34}
          y2="96"
          stroke={accent}
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      ))}
      <line
        x1="160"
        y1="32"
        x2="160"
        y2="120"
        stroke={accent}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="160" cy="76" r="4.5" fill={accent} />
      <text x="160" y="146" fontSize="20" fill={accent} {...mono}>
        3.28 ft
      </text>
    </>
  ),
  area: (
    <>
      {ground(48, 272)}
      <rect
        x="64"
        y="44"
        width="144"
        height="96"
        rx="4"
        fill={soft}
        {...stroke}
      />
      <path
        d="M100 44v96M136 44v96M172 44v96M64 76h144M64 108h144"
        stroke={surface}
        strokeWidth="1.75"
      />
      <path d="M64 108h36v32H68a4 4 0 0 1-4-4z" fill={accent} />
      <rect
        x="64"
        y="44"
        width="144"
        height="96"
        rx="4"
        fill="none"
        {...stroke}
      />
      <text x="246" y="99" fontSize="22" fill={accent} {...mono}>
        m²
      </text>
    </>
  ),
  volume: (
    <>
      {ground(48, 272)}
      <polygon points="150,30 214,62 150,94 86,62" fill={surface} {...stroke} />
      <polygon points="86,62 150,94 150,144 86,112" fill={soft} {...stroke} />
      <polygon points="150,94 214,62 214,112 150,144" fill={soft} {...stroke} />
      <path
        d="M150 119l64-32M182 78v50"
        fill="none"
        stroke={accent}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <polygon
        points="150,119 182,103 182,128 150,144"
        fill={accent}
        stroke={accent}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <text x="250" y="99" fontSize="22" fill={accent} {...mono}>
        m³
      </text>
    </>
  ),
  pythagorean: (
    <>
      {ground(48, 272)}
      <polygon points="64,140 64,44 192,140" fill={soft} {...stroke} />
      <path
        d="M64 44L192 140"
        fill="none"
        stroke={accent}
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path
        d="M64 126h14v14"
        fill="none"
        stroke={accent}
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <circle cx="64" cy="44" r="4" fill={accent} />
      <circle cx="192" cy="140" r="4" fill={accent} />
      <text x="152" y="76" fontSize="22" fill={accent} {...mono}>
        c²
      </text>
    </>
  ),
  "compound-interest": (
    <>
      {ground(44, 276)}
      {[24, 38, 54, 74, 98].map((h, i) => (
        <rect
          key={h}
          x={60 + i * 42}
          y={146 - h}
          width="30"
          height={h}
          rx="4"
          fill={i === 4 ? accent : soft}
          {...stroke}
        />
      ))}
      <circle cx="92" cy="50" r="18" fill={accent} />
      <text x="92" y="58" fontSize="22" fill={surface} {...mono}>
        $
      </text>
    </>
  ),
  "loan-payments": (
    <>
      {ground(44, 276)}
      {[100, 84, 68, 52, 36, 20].map((h, i) => (
        <rect
          key={h}
          x={52 + i * 38}
          y={146 - h}
          width="26"
          height={h}
          rx="4"
          fill={i === 0 ? accent : soft}
          {...stroke}
        />
      ))}
      <rect
        x="186"
        y="32"
        width="96"
        height="30"
        rx="4"
        fill={surface}
        {...stroke}
      />
      <text x="234" y="53" fontSize="16" fill={accent} {...mono}>
        $ / month
      </text>
    </>
  ),
  discount: (
    <>
      <path
        d="M64 92l32-36h152a4 4 0 0 1 4 4v64a4 4 0 0 1-4 4H96z"
        fill={soft}
        {...stroke}
        strokeLinecap="round"
      />
      <circle
        cx="92"
        cy="92"
        r="7"
        fill={surface}
        stroke={accent}
        strokeWidth="1.75"
      />
      <path
        d="M87 87C78 68 64 56 48 50"
        fill="none"
        stroke={ink}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <text
        x="176"
        y="100"
        fontSize="22"
        fill={accent}
        fontFamily="var(--oc-font-mono)"
        textAnchor="middle"
      >
        −25%
      </text>
    </>
  ),
  "tip-splitting": (
    <>
      <path
        d="M56 28h96v118l-12-8-12 8-12-8-12 8-12-8-12 8-12-8-12 8z"
        fill={surface}
        {...stroke}
      />
      {[52, 70, 88].map((y) => (
        <line
          key={y}
          x1="72"
          y1={y}
          x2={y === 88 ? 112 : 136}
          y2={y}
          stroke={line}
          strokeWidth="5"
          strokeLinecap="round"
        />
      ))}
      <text x="104" y="124" fontSize="22" fill={ink} {...mono}>
        $84
      </text>
      <path
        d="M160 90h24M184 44v92M184 44h32M184 90h32M184 136h32"
        fill="none"
        stroke={accent}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {[44, 90, 136].map((y) => (
        <g key={y}>
          <circle
            cx="240"
            cy={y}
            r="19"
            fill={y === 90 ? accent : soft}
            {...stroke}
          />
          <circle
            cx="240"
            cy={y - 5}
            r="5.5"
            fill={y === 90 ? surface : accent}
          />
          <path
            d={`M229 ${y + 11}a11 8 0 0 1 22 0`}
            fill={y === 90 ? surface : accent}
          />
        </g>
      ))}
    </>
  ),
};

export function CalculatorArt(props: { id: string }) {
  return (
    <svg
      viewBox="0 0 320 180"
      className="oc-art"
      aria-hidden="true"
      focusable="false"
    >
      {scenes[props.id] ?? (
        <rect
          x="110"
          y="40"
          width="100"
          height="100"
          rx="14"
          fill={soft}
          stroke={muted}
        />
      )}
    </svg>
  );
}

const iconPaths: Record<Category | "all", ReactNode> = {
  health: packIconPaths.health,
  construction: packIconPaths.construction,
  "date-time": packIconPaths["date-time"],
  statistics: packIconPaths.statistics,
  physics: packIconPaths.physics,
  all: (
    <>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" />
    </>
  ),
  math: (
    <>
      <circle cx="7.5" cy="7.5" r="2.5" />
      <circle cx="16.5" cy="16.5" r="2.5" />
      <path d="M18.5 5.5l-13 13" />
    </>
  ),
  cooking: <path d="M3 8 H21 L19 17 Q12 22 5 17 Z M8 4 V8 M16 4 V8" />,
  education: <path d="M4 4 H20 V20 H4 Z M8 8 H16 M8 12 H16 M8 16 H13" />,
  geometry: (
    <>
      <path d="M3.5 19.5L10 5l6.5 14.5z" />
      <rect x="14" y="4" width="6.5" height="6.5" rx="1" />
    </>
  ),
  units: (
    <>
      <rect x="3" y="8.5" width="18" height="7" rx="1.5" />
      <path d="M7 8.5v3M11 8.5v4M15 8.5v3M19 8.5v2" />
    </>
  ),
  finance: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v10M14.5 9.5c0-1-1-1.7-2.5-1.7s-2.5.7-2.5 1.7 1 1.4 2.5 1.7 2.5.7 2.5 1.8-1 1.7-2.5 1.7-2.5-.7-2.5-1.7" />
    </>
  ),
};

export function CategoryIcon(props: { category: Category | "all" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {iconPaths[props.category]}
    </svg>
  );
}

export function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4.5 4.5" />
    </svg>
  );
}

const operationPaths: Record<string, ReactNode> = {
  ...educationOperationPaths,
  ...cookingOperationPaths,
  ...geometryOperationPaths,
  ...scienceOperationPaths,
  compound: <path d="M3 19h18M4 16l5-4 4 1 7-9M15 4h5v5" />,
  change: <path d="M4 18l6-6 4 3 6-9M15 6h5v5" />,
  split: (
    <>
      <path d="M12 3v8M12 11L5 18M12 11l7 7M3 16v5h5M16 21h5v-5" />
    </>
  ),
  convert: <path d="M3 8h17l-4-4M21 16H4l4 4" />,
  ...mathOperationPaths,
  ...financeOperationPaths,
  ...constructionOperationPaths,
  ...dateOperationPaths,
  ...healthOperationPaths,
  rectangle: <rect x="4" y="6.5" width="16" height="11" rx="1.5" />,
  triangle: <path d="M4 19L12 5l8 14z" />,
  circle: <circle cx="12" cy="12" r="8" />,
  prism: <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9" />,
  cylinder: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="2.8" />
      <path d="M5 6v12c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8V6" />
    </>
  ),
  sphere: (
    <>
      <circle cx="12" cy="12" r="8" />
      <ellipse cx="12" cy="12" rx="8" ry="3" />
    </>
  ),
  add: <path d="M12 5v14M5 12h14" />,
  subtract: <path d="M5 12h14" />,
  multiply: <path d="M6 6l12 12M18 6L6 18" />,
  divide: (
    <>
      <path d="M5 12h14" />
      <circle cx="12" cy="6.5" r="1.2" fill="currentColor" />
      <circle cx="12" cy="17.5" r="1.2" fill="currentColor" />
    </>
  ),
  reduce: <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7" />,
  "of-value": (
    <>
      <circle cx="7.5" cy="7.5" r="2.3" />
      <circle cx="16.5" cy="16.5" r="2.3" />
      <path d="M18 6L6 18" />
    </>
  ),
  "sale-price": (
    <>
      <path d="M4 5h8l8 8-7 7-8-8z" />
      <circle cx="8.5" cy="9.5" r="1.2" fill="currentColor" />
    </>
  ),
  "discount-percent": (
    <>
      <circle cx="8" cy="8" r="2.3" />
      <circle cx="16" cy="16" r="2.3" />
      <path d="M18 6L6 18" />
    </>
  ),
  ratio: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 12V4a8 8 0 0 1 7.6 10.5z" fill="currentColor" />
    </>
  ),
  "missing-hypotenuse": (
    <>
      <path d="M5 19V5l14 14z" />
      <path d="M5 5l14 14" strokeWidth="3" />
    </>
  ),
  "missing-leg": (
    <>
      <path d="M5 19V5l14 14z" />
      <path d="M5 5v14" strokeWidth="3" />
    </>
  ),
};

export function OperationIcon(props: { id: string }) {
  const paths = operationPaths[props.id];
  if (!paths) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths}
    </svg>
  );
}

export function CopyIcon(props: { done?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {props.done ? (
        <path d="M5 12.5l4.5 4.5L19 7.5" />
      ) : (
        <>
          <rect x="9" y="9" width="11" height="11" rx="2" />
          <path d="M5 15V6a2 2 0 0 1 2-2h9" />
        </>
      )}
    </svg>
  );
}

export const calculatorArtIds = new Set(Object.keys(scenes));
export const operationIconIds = new Set(Object.keys(operationPaths));
