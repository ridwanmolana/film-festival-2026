import Link from "next/link";
import { EVENT_CONSTANTS } from "@/lib/constants";
import {
  Film,
  Shield,
  ArrowLeft,
  LayoutDashboard,
  MessageSquare,
  Award,
  Settings,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col">
      <header className="border-b border-amber-500/20 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Film className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-sm tracking-wide text-white flex items-center gap-2">
                  <span>{EVENT_CONSTANTS.TITLE}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    Admin
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {EVENT_CONSTANTS.SCHOOL}
                </p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1 text-xs">
              <Link
                href="/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Overview</span>
              </Link>
              <Link
                href="/admin/films"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
              >
                <Film className="w-3.5 h-3.5" />
                <span>Films</span>
              </Link>
              <Link
                href="/admin/voting"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Voting</span>
              </Link>
              <Link
                href="/admin/comments"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Comments</span>
              </Link>
              <Link
                href="/admin/event"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Event Settings</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-slate-300 hover:text-amber-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Public View</span>
            </Link>
            <div className="flex items-center gap-1.5 text-amber-400/90 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
