import type { Metadata } from "next";
import "./globals.css";
import { EVENT_CONSTANTS } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${EVENT_CONSTANTS.TITLE} | ${EVENT_CONSTANTS.SCHOOL}`,
  description: `Official event website for ${EVENT_CONSTANTS.TITLE} at ${EVENT_CONSTANTS.VENUE}, ${EVENT_CONSTANTS.EVENT_DATES}. Featuring 10 student-produced films, audience Best Picture predictions, and community comments.`,
  keywords: [
    "Film Festival Awards 2026",
    "SMP Global Prestasi Bekasi",
    "GPS Theater",
    "Student Films",
    "Best Picture Voting",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-[#060913] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
        {children}
      </body>
    </html>
  );
}
