import type { ReactNode } from "react";

// Artwork for the "How you can help" page. Same house style as the calculator
// tiles (docs/tile-illustrations.md): theme tokens only, flat fills, round
// joins. Each figure or block sits in a data-category group, so it takes that
// category's hue in light and dark themes.

const accent = "var(--oc-accent)";
const soft = "var(--oc-accent-soft)";
const surface = "var(--oc-surface)";
const line = "var(--oc-line)";
const mono = "var(--oc-font-mono)";

type HelpCategory =
  | "math"
  | "geometry"
  | "units"
  | "finance"
  | "cooking"
  | "education"
  | "health"
  | "construction"
  | "statistics"
  | "physics";

const BLOCK = 72;

function Block(props: {
  x: number;
  y: number;
  category: HelpCategory;
  children: ReactNode;
}) {
  const { x, y } = props;
  return (
    <g data-category={props.category}>
      <rect
        x={x}
        y={y}
        width={BLOCK}
        height={BLOCK}
        rx="4"
        fill={soft}
        stroke={accent}
        strokeWidth="2.5"
      />
      {props.children}
    </g>
  );
}

function Glyph(props: { x: number; y: number; children: string }) {
  return (
    <text
      x={props.x}
      y={props.y}
      fontSize="34"
      fill={accent}
      fontFamily={mono}
      textAnchor="middle"
      dominantBaseline="central"
    >
      {props.children}
    </text>
  );
}

function Person(props: {
  category: HelpCategory;
  /** Hip to shoulder; drawn thicker than the limbs so it reads as a body. */
  torso: string;
  /** Legs and arms, joint to joint. */
  limbs: string;
  head: [number, number];
}) {
  return (
    <g data-category={props.category}>
      {/* an accent stroke under a soft one draws each part as an outlined tube */}
      <path d={props.limbs} fill="none" stroke={accent} strokeWidth="9" />
      <path d={props.limbs} fill="none" stroke={soft} strokeWidth="4" />
      <path d={props.torso} fill="none" stroke={accent} strokeWidth="14" />
      <path d={props.torso} fill="none" stroke={soft} strokeWidth="9" />
      <circle
        cx={props.head[0]}
        cy={props.head[1]}
        r="9"
        fill={surface}
        stroke={accent}
        strokeWidth="2.5"
      />
    </g>
  );
}

function Carried(props: {
  category: HelpCategory;
  x: number;
  y: number;
  w: number;
  h: number;
  angle: number;
}) {
  const { x, y, w, h, angle } = props;
  return (
    <rect
      data-category={props.category}
      x={x}
      y={y}
      width={w}
      height={h}
      rx="3"
      fill={soft}
      stroke={accent}
      strokeWidth="2.5"
      transform={`rotate(${angle} ${x + w / 2} ${y + h / 2})`}
    />
  );
}

const cloud = (x: number, y: number) =>
  `M${x} ${y}A20 20 0 0 1 ${x + 28} ${y - 20}A30 30 0 0 1 ${x + 84} ${y - 24}A22 22 0 0 1 ${x + 120} ${y}Z`;

const sprout = (x: number) =>
  `M${x} 280V264M${x} 272Q${x - 8} 270 ${x - 10} 260M${x} 268Q${x + 8} 266 ${x + 10} 256`;

