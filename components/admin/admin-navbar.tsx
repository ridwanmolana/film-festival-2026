"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { EVENT_CONSTANTS } from "@/lib/constants";
import { signOutAdmin } from "@/lib/auth";
import {
  Film,
  Shield,
  ArrowLeft,
  LayoutDashboard,
  MessageSquare,
  Award,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Films", href: "/admin/films", icon: Film },
  { label: "Voting", href: "/admin/voting", icon: Award },
  { label: "Comments", href: "/admin/comments", icon: MessageSquare },
  { label: "Event Settings", href: "/admin/event", icon: Settings },
];

export function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOutAdmin();
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Sign out error:", err);
      setIsSigningOut(false);
    }
  };

  return (
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

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                    isActive
                      ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 font-medium"
                      : "text-slate-300 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-4 text-xs">
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
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 text-xs flex items-center gap-1.5 h-8 px-2.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{isSigningOut ? "Keluar..." : "Sign Out"}</span>
          </Button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle Admin Navigation Menu"
            className="p-2 rounded-lg bg-slate-900 border border-slate-700/60 text-slate-200 hover:text-amber-400 hover:border-amber-500/40 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-amber-500/20 bg-slate-950/95 backdrop-blur-xl px-4 pt-3 pb-5 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                      : "text-slate-200 hover:bg-slate-900"
                  }`}
                >
                  <Icon className="w-4 h-4 text-amber-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-amber-300"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public View</span>
            </Link>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="text-xs flex items-center gap-1.5 h-8"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isSigningOut ? "Keluar..." : "Sign Out"}</span>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
