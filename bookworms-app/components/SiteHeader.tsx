import WormMascot from "@/components/WormMascot";
import BookItBadge from "@/components/BookItBadge";

export default function SiteHeader() {
  return (
    <a
      href="/"
      className="flex items-center justify-center gap-4 py-4 bg-indigo-700 hover:bg-indigo-800 transition-colors text-white"
    >
      <WormMascot className="w-14 h-14 drop-shadow" />
      <div className="text-center">
        <div className="text-2xl font-bold tracking-wide">Shawties Bookworms</div>
        <div className="text-xs text-indigo-200 uppercase tracking-widest mt-0.5">Reading Challenge</div>
      </div>
      <BookItBadge className="w-14 h-14 drop-shadow" />
    </a>
  );
}
