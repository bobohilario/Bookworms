import { notFound } from "next/navigation";
import { getChallengeConfig } from "@/lib/config";
import ChallengeDashboard from "@/components/ChallengeDashboard";

export const dynamic = "force-dynamic";

export default async function ChallengePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    getChallengeConfig(id);
  } catch {
    notFound();
  }

  return <ChallengeDashboard challengeId={id} />;
}
