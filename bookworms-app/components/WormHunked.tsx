/** Worm mascot variant: absolutely jacked worm with massive arms (Triple Bonus). */
export default function WormHunked({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 114"
      className={className}
      aria-label="Jacked worm mascot"
      role="img"
    >
      {/* Thick body segments */}
      <circle cx="50" cy="78" r="13" fill="#a3e635" stroke="#65a30d" strokeWidth="1.5" />
      <circle cx="50" cy="60" r="13" fill="#bef264" stroke="#65a30d" strokeWidth="1.5" />
      <circle cx="50" cy="42" r="13" fill="#a3e635" stroke="#65a30d" strokeWidth="1.5" />

      {/* LEFT massive leg */}
      {/* Thigh */}
      <line x1="44" y1="89" x2="36" y2="103" stroke="#65a30d" strokeWidth="13" strokeLinecap="round" />
      {/* Quad bulge */}
      <circle cx="39" cy="97" r="9" fill="#a3e635" stroke="#65a30d" strokeWidth="1.5" />
      {/* Calf */}
      <line x1="36" y1="103" x2="33" y2="111" stroke="#65a30d" strokeWidth="10" strokeLinecap="round" />
      {/* Foot */}
      <ellipse cx="30" cy="112" rx="10" ry="5" fill="#bef264" stroke="#65a30d" strokeWidth="1.5" />

      {/* RIGHT massive leg */}
      <line x1="56" y1="89" x2="64" y2="103" stroke="#65a30d" strokeWidth="13" strokeLinecap="round" />
      <circle cx="61" cy="97" r="9" fill="#a3e635" stroke="#65a30d" strokeWidth="1.5" />
      <line x1="64" y1="103" x2="67" y2="111" stroke="#65a30d" strokeWidth="10" strokeLinecap="round" />
      <ellipse cx="70" cy="112" rx="10" ry="5" fill="#bef264" stroke="#65a30d" strokeWidth="1.5" />

      {/* Six-pack lines on mid segment */}
      <line x1="44" y1="55" x2="56" y2="55" stroke="#65a30d" strokeWidth="1" opacity="0.5" />
      <line x1="44" y1="61" x2="56" y2="61" stroke="#65a30d" strokeWidth="1" opacity="0.5" />
      <line x1="50" y1="53" x2="50" y2="68" stroke="#65a30d" strokeWidth="1" opacity="0.4" />

      {/* LEFT massive arm */}
      {/* Upper arm */}
      <line x1="38" y1="48" x2="18" y2="30" stroke="#65a30d" strokeWidth="14" strokeLinecap="round" />
      {/* Huge bicep */}
      <circle cx="23" cy="36" r="13" fill="#a3e635" stroke="#65a30d" strokeWidth="1.5" />
      {/* Forearm */}
      <line x1="18" y1="30" x2="6" y2="52" stroke="#65a30d" strokeWidth="12" strokeLinecap="round" />
      {/* Massive fist */}
      <circle cx="4" cy="58" r="10" fill="#bef264" stroke="#65a30d" strokeWidth="1.5" />
      {/* Fist knuckles */}
      <line x1="-1" y1="54" x2="9" y2="54" stroke="#65a30d" strokeWidth="1" opacity="0.6" />
      <line x1="-1" y1="57" x2="9" y2="57" stroke="#65a30d" strokeWidth="1" opacity="0.6" />

      {/* RIGHT massive arm */}
      <line x1="62" y1="48" x2="82" y2="30" stroke="#65a30d" strokeWidth="14" strokeLinecap="round" />
      <circle cx="77" cy="36" r="13" fill="#a3e635" stroke="#65a30d" strokeWidth="1.5" />
      <line x1="82" y1="30" x2="94" y2="52" stroke="#65a30d" strokeWidth="12" strokeLinecap="round" />
      <circle cx="96" cy="58" r="10" fill="#bef264" stroke="#65a30d" strokeWidth="1.5" />
      <line x1="91" y1="54" x2="101" y2="54" stroke="#65a30d" strokeWidth="1" opacity="0.6" />
      <line x1="91" y1="57" x2="101" y2="57" stroke="#65a30d" strokeWidth="1" opacity="0.6" />

      {/* Head */}
      <circle cx="50" cy="20" r="16" fill="#bef264" stroke="#65a30d" strokeWidth="1.5" />

      {/* Graduation cap */}
      <rect x="36" y="5" width="28" height="5" rx="1" fill="#312e81" />
      <rect x="38" y="0" width="24" height="6" rx="1" fill="#4338ca" />
      <line x1="62" y1="2" x2="72" y2="7" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="72" cy="8" r="2.5" fill="#fbbf24" />

      {/* Sunglasses (dark lenses — too cool for regular glasses) */}
      <rect x="33" y="15" width="14" height="9" rx="2" fill="#1e1b4b" stroke="#0f0f23" strokeWidth="1" />
      <rect x="50" y="15" width="14" height="9" rx="2" fill="#1e1b4b" stroke="#0f0f23" strokeWidth="1" />
      {/* Shine on lenses */}
      <line x1="35" y1="17" x2="38" y2="17" stroke="white" strokeWidth="1" opacity="0.4" strokeLinecap="round" />
      <line x1="52" y1="17" x2="55" y2="17" stroke="white" strokeWidth="1" opacity="0.4" strokeLinecap="round" />
      {/* Bridge */}
      <line x1="47" y1="20" x2="50" y2="20" stroke="#0f0f23" strokeWidth="1.5" strokeLinecap="round" />
      {/* Temples */}
      <line x1="33" y1="20" x2="29" y2="18" stroke="#0f0f23" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="64" y1="20" x2="68" y2="18" stroke="#0f0f23" strokeWidth="1.5" strokeLinecap="round" />

      {/* HUGE confident grin */}
      <path d="M 37 30 Q 50 40 63 30" fill="none" stroke="#65a30d" strokeWidth="2.5" strokeLinecap="round" />
      {/* Teeth */}
      <path d="M 37 30 Q 50 40 63 30 Q 56 36 50 36 Q 44 36 37 30" fill="white" opacity="0.7" />

      {/* Sweat drops (hustle) */}
      <ellipse cx="78" cy="15" rx="2" ry="3" fill="#93c5fd" opacity="0.7" />
      <ellipse cx="84" cy="20" rx="1.5" ry="2.5" fill="#93c5fd" opacity="0.5" />
    </svg>
  );
}
