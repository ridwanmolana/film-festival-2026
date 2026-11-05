"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { EVENT_CONSTANTS } from "@/lib/constants";
import { Sparkles } from "lucide-react";

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

const emptySubscribe = () => () => {};

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function CountdownTimer() {
  const isMounted = useIsMounted();
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    // Target: 8 December 2026 08:30:00 WIB (Asia/Jakarta = UTC+7)
    const targetDate = new Date("2026-12-08T08:30:00+07:00").getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center gap-3 sm:gap-4 my-6 py-4 opacity-50">
        {[
          { label: "DAYS", val: "--" },
          { label: "HOURS", val: "--" },
          { label: "MINUTES", val: "--" },
          { label: "SECONDS", val: "--" },
        ].map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center w-16 sm:w-20 h-20 rounded-xl bg-slate-900/80 border border-amber-500/20"
          >
            <span className="text-xl sm:text-2xl font-bold text-amber-200">
              {item.val}
            </span>
            <span className="text-[10px] tracking-wider text-slate-400 mt-1">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (timeLeft.isExpired) {
    return (
      <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm font-semibold my-6">
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span>Film Festival Awards 2026 is LIVE at GPS Theater!</span>
      </div>
    );
  }

  const timeBlocks = [
    { label: "DAYS", value: String(timeLeft.days).padStart(2, "0") },
    { label: "HOURS", value: String(timeLeft.hours).padStart(2, "0") },
    { label: "MINUTES", value: String(timeLeft.minutes).padStart(2, "0") },
    { label: "SECONDS", value: String(timeLeft.seconds).padStart(2, "0") },
  ];

  return (
    <div className="flex flex-col items-center my-6">
      <div className="flex items-center gap-2 sm:gap-3">
        {timeBlocks.map((block, idx) => (
          <div key={idx} className="flex items-center">
            <div className="flex flex-col items-center justify-center w-16 sm:w-20 md:w-24 h-20 sm:h-24 rounded-xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-amber-500/30 shadow-lg shadow-amber-500/5 backdrop-blur-md transition-transform hover:border-amber-400/60">
              <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight font-mono text-amber-200 drop-shadow-[0_0_12px_rgba(212,175,55,0.4)]">
                {block.value}
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-slate-400 uppercase mt-1">
                {block.label}
              </span>
            </div>
            {idx < timeBlocks.length - 1 && (
              <span className="text-amber-400/60 font-bold text-lg sm:text-2xl mx-1 sm:mx-1.5 animate-pulse">
                :
              </span>
            )}
          </div>
        ))}
      </div>
      <p className="text-[11px] text-amber-400/70 tracking-widest uppercase mt-3 font-medium">
        Countdown to Premiere • {EVENT_CONSTANTS.VENUE}
      </p>
    </div>
  );
}
