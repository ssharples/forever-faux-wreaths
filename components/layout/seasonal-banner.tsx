"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SeasonalBannerProps {
  text: string;
  variant?: "sage" | "christmas" | "spring";
  enabled?: boolean;
}

// Helper to check localStorage safely (only on client)
function getInitialVisibility(enabled: boolean): boolean {
  if (typeof window === "undefined") return false;
  const dismissed = localStorage.getItem("seasonal-banner-dismissed");
  return !dismissed && enabled;
}

export function SeasonalBanner({
  text,
  variant = "sage",
  enabled = true,
}: SeasonalBannerProps) {
  const [isVisible, setIsVisible] = useState(() => getInitialVisibility(enabled));

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("seasonal-banner-dismissed", "true");
  };

  if (!isVisible) return null;

  const variantStyles = {
    sage: "bg-sage-400 text-white",
    christmas: "bg-[#8B2635] text-white",
    spring: "bg-blush-400 text-charcoal-700",
  };

  return (
    <div
      className={cn(
        "relative isolate flex items-center justify-between gap-x-2 overflow-hidden px-3 py-2 sm:px-6 sm:py-2.5",
        variantStyles[variant]
      )}
    >
      {/* Decorative background elements - hidden on mobile */}
      <div
        className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl hidden sm:block"
        aria-hidden="true"
      >
        <div
          className="aspect-[577/310] w-[36.0625rem] opacity-30"
          style={{
            background:
              "linear-gradient(to right, rgba(255,255,255,0.3), rgba(255,255,255,0.1))",
          }}
        />
      </div>
      <div
        className="absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl hidden sm:block"
        aria-hidden="true"
      >
        <div
          className="aspect-[577/310] w-[36.0625rem] opacity-30"
          style={{
            background:
              "linear-gradient(to right, rgba(255,255,255,0.1), rgba(255,255,255,0.3))",
          }}
        />
      </div>

      <p className="text-xs sm:text-sm leading-5 sm:leading-6 text-center flex-1 min-w-0">
        <span className="font-medium">{text}</span>
      </p>

      <button
        type="button"
        className="-m-1 p-1 opacity-70 hover:opacity-100 transition-opacity flex-shrink-0"
        onClick={handleDismiss}
      >
        <span className="sr-only">Dismiss</span>
        <X className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
      </button>
    </div>
  );
}
