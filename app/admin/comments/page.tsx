import { getAllCommentsAdmin } from "@/lib/comments";
import { CommentModeration } from "@/components/admin/comment-moderation";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { unstable_noStore } from "next/cache";

// Always read fresh comments; never serve a cached moderation list.
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function AdminCommentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; filter?: string }>;
}) {
  unstable_noStore();

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const filter = (params.filter ?? "all") as "all" | "pending" | "approved" | "hidden";

  const { comments, total } = await getAllCommentsAdmin(filter, page);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <Card className="cinematic-card">
        <CardContent className="p-6">
          <CommentModeration
            initialComments={comments}
            total={total}
            currentPage={page}
            currentFilter={filter}
          />
        </CardContent>
      </Card>
    </div>
  );
}
