"use client";

import { useEffect } from "react";
import WormMascot from "@/components/WormMascot";

interface Props {
  phrase: string;
  onDone: () => void;
  /** ms to show before calling onDone. Default: 2800 */
  duration?: number;
}

export default function WormCelebration({ phrase, onDone, duration = 2800 }: Props) {
  useEffect(() => {
    const t = setTimeout(onDone, duration);
    return () => clearTimeout(t);
  }, [onDone, duration]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-indigo-900/80 backdrop-blur-sm">
      {/* Speech bubble */}
      <div className="relative mb-4 max-w-xs">
        <div className="bg-white rounded-2xl px-6 py-4 text-center shadow-xl">
          <p className="text-lg font-bold text-indigo-800">{phrase}</p>
        </div>
        {/* Bubble tail pointing down toward the worm */}
        <div className="absolute left-1/2 -bottom-3 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-white" />
      </div>

      {/* Dancing worm */}
      <WormMascot className="w-32 h-32 worm-dance" />
    </div>
  );
}