/** People in every category colour building a universe out of calculator blocks. */
export function HelpHero() {
  return (
    <svg
      className="oc-help-hero-art"
      viewBox="0 36 960 254"
      aria-hidden="true"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* sky and ground */}
      <path d={cloud(96, 100)} fill={surface} stroke={line} strokeWidth="2" />
      <path d={cloud(744, 96)} fill={surface} stroke={line} strokeWidth="2" />
      <path d="M24 280H936" stroke={line} strokeWidth="2" />
      <path
        d={`${sprout(140)}${sprout(730)}${sprout(912)}`}
        fill="none"
        stroke={line}
        strokeWidth="2"
      />

      {/* ladder resting on the stack */}
      <g data-category="geometry">
        <path
          d="M274 280L350 150M290 280L366 150M284.5 262H300.5M299.5 236H315.5M315 210H331M330 184H346M345.5 158H361.5"
          fill="none"
          stroke={accent}
          strokeWidth="2.5"
        />
      </g>

      {/* the stack: bottom row */}
      <Block x={332} y={208} category="geometry">
        <path
          d="M350 262H386L350 226Z"
          fill={surface}
          stroke={accent}
          strokeWidth="2.5"
        />
      </Block>
      <Block x={404} y={208} category="math">
        <path d="M422 244H458" stroke={accent} strokeWidth="2.5" />
        <circle cx="440" cy="231" r="3.5" fill={accent} />
        <circle cx="440" cy="257" r="3.5" fill={accent} />
      </Block>
      <Block x={476} y={208} category="units">
        <rect
          x="486"
          y="234"
          width="52"
          height="20"
          rx="3"
          fill={surface}
          stroke={accent}
          strokeWidth="2.5"
        />
        <path
          d="M496 234V242M504 234V246M512 234V242M520 234V246M528 234V242"
          stroke={accent}
          strokeWidth="1.75"
        />
      </Block>
      <Block x={548} y={208} category="finance">
        <Glyph x={584} y={244}>
          $
        </Glyph>
      </Block>

      {/* top row */}
      <Block x={368} y={136} category="physics">
        <Glyph x={404} y={172}>
          π
        </Glyph>
      </Block>
      <Block x={440} y={136} category="education">
        <Glyph x={476} y={172}>
          %
        </Glyph>
      </Block>
      <Block x={512} y={136} category="statistics">
        <path
          d="M530 190V176M546 190V164M562 190V154"
          stroke={accent}
          strokeWidth="6"
        />
      </Block>

      {/* the universe on top */}
      <g data-category="math">
        <circle
          cx="476"
          cy="92"
          r="44"
          fill={soft}
          stroke={accent}
          strokeWidth="2.5"
        />
        <ellipse
          cx="476"
          cy="92"
          rx="18"
          ry="44"
          fill="none"
          stroke={accent}
          strokeWidth="1.75"
        />
        <path
          d="M476 48V136M438 70H514M432 92H520M438 114H514"
          stroke={accent}
          strokeWidth="1.75"
        />
      </g>

      {/* Figures are drawn joint to joint: foot, knee, hip, shoulder, elbow,
          hand, so every limb bends where a person's would. */}

      {/* walking in with a block held at the chest */}
      <Person
        category="cooking"
        torso="M210 240L212 214"
        limbs="M222 280L216 260L210 240L206 261L198 280M212 214L214 230L230 228M212 214L220 224L232 214"
        head={[214, 201]}
      />
      <Carried category="cooking" x={228} y={206} w={26} h={24} angle={-6} />

      {/* climbing the ladder, one foot on each rung */}
      <Person
        category="geometry"
        torso="M306 226L320 203"
        limbs="M292 262L300 244L306 226L324 218L307 236M320 203L336 205L350 196M320 203L334 211L350 206"
        head={[323, 190]}
      />
      <Carried category="geometry" x={346} y={184} w={20} h={22} angle={-6} />

      {/* standing on the stack, lifting a block overhead */}
      <Person
        category="finance"
        torso="M602 168L602 145"
        limbs="M595 208L598 188L602 168L606 188L609 208M600 145L588 128L590 110M604 145L616 128L614 110"
        head={[602, 132]}
      />
      <Carried category="finance" x={584} y={86} w={36} h={24} angle={-4} />

      {/* leaning in to push a block into place */}
      <Carried category="units" x={624} y={246} w={34} h={34} angle={-12} />
      <Person
        category="units"
        torso="M694 246L675 228"
        limbs="M708 280L701 263L694 246L682 262L686 280M675 228L668 240L657 252M675 228L670 244L659 260"
        head={[666, 218]}
      />

      {/* carrying one overhead */}
      <Person
        category="health"
        torso="M770 240L770 216"
        limbs="M763 280L766 260L770 240L774 260L777 280M768 216L756 200L758 182M772 216L784 200L782 182"
        head={[770, 203]}
      />
      <Carried category="health" x={752} y={158} w={36} h={24} angle={4} />

      {/* carrying one on the shoulder */}
      <Person
        category="construction"
        torso="M860 240L858 214"
        limbs="M848 280L853 260L860 240L864 261L872 280M858 214L868 222L871 209M858 214L853 228L849 240"
        head={[855, 201]}
      />
      <Carried
        category="construction"
        x={866}
        y={187}
        w={28}
        h={22}
        angle={-10}
      />
    </svg>
  );
}

