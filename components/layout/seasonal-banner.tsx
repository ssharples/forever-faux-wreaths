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
        "relative isolate flex items-center gap-x-6 overflow-hidden px-6 py-2.5 sm:px-3.5 sm:before:flex-1",
        variantStyles[variant]
      )}
    >
      {/* Decorative background elements */}
      <div
        className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
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
        className="absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
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

      <p className="text-sm leading-6 text-center flex-1">
        <span className="font-medium">{text}</span>
      </p>

      <div className="flex flex-1 justify-end">
        <button
          type="button"
          className="-m-1.5 p-1.5 opacity-70 hover:opacity-100 transition-opacity"
          onClick={handleDismiss}
        >
          <span className="sr-only">Dismiss</span>
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
