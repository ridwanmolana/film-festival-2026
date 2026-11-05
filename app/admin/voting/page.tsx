import { getVotingAdminOverview } from "@/lib/admin/voting";
import { VotingManagement } from "@/components/admin/voting-management";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function AdminVotingPage() {
  const { status, stats } = await getVotingAdminOverview();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Overview</span>
        </Link>
      </div>

      <Card className="cinematic-card">
        <CardContent className="p-6">
          <VotingManagement initialStatus={status} initialStats={stats} />
        </CardContent>
      </Card>
    </div>
  );
}

