/** Circular "Book It!" badge inspired by the classic Pizza Hut reading program. */
export default function BookItBadge({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      className={className}
      aria-label="Book It! badge"
      role="img"
    >
      {/* Outer ring */}
      <circle cx="32" cy="32" r="31" fill="#b91c1c" />
      {/* Mid ring (shadow groove) */}
      <circle cx="32" cy="32" r="28" fill="#991b1b" />
      {/* Inner badge face */}
      <circle cx="32" cy="32" r="25" fill="#dc2626" />

      {/* Gold star */}
      <polygon
        points="32,10 34.9,20.5 46,20.5 37,27 40,37.5 32,31 24,37.5 27,27 18,20.5 29.1,20.5"
        fill="#fbbf24"
        stroke="#f59e0b"
        strokeWidth="0.5"
      />

      {/* Book open on star */}
      <rect x="26" y="21" width="12" height="9" rx="0.5" fill="white" opacity="0.9" />
      <line x1="32" y1="21" x2="32" y2="30" stroke="#dc2626" strokeWidth="1" />
      {/* Page lines left */}
      <line x1="27.5" y1="23.5" x2="31" y2="23.5" stroke="#dc2626" strokeWidth="0.7" opacity="0.6" />
      <line x1="27.5" y1="25.5" x2="31" y2="25.5" stroke="#dc2626" strokeWidth="0.7" opacity="0.6" />
      <line x1="27.5" y1="27.5" x2="31" y2="27.5" stroke="#dc2626" strokeWidth="0.7" opacity="0.6" />
      {/* Page lines right */}
      <line x1="33" y1="23.5" x2="36.5" y2="23.5" stroke="#dc2626" strokeWidth="0.7" opacity="0.6" />
      <line x1="33" y1="25.5" x2="36.5" y2="25.5" stroke="#dc2626" strokeWidth="0.7" opacity="0.6" />
      <line x1="33" y1="27.5" x2="36.5" y2="27.5" stroke="#dc2626" strokeWidth="0.7" opacity="0.6" />

      {/* "BOOK" arc text (top) */}
      <path id="top-arc" d="M 10,32 A 22,22 0 0,1 54,32" fill="none" />
      <text fontSize="7.5" fontWeight="900" fill="white" letterSpacing="2" fontFamily="Arial, sans-serif">
        <textPath href="#top-arc" startOffset="12%">BOOK</textPath>
      </text>

      {/* "IT!" arc text (bottom) */}
      <path id="bot-arc" d="M 13,38 A 22,22 0 0,0 51,38" fill="none" />
      <text fontSize="7.5" fontWeight="900" fill="#fbbf24" letterSpacing="3" fontFamily="Arial, sans-serif">
        <textPath href="#bot-arc" startOffset="22%">IT!</textPath>
      </text>

      {/* Shine on badge */}
      <ellipse cx="24" cy="16" rx="6" ry="3" fill="white" opacity="0.12" transform="rotate(-30 24 16)" />
    </svg>
  );
}
