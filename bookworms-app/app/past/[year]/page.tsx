import { notFound } from "next/navigation";
import { getChallengeConfig } from "@/lib/config";
import ChallengeDashboard from "@/components/ChallengeDashboard";

export const dynamic = "force-dynamic";

export default async function PastYearPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;

  try {
    getChallengeConfig(year);
  } catch {
    notFound();
  }

  return <ChallengeDashboard challengeId={year} />;
}
