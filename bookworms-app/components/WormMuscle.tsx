/** Worm mascot variant: nerdy worm with small flexing bicep arms (Double Bonus). */
export default function WormMuscle({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 80 82"
      className={className}
      aria-label="Flexing worm mascot"
      role="img"
    >
      {/* Body segments */}
      <circle cx="40" cy="74" r="10" fill="#a3e635" stroke="#65a30d" strokeWidth="1.5" />
      <circle cx="40" cy="58" r="10" fill="#bef264" stroke="#65a30d" strokeWidth="1.5" />
      <circle cx="40" cy="42" r="10" fill="#a3e635" stroke="#65a30d" strokeWidth="1.5" />

      {/* Left arm — flexed bicep */}
      <line x1="31" y1="46" x2="18" y2="34" stroke="#65a30d" strokeWidth="7" strokeLinecap="round" />
      <circle cx="21" cy="37" r="7" fill="#a3e635" stroke="#65a30d" strokeWidth="1.5" />
      <line x1="18" y1="34" x2="10" y2="48" stroke="#65a30d" strokeWidth="6" strokeLinecap="round" />
      <circle cx="8" cy="52" r="6" fill="#bef264" stroke="#65a30d" strokeWidth="1.5" />

      {/* Right arm — flexed bicep */}
      <line x1="49" y1="46" x2="62" y2="34" stroke="#65a30d" strokeWidth="7" strokeLinecap="round" />
      <circle cx="59" cy="37" r="7" fill="#a3e635" stroke="#65a30d" strokeWidth="1.5" />
      <line x1="62" y1="34" x2="70" y2="48" stroke="#65a30d" strokeWidth="6" strokeLinecap="round" />
      <circle cx="72" cy="52" r="6" fill="#bef264" stroke="#65a30d" strokeWidth="1.5" />

      {/* Head */}
      <circle cx="40" cy="22" r="14" fill="#bef264" stroke="#65a30d" strokeWidth="1.5" />

      {/* Graduation cap */}
      <rect x="28" y="8" width="24" height="4" rx="1" fill="#312e81" />
      <rect x="30" y="4" width="20" height="5" rx="1" fill="#4338ca" />
      <line x1="50" y1="6" x2="58" y2="10" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="58" cy="11" r="2" fill="#fbbf24" />

      {/* Eyes */}
      <circle cx="32" cy="22" r="6" fill="white" stroke="#65a30d" strokeWidth="1" />
      <circle cx="48" cy="22" r="6" fill="white" stroke="#65a30d" strokeWidth="1" />
      <circle cx="33" cy="23" r="2.5" fill="#1e1b4b" />
      <circle cx="49" cy="23" r="2.5" fill="#1e1b4b" />

      {/* Glasses frames */}
      <rect x="25.5" y="16" width="13" height="12" rx="3" fill="none" stroke="#1e1b4b" strokeWidth="1.5" />
      <rect x="41.5" y="16" width="13" height="12" rx="3" fill="none" stroke="#1e1b4b" strokeWidth="1.5" />
      <line x1="38.5" y1="22" x2="41.5" y2="22" stroke="#1e1b4b" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="25.5" y1="22" x2="22" y2="20" stroke="#1e1b4b" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="54.5" y1="22" x2="58" y2="20" stroke="#1e1b4b" strokeWidth="1.5" strokeLinecap="round" />

      {/* Determined grin */}
      <path d="M 33 30 Q 40 36 47 30" fill="none" stroke="#65a30d" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