const icons: Record<HelpIconName, ReactNode> = {
  share: (
    <>
      <path
        d="M160 32L170 58L198 59.5L176 77L183.5 104.5L160 89L136.5 104.5L144 77L122 59.5L150 58Z"
        fill={soft}
        stroke={accent}
        strokeWidth="2.5"
      />
      <path
        d="M114 36L122 44M206 36L198 44M100 70H110M210 70H220"
        stroke={accent}
        strokeWidth="2.5"
      />
    </>
  ),
  ideas: (
    <>
      <path
        d="M126 34H194A8 8 0 0 1 202 42V82A8 8 0 0 1 194 90H156L136 106L140 90H126A8 8 0 0 1 118 82V42A8 8 0 0 1 126 34Z"
        fill={soft}
        stroke={accent}
        strokeWidth="2.5"
      />
      <circle cx="142" cy="62" r="4.5" fill={accent} />
      <circle cx="160" cy="62" r="4.5" fill={accent} />
      <circle cx="178" cy="62" r="4.5" fill={accent} />
      <path d="M214 26L208 34M224 42H214" stroke={accent} strokeWidth="2.5" />
    </>
  ),
  expertise: (
    <>
      <path
        d="M100 106A20 20 0 0 1 140 106ZM180 106A20 20 0 0 1 220 106Z"
        fill={surface}
        stroke={accent}
        strokeWidth="2.5"
      />
      <circle
        cx="120"
        cy="68"
        r="10"
        fill={surface}
        stroke={accent}
        strokeWidth="2.5"
      />
      <circle
        cx="200"
        cy="68"
        r="10"
        fill={surface}
        stroke={accent}
        strokeWidth="2.5"
      />
      <path
        d="M134 106A26 26 0 0 1 186 106Z"
        fill={soft}
        stroke={accent}
        strokeWidth="2.5"
      />
      <circle
        cx="160"
        cy="58"
        r="12"
        fill={soft}
        stroke={accent}
        strokeWidth="2.5"
      />
      <path
        d="M160 24V32M142 30L147 36M178 30L173 36"
        stroke={accent}
        strokeWidth="2.5"
      />
    </>
  ),
  build: (
    <>
      <rect
        x="102"
        y="28"
        width="116"
        height="80"
        rx="6"
        fill={soft}
        stroke={accent}
        strokeWidth="2.5"
      />
      <path d="M102 46H218" stroke={accent} strokeWidth="2.5" />
      <circle cx="113" cy="37" r="2.5" fill={accent} />
      <circle cx="122" cy="37" r="2.5" fill={accent} />
      <circle cx="131" cy="37" r="2.5" fill={accent} />
      <path
        d="M144 64L132 77L144 90M176 64L188 77L176 90M165 60L155 94"
        fill="none"
        stroke={accent}
        strokeWidth="2.5"
      />
    </>
  ),
  translate: (
    <>
      <path
        d="M162 26H206A8 8 0 0 1 214 34V64A8 8 0 0 1 206 72H202L206 84L188 72H162A8 8 0 0 1 154 64V34A8 8 0 0 1 162 26Z"
        fill={soft}
        stroke={accent}
        strokeWidth="2.5"
      />
      <path
        d="M114 50H158A8 8 0 0 1 166 58V88A8 8 0 0 1 158 96H132L116 108L120 96H114A8 8 0 0 1 106 88V58A8 8 0 0 1 114 50Z"
        fill={surface}
        stroke={accent}
        strokeWidth="2.5"
      />
      <text
        x="184"
        y="50"
        fontSize="22"
        fill={accent}
        textAnchor="middle"
        dominantBaseline="central"
      >
        文
      </text>
      <text
        x="136"
        y="74"
        fontSize="22"
        fill={accent}
        fontFamily={mono}
        textAnchor="middle"
        dominantBaseline="central"
      >
        A
      </text>
    </>
  ),
};

export type HelpIconName =
  | "share"
  | "ideas"
  | "expertise"
  | "build"
  | "translate";

/** Card illustration for one way to help, drawn on the tile grid's 320-wide canvas. */
export function HelpIcon(props: { name: HelpIconName }) {
  return (
    <svg
      className="oc-art"
      viewBox="0 0 320 132"
      aria-hidden="true"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M70 118H250" stroke={line} strokeWidth="2" />
      {icons[props.name]}
    </svg>
  );
}
