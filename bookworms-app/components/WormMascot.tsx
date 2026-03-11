export default function WormMascot({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 80"
      className={className}
      aria-label="Nerdy worm mascot"
      role="img"
    >
      {/* Body segments (bottom to top) */}
      <circle cx="32" cy="72" r="10" fill="#a3e635" stroke="#65a30d" strokeWidth="1.5" />
      <circle cx="32" cy="56" r="10" fill="#bef264" stroke="#65a30d" strokeWidth="1.5" />
      <circle cx="32" cy="40" r="10" fill="#a3e635" stroke="#65a30d" strokeWidth="1.5" />

      {/* Head */}
      <circle cx="32" cy="22" r="14" fill="#bef264" stroke="#65a30d" strokeWidth="1.5" />

      {/* Graduation cap base */}
      <rect x="20" y="8" width="24" height="4" rx="1" fill="#312e81" />
      {/* Cap top */}
      <rect x="22" y="4" width="20" height="5" rx="1" fill="#4338ca" />
      {/* Tassel */}
      <line x1="42" y1="6" x2="50" y2="10" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="50" cy="11" r="2" fill="#fbbf24" />

      {/* Eyes — white circles */}
      <circle cx="24" cy="22" r="6" fill="white" stroke="#65a30d" strokeWidth="1" />
      <circle cx="40" cy="22" r="6" fill="white" stroke="#65a30d" strokeWidth="1" />

      {/* Pupils */}
      <circle cx="25" cy="23" r="2.5" fill="#1e1b4b" />
      <circle cx="41" cy="23" r="2.5" fill="#1e1b4b" />

      {/* Glasses frames */}
      <rect x="17.5" y="16" width="13" height="12" rx="3" fill="none" stroke="#1e1b4b" strokeWidth="1.5" />
      <rect x="33.5" y="16" width="13" height="12" rx="3" fill="none" stroke="#1e1b4b" strokeWidth="1.5" />
      {/* Bridge */}
      <line x1="30.5" y1="22" x2="33.5" y2="22" stroke="#1e1b4b" strokeWidth="1.5" strokeLinecap="round" />
      {/* Temple left */}
      <line x1="17.5" y1="22" x2="14" y2="20" stroke="#1e1b4b" strokeWidth="1.5" strokeLinecap="round" />
      {/* Temple right */}
      <line x1="46.5" y1="22" x2="50" y2="20" stroke="#1e1b4b" strokeWidth="1.5" strokeLinecap="round" />

      {/* Smile */}
      <path d="M 26 30 Q 32 35 38 30" fill="none" stroke="#65a30d" strokeWidth="1.5" strokeLinecap="round" />

      {/* Small book held by body */}
      <rect x="40" y="44" width="12" height="15" rx="1" fill="#4f46e5" stroke="#312e81" strokeWidth="1" />
      <line x1="46" y1="44" x2="46" y2="59" stroke="#e0e7ff" strokeWidth="1" />
      <line x1="42" y1="48" x2="45" y2="48" stroke="#e0e7ff" strokeWidth="0.8" />
      <line x1="42" y1="51" x2="45" y2="51" stroke="#e0e7ff" strokeWidth="0.8" />
      <line x1="42" y1="54" x2="45" y2="54" stroke="#e0e7ff" strokeWidth="0.8" />
    </svg>
  );
}
