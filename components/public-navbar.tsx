"use client";

import { useState } from "react";
import Link from "next/link";
import { EVENT_CONSTANTS, ROUTES } from "@/lib/constants";
import { Film, Shield, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: ROUTES.HOME },
    { label: "Films (10)", href: ROUTES.FILM_SHOWCASE },
    { label: "Best Picture Prediction", href: ROUTES.VOTING },
    { label: "Community", href: ROUTES.COMMUNITY },
    { label: "Event Info", href: ROUTES.EVENT_INFO },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#060913]/90 border-b border-amber-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href={ROUTES.HOME} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#d4af37] via-[#f3d375] to-[#aa8620] p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-[#060913] rounded-full flex items-center justify-center">
              <Film className="w-5 h-5 text-amber-300" />
            </div>
          </div>
          <div>
            <span className="font-bold text-sm tracking-wider uppercase text-white">
              Film Festival Awards
            </span>
            <span className="text-xs text-amber-400 font-semibold ml-1.5">
              2026
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-widest text-slate-300 font-medium">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-amber-300 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>
        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle Navigation Menu"
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
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm uppercase tracking-wider text-slate-200 hover:bg-amber-500/10 hover:text-amber-300 font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">{EVENT_CONSTANTS.VENUE}</span>
            <Link
              href={ROUTES.ADMIN_LOGIN}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button variant="outline" size="sm" className="text-xs">
                <Shield className="w-3.5 h-3.5 mr-1" />
                Admin Portal
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

