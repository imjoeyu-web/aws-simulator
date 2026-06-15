import React from 'react';

const MOODS = {
  worried: {
    leftBrow:  'M42 90 L76 85 L76 93 L42 98 Z',
    rightBrow: 'M104 85 L138 90 L138 98 L104 93 Z',
    leftEye:   { cx: 61, cy: 108, rx: 14, ry: 12 },
    rightEye:  { cx: 119, cy: 108, rx: 14, ry: 12 },
    mouth:     'M68 150 Q90 160 112 150',
    mouthFill: null,
    sweat:     true,
  },
  determined: {
    leftBrow:  'M44 88 L76 85 L76 92 L44 95 Z',
    rightBrow: 'M104 85 L136 88 L136 95 L104 92 Z',
    leftEye:   { cx: 61, cy: 108, rx: 14, ry: 12 },
    rightEye:  { cx: 119, cy: 108, rx: 14, ry: 12 },
    mouth:     'M70 152 L110 152',
    mouthFill: null,
    sweat:     false,
  },
  happy: {
    leftBrow:  'M44 84 L76 82 L76 89 L44 91 Z',
    rightBrow: 'M104 82 L136 84 L136 91 L104 89 Z',
    leftEye:   { cx: 61, cy: 109, rx: 14, ry: 10 },
    rightEye:  { cx: 119, cy: 109, rx: 14, ry: 10 },
    mouth:     'M66 150 Q90 140 114 150',
    mouthFill: 'white',
    sweat:     false,
  },
  ecstatic: {
    leftBrow:  'M44 80 L76 77 L76 84 L44 87 Z',
    rightBrow: 'M104 77 L136 80 L136 87 L104 84 Z',
    leftEye:   { cx: 61, cy: 110, rx: 14, ry: 8 },
    rightEye:  { cx: 119, cy: 110, rx: 14, ry: 8 },
    mouth:     'M62 150 Q90 134 118 150',
    mouthFill: 'white',
    sweat:     false,
  },
};

