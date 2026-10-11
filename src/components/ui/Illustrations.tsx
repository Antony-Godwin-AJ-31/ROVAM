/* Lightweight, consistent flat-vector illustration set (shared palette, no outlines).
   Every graphic is decorative: aria-hidden and not focusable. */
import type { CSSProperties } from "react";

interface SvgProps {
  className?: string;
  style?: CSSProperties;
}

const HEART_PATH =
  "M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2 0 3.5 1.1 5.3 3.2 1.8-2.1 3.3-3.2 5.3-3.2 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z";

export function HeartIcon({ className, style, fill = "var(--color-rose)" }: SvgProps & { fill?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden="true" focusable="false">
      <path d={HEART_PATH} fill={fill} />
    </svg>
  );
}

function FlowerShape({ x, y, s = 1, petal, center = "var(--color-gold)" }: {
  x: number; y: number; s?: number; petal: string; center?: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) translate(-32 -32)`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="32" cy="17" rx="9" ry="14" fill={petal} opacity="0.95" transform={`rotate(${a} 32 32)`} />
      ))}
      <circle cx="32" cy="32" r="6" fill={center} />
    </g>
  );
}

export function DecorativeFlower({ className, style, petal = "var(--color-blush)" }: SvgProps & { petal?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} style={style} aria-hidden="true" focusable="false">
      <FlowerShape x={32} y={32} petal={petal} />
    </svg>
  );
}

export function Sprig({ className, style }: SvgProps) {
  const leaves: [number, number][] = [[150, -1], [120, 1], [92, -1], [64, 1], [38, -1]];
  return (
    <svg viewBox="0 0 120 200" className={className} style={style} aria-hidden="true" focusable="false">
      <path d="M60 196 C56 140 66 80 60 10" stroke="var(--color-sage)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      {leaves.map(([y, side]) => (
        <ellipse
          key={y}
          cx={60 + side * 15}
          cy={y}
          rx="15"
          ry="6.5"
          fill={side > 0 ? "var(--color-sage)" : "var(--color-sage-soft)"}
          transform={`rotate(${side * -32} ${60 + side * 15} ${y})`}
        />
      ))}
      <ellipse cx="60" cy="10" rx="5" ry="9" fill="var(--color-sage)" />
    </svg>
  );
}

/** Corner floral cluster; place in a corner and flip with CSS transforms. */
export function FloralCorner({ className, style }: SvgProps) {
  const leaves: [number, number, number][] = [[44, 40, -28], [78, 62, 18], [112, 98, -22], [130, 150, 20], [60, 70, 70], [84, 36, 5]];
  return (
    <svg viewBox="0 0 240 240" className={className} style={style} aria-hidden="true" focusable="false">
      <path d="M-4 30 C70 36 130 90 150 240" stroke="var(--color-sage)" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M30 -4 C40 70 96 120 240 140" stroke="var(--color-sage)" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      {leaves.map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx="15" ry="6.5" fill={i % 2 ? "var(--color-sage)" : "var(--color-sage-soft)"} transform={`rotate(${r} ${x} ${y})`} />
      ))}
      <FlowerShape x={34} y={34} s={1.05} petal="var(--color-blush)" />
      <FlowerShape x={92} y={80} s={0.7} petal="var(--color-rose)" />
      <FlowerShape x={150} y={122} s={0.85} petal="var(--color-blush)" />
      <FlowerShape x={178} y={176} s={0.55} petal="var(--color-rose)" />
      <circle cx="64" cy="22" r="4" fill="var(--color-gold)" />
      <circle cx="26" cy="86" r="3" fill="var(--color-gold)" />
    </svg>
  );
}

export function Ornament({ className }: SvgProps) {
  return (
    <svg viewBox="0 0 200 24" className={className} aria-hidden="true" focusable="false">
      <path d="M4 12 H84" stroke="var(--color-gold)" strokeWidth="1" strokeLinecap="round" />
      <path d="M116 12 H196" stroke="var(--color-gold)" strokeWidth="1" strokeLinecap="round" />
      <path d={HEART_PATH} fill="var(--color-rose)" transform="translate(88 0)" />
      <circle cx="84" cy="12" r="2" fill="var(--color-gold)" />
      <circle cx="116" cy="12" r="2" fill="var(--color-gold)" />
    </svg>
  );
}

/** The illustrated couple used when no photograph is supplied, and as a small motif elsewhere. */
export function CoupleIllustration({ className, style }: SvgProps) {
  const skin = "#F2D2B6";
  const ink = "#352D2A";
  return (
    <svg viewBox="0 0 240 300" className={className} style={style} aria-hidden="true" focusable="false">
      {/* groom */}
      <rect x="64" y="226" width="14" height="62" rx="5" fill="#463A34" />
      <rect x="84" y="226" width="14" height="62" rx="5" fill="#463A34" />
      <rect x="52" y="132" width="58" height="108" rx="20" fill="#55463F" />
      <path d="M81 134 L68 162 L81 196 L94 162 Z" fill="#FFFFFF" />
      <path d="M81 146 L70 140 L70 152 Z M81 146 L92 140 L92 152 Z" fill="var(--color-rose)" />
      <circle cx="81" cy="100" r="25" fill={skin} />
      <path d="M56 98 C54 70 108 66 106 98 C98 84 70 82 56 98Z" fill="#3B2F2A" />
      <circle cx="73" cy="102" r="1.8" fill={ink} />
      <circle cx="89" cy="102" r="1.8" fill={ink} />
      <path d="M74 112 Q81 118 88 112" stroke={ink} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <circle cx="68" cy="110" r="4" fill="var(--color-blush)" opacity=".7" />
      <circle cx="94" cy="110" r="4" fill="var(--color-blush)" opacity=".7" />
      {/* bride */}
      <path d="M162 80 C130 86 128 156 132 226 L192 226 C196 156 194 86 162 80Z" fill="#FFFFFF" opacity=".55" />
      <path d="M162 138 C142 170 122 262 110 290 L214 290 C202 262 182 170 162 138Z" fill="#FFFFFF" stroke="#E8DCCB" strokeWidth="2" />
      <ellipse cx="162" cy="150" rx="15" ry="20" fill="#FFFFFF" stroke="#E8DCCB" strokeWidth="2" />
      <circle cx="162" cy="102" r="23" fill={skin} />
      <path d="M139 100 C138 72 186 72 185 100 C178 86 150 86 139 100Z" fill="#4A3A33" />
      <circle cx="162" cy="76" r="9" fill="#4A3A33" />
      <circle cx="154" cy="104" r="1.8" fill={ink} />
      <circle cx="170" cy="104" r="1.8" fill={ink} />
      <path d="M155 113 Q162 119 169 113" stroke={ink} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <circle cx="149" cy="111" r="4" fill="var(--color-blush)" opacity=".8" />
      <circle cx="175" cy="111" r="4" fill="var(--color-blush)" opacity=".8" />
      {/* bouquet + hands */}
      <path d="M104 172 C110 180 112 186 120 188" stroke={skin} strokeWidth="9" strokeLinecap="round" fill="none" />
      <ellipse cx="120" cy="188" rx="12" ry="9" fill="var(--color-sage)" />
      <circle cx="113" cy="182" r="7" fill="var(--color-blush)" />
      <circle cx="125" cy="180" r="7" fill="var(--color-rose)" />
      <circle cx="119" cy="192" r="6.5" fill="var(--color-blush)" />
      <circle cx="119" cy="186" r="2.4" fill="var(--color-gold)" />
      {/* hearts */}
      <g transform="translate(108 20) scale(1.5)"><path d={HEART_PATH} fill="var(--color-rose)" /></g>
      <g transform="translate(70 44) scale(0.8) rotate(-14 12 12)"><path d={HEART_PATH} fill="var(--color-blush)" /></g>
      <g transform="translate(150 40) scale(0.7) rotate(14 12 12)"><path d={HEART_PATH} fill="var(--color-blush)" /></g>
    </svg>
  );
}

/**
 * Architectural fine-line illustration of Annai Velankanni Mini Basilica (Besant Nagar, Chennai).
 * Features the iconic twin gothic spires, central cruciform gables, rose window, and gothic portals.
 */
export function ChurchIllustration({ className, style }: SvgProps) {
  return (
    <svg viewBox="0 0 320 220" className={className} style={style} aria-hidden="true" focusable="false">
      {/* Foundation & Steps */}
      <path d="M20 205 L300 205 M35 210 L285 210 M10 215 L310 215" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" />
      
      {/* Main Base Body */}
      <rect x="70" y="115" width="180" height="90" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" />
      
      {/* Central Nave & Gable */}
      <path d="M110 115 L160 62 L210 115" fill="none" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M118 115 L160 70 L202 115" fill="none" stroke="var(--color-sage)" strokeWidth="1" strokeLinecap="round" />
      
      {/* Cross atop Central Gable */}
      <line x1="160" y1="46" x2="160" y2="62" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" />
      <line x1="154" y1="52" x2="166" y2="52" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" />
      
      {/* Central Rose Window */}
      <circle cx="160" cy="98" r="14" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" />
      <circle cx="160" cy="98" r="7" fill="none" stroke="var(--color-sage)" strokeWidth="1" />
      {[0, 45, 90, 135].map((angle) => (
        <line
          key={angle}
          x1="160"
          y1="91"
          x2="160"
          y2="105"
          stroke="var(--color-gold)"
          strokeWidth="1"
          transform={`rotate(${angle} 160 98)`}
        />
      ))}

      {/* Main Arched Entrance (Basilica Portal) */}
      <path d="M142 205 L142 165 C142 150 178 150 178 165 L178 205" fill="none" stroke="var(--color-gold)" strokeWidth="1.8" />
      <path d="M147 205 L147 167 C147 155 173 155 173 167 L173 205" fill="none" stroke="var(--color-sage)" strokeWidth="1" />
      <line x1="160" y1="156" x2="160" y2="205" stroke="var(--color-gold)" strokeWidth="1" strokeDasharray="3 3" />
      
      {/* Left Tower */}
      <rect x="60" y="80" width="46" height="125" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" />
      <line x1="56" y1="80" x2="110" y2="80" stroke="var(--color-gold)" strokeWidth="2" />
      {/* Left Belfry Louvers */}
      <path d="M74 135 L74 110 C74 102 92 102 92 110 L92 135" fill="none" stroke="var(--color-gold)" strokeWidth="1.2" />
      <line x1="74" y1="118" x2="92" y2="118" stroke="var(--color-sage)" strokeWidth="1" />
      <line x1="74" y1="126" x2="92" y2="126" stroke="var(--color-sage)" strokeWidth="1" />
      {/* Left Spire (Gothic Pyramid) */}
      <path d="M60 80 L83 18 L106 80 Z" fill="none" stroke="var(--color-gold)" strokeWidth="1.8" strokeLinejoin="round" />
      <line x1="83" y1="18" x2="83" y2="80" stroke="var(--color-sage)" strokeWidth="1" />
      {/* Left Cross */}
      <line x1="83" y1="6" x2="83" y2="18" stroke="var(--color-gold)" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="78" y1="11" x2="88" y2="11" stroke="var(--color-gold)" strokeWidth="1.8" strokeLinecap="round" />
      
      {/* Right Tower */}
      <rect x="214" y="80" width="46" height="125" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" />
      <line x1="210" y1="80" x2="264" y2="80" stroke="var(--color-gold)" strokeWidth="2" />
      {/* Right Belfry Louvers */}
      <path d="M228 135 L228 110 C228 102 246 102 246 110 L246 135" fill="none" stroke="var(--color-gold)" strokeWidth="1.2" />
      <line x1="228" y1="118" x2="246" y2="118" stroke="var(--color-sage)" strokeWidth="1" />
      <line x1="228" y1="126" x2="246" y2="126" stroke="var(--color-sage)" strokeWidth="1" />
      {/* Right Spire (Gothic Pyramid) */}
      <path d="M214 80 L237 18 L260 80 Z" fill="none" stroke="var(--color-gold)" strokeWidth="1.8" strokeLinejoin="round" />
      <line x1="237" y1="18" x2="237" y2="80" stroke="var(--color-sage)" strokeWidth="1" />
      {/* Right Cross */}
      <line x1="237" y1="6" x2="237" y2="18" stroke="var(--color-gold)" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="232" y1="11" x2="242" y2="11" stroke="var(--color-gold)" strokeWidth="1.8" strokeLinecap="round" />

      {/* Decorative Floral flourishes on left/right ground */}
      <path d="M25 198 C35 185 45 195 55 190" stroke="var(--color-sage)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <circle cx="35" cy="188" r="3" fill="var(--color-blush)" />
      <path d="M295 198 C285 185 275 195 265 190" stroke="var(--color-sage)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <circle cx="285" cy="188" r="3" fill="var(--color-blush)" />
    </svg>
  );
}

/**
 * Botanical header frame embellishment.
 */
export function BotanicalFrame({ className, style }: SvgProps) {
  return (
    <svg viewBox="0 0 360 44" className={className} style={style} aria-hidden="true" focusable="false">
      <path d="M20 22 C70 22 120 12 155 22" stroke="var(--color-gold)" strokeWidth="1" fill="none" strokeLinecap="round" />
      <path d="M340 22 C290 22 240 12 205 22" stroke="var(--color-gold)" strokeWidth="1" fill="none" strokeLinecap="round" />
      <circle cx="180" cy="22" r="5" fill="none" stroke="var(--color-gold)" strokeWidth="1.2" />
      <circle cx="180" cy="22" r="2.5" fill="var(--color-rose)" />
      <path d="M172 22 Q164 16 168 12 Q176 16 172 22 Z" fill="var(--color-sage-soft)" />
      <path d="M188 22 Q196 16 192 12 Q184 16 188 22 Z" fill="var(--color-sage-soft)" />
      <circle cx="130" cy="16" r="3" fill="var(--color-blush)" />
      <circle cx="230" cy="16" r="3" fill="var(--color-blush)" />
      <circle cx="90" cy="20" r="2" fill="var(--color-gold)" />
      <circle cx="270" cy="20" r="2" fill="var(--color-gold)" />
    </svg>
  );
}

/**
 * Elegant Crescent Moon with gentle stars.
 */
export function CrescentMoon({ className, style }: SvgProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} style={style} aria-hidden="true" focusable="false">
      <path
        d="M34 10 C20 10 12 22 12 36 C12 50 24 58 38 56 C28 50 26 36 32 24 C35 18 42 14 46 12 C42 10.6 38 10 34 10 Z"
        fill="var(--color-gold)"
        opacity="0.85"
      />
      <circle cx="48" cy="22" r="2" fill="var(--color-gold)" opacity="0.9" />
      <circle cx="42" cy="40" r="1.5" fill="var(--color-gold)" opacity="0.75" />
      <circle cx="50" cy="34" r="1" fill="var(--color-gold)" opacity="0.6" />
    </svg>
  );
}

/**
 * Delicate butterfly with soft fluttering wings.
 */
export function ButterflyIllustration({ className, style }: SvgProps) {
  return (
    <svg viewBox="0 0 48 40" className={className} style={style} aria-hidden="true" focusable="false">
      {/* Left upper wing */}
      <path
        d="M24 20 C22 12 12 4 4 10 C-2 15 2 26 12 26 C16 26 21 23 24 20 Z"
        fill="var(--color-blush)"
        stroke="var(--color-gold)"
        strokeWidth="0.8"
        opacity="0.85"
      />
      {/* Left lower wing */}
      <path
        d="M24 21 C20 25 12 28 8 34 C5 39 12 40 18 35 C22 31 23 25 24 21 Z"
        fill="var(--color-rose)"
        opacity="0.7"
      />
      {/* Right upper wing */}
      <path
        d="M24 20 C26 12 36 4 44 10 C50 15 46 26 36 26 C32 26 27 23 24 20 Z"
        fill="var(--color-blush)"
        stroke="var(--color-gold)"
        strokeWidth="0.8"
        opacity="0.85"
      />
      {/* Right lower wing */}
      <path
        d="M24 21 C28 25 36 28 40 34 C43 39 36 40 30 35 C26 31 25 25 24 21 Z"
        fill="var(--color-rose)"
        opacity="0.7"
      />
      {/* Body & Antennae */}
      <ellipse cx="24" cy="22" rx="1.5" ry="7" fill="var(--color-brown)" />
      <path d="M23 15 Q19 9 17 8 M25 15 Q29 9 31 8" stroke="var(--color-brown)" strokeWidth="0.8" fill="none" strokeLinecap="round" />
    </svg>
  );
}
