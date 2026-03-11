import { getCurrentChallenge } from "@/lib/config";
import ChallengeDashboard from "@/components/ChallengeDashboard";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const cfg = getCurrentChallenge();
  return <ChallengeDashboard challengeId={cfg.id} isHome={true} />;
}
