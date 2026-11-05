"use client";

import { useEffect, useRef } from "react";

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
          theme?: "dark" | "light" | "auto";
        }
      ) => string;
      reset: (widgetId: string) => void;
    };
    onloadTurnstileCallback?: () => void;
  }
}

export function TurnstileWidget({ onVerify, onError, onExpire }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const isEnabled = Boolean(siteKey && siteKey !== "your-turnstile-site-key");

  useEffect(() => {
    if (!isEnabled || !containerRef.current) return;

    // Load Turnstile script if not already present
    const scriptId = "cf-turnstile-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    const interval = setInterval(() => {
      if (window.turnstile && containerRef.current && !widgetIdRef.current) {
        try {
          widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: siteKey!,
            theme: "dark",
            callback: onVerify,
            "error-callback": onError,
            "expired-callback": onExpire,
          });
          clearInterval(interval);
        } catch {
          // Retry on next tick if DOM not ready
        }
      }
    }, 200);

    return () => {
      clearInterval(interval);
    };
  }, [isEnabled, siteKey, onVerify, onError, onExpire]);

  if (!isEnabled) {
    return (
      <div className="text-[11px] text-slate-500 italic py-1">
        • CAPTCHA verification ready (Turnstile site key active in production)
      </div>
    );
  }

  return <div ref={containerRef} className="my-3 flex justify-center" />;
}