export default function SajangCharacter({ size = 180, mood = 'worried' }) {
  const m = MOODS[mood] || MOODS.worried;

  return (
    <svg
      width={size}
      height={size * 1.5}
      viewBox="0 0 180 270"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      {/* 그림자 */}
      <ellipse cx="90" cy="265" rx="52" ry="8" fill="black" opacity="0.18"/>

      {/* 왼팔 */}
      <path d="M56 218 C38 212 30 232 34 252" stroke="#EEC090" strokeWidth="22" strokeLinecap="round"/>
      <circle cx="34" cy="254" r="13" fill="#EEC090"/>

      {/* 오른팔 (만두 들기) */}
      <path d="M124 214 C142 206 150 186 144 168" stroke="#EEC090" strokeWidth="22" strokeLinecap="round"/>
      <circle cx="143" cy="164" r="13" fill="#EEC090"/>

      {/* 만두 */}
      <ellipse cx="148" cy="148" rx="18" ry="13" fill="#FFF8F0"/>
      <ellipse cx="148" cy="144" rx="15" ry="9" fill="#FFFCF8"/>
      <path d="M133 143 Q137 138 141 143" stroke="#D4C4B0" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M141 141 Q145 136 149 141" stroke="#D4C4B0" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M149 141 Q153 136 157 141" stroke="#D4C4B0" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M157 143 Q161 138 165 143" stroke="#D4C4B0" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M143 134 Q147 127 143 120" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
      <path d="M151 132 Q155 125 151 118" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>

      {/* 몸통 */}
      <path d="M52 208 C52 198 66 191 76 189 L90 196 L104 189 C114 191 128 198 128 208 L126 266 C126 271 120 274 112 274 L68 274 C60 274 54 271 54 266 Z" fill="#2D8C2D"/>

      {/* 나비넥타이 */}
      <path d="M72 189 L83 197 L72 205 Z" fill="#E53E3E"/>
      <path d="M108 189 L97 197 L108 205 Z" fill="#E53E3E"/>
      <circle cx="90" cy="197" r="6" fill="#CC1010"/>

      {/* 목 */}
      <rect x="76" y="193" width="28" height="16" rx="8" fill="#EEC090"/>

      {/* HEAD */}
      <ellipse cx="90" cy="120" rx="66" ry="76" fill="#F5D0A0"/>

      {/* 통통한 볼 */}
      <ellipse cx="24" cy="124" rx="17" ry="22" fill="#EEC090"/>
      <ellipse cx="156" cy="124" rx="17" ry="22" fill="#EEC090"/>

      {/* 모자 밴드 */}
      <rect x="64" y="44" width="52" height="24" rx="4" fill="white"/>
      {/* 모자 돔 */}
      <ellipse cx="90" cy="28" rx="46" ry="38" fill="#E53E3E"/>
      <ellipse cx="76" cy="16" rx="16" ry="10" fill="#EF6060" opacity="0.4"/>
      <text x="90" y="33" textAnchor="middle" fontFamily="'Noto Sans KR', Arial, sans-serif" fontSize="13" fontWeight="900" fill="white">만두</text>

      {/* 눈썹 (mood에 따라 변함) */}
      <path d={m.leftBrow}  fill="#2C1408"/>
      <path d={m.rightBrow} fill="#2C1408"/>

      {/* 눈 (mood에 따라 크기 변함) */}
      <ellipse cx={m.leftEye.cx}  cy={m.leftEye.cy}  rx={m.leftEye.rx}  ry={m.leftEye.ry}  fill="white"/>
      <circle  cx={m.leftEye.cx + 2}  cy={m.leftEye.cy + 3}  r="9" fill="#1C0808"/>
      <circle  cx={m.leftEye.cx + 5}  cy={m.leftEye.cy - 2} r="3.5" fill="white"/>

      <ellipse cx={m.rightEye.cx} cy={m.rightEye.cy} rx={m.rightEye.rx} ry={m.rightEye.ry} fill="white"/>
      <circle  cx={m.rightEye.cx - 2} cy={m.rightEye.cy + 3} r="9" fill="#1C0808"/>
      <circle  cx={m.rightEye.cx + 3} cy={m.rightEye.cy - 2} r="3.5" fill="white"/>

      {/* 코 */}
      <ellipse cx="90" cy="128" rx="21" ry="18" fill="#E07020"/>
      <ellipse cx="81" cy="121" rx="8" ry="5.5" fill="#F0A040" opacity="0.5"/>

      {/* 입 (mood에 따라 변함) */}
      <path d={m.mouth} stroke="#2C1408" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      {m.mouthFill && (
        <>
          <path d={m.mouth + ' Z'} fill={m.mouthFill} opacity="0.9"/>
          {/* 이빨 */}
          <clipPath id="toothClip">
            <path d={m.mouth + ' L' + (mood === 'ecstatic' ? '62 150' : '66 150') + ' Z'}/>
          </clipPath>
        </>
      )}

      {/* 홍조 */}
      <ellipse cx="36" cy="132" rx="17" ry="12" fill="#FF5050" opacity="0.28"/>
      <ellipse cx="144" cy="132" rx="17" ry="12" fill="#FF5050" opacity="0.28"/>

      {/* 땀방울 (worried 상태) */}
      {m.sweat && (
        <>
          <ellipse cx="136" cy="90" rx="5" ry="8" fill="#7ec8e3" opacity="0.85"/>
          <ellipse cx="136" cy="86" rx="5" ry="5" fill="#7ec8e3" opacity="0.85"/>
        </>
      )}

      {/* 별빛 (ecstatic 상태) */}
      {mood === 'ecstatic' && (
        <>
          <text x="22"  y="95"  fontSize="16" opacity="0.9">✨</text>
          <text x="145" y="80"  fontSize="14" opacity="0.9">⭐</text>
          <text x="28"  y="165" fontSize="12" opacity="0.7">✨</text>
        </>
      )}
    </svg>
  );
}
