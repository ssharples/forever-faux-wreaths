"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Always true, cannot be disabled
    functional: false,
    analytics: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      // Delay showing banner slightly for better UX
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (type: "all" | "essential" | "custom") => {
    let consentData = {
      essential: true,
      functional: false,
      analytics: false,
      timestamp: new Date().toISOString(),
    };

    if (type === "all") {
      consentData = {
        ...consentData,
        functional: true,
        analytics: true,
      };
    } else if (type === "custom") {
      consentData = {
        ...consentData,
        ...preferences,
      };
    }

    localStorage.setItem("cookie_consent", JSON.stringify(consentData));
    setShowBanner(false);
    setShowPreferences(false);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Overlay for preferences modal */}
      {showPreferences && (
        <div
          className="fixed inset-0 bg-charcoal-900/50 z-[99]"
          onClick={() => setShowPreferences(false)}
        />
      )}

      {/* Main Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          {showPreferences ? (
            /* Preferences Modal */
            <div className="bg-white rounded-xl shadow-soft-xl border border-cream-300 p-6">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Cookie className="h-6 w-6 text-sage-500" />
                  <h3 className="text-lg font-medium text-charcoal-700">
                    Cookie Preferences
                  </h3>
                </div>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="text-charcoal-400 hover:text-charcoal-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {/* Essential */}
                <div className="flex items-start gap-4 p-4 bg-cream-100 rounded-lg">
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-charcoal-700">
                      Essential Cookies
                    </p>
                    <p className="text-sm text-charcoal-500">
                      Required for the website to function. Cannot be disabled.
                    </p>
                  </div>
                  <span className="text-xs text-sage-600 bg-sage-100 px-2 py-1 rounded">
                    Always Active
                  </span>
                </div>

                {/* Functional */}
                <div className="flex items-start gap-4 p-4 bg-cream-100 rounded-lg">
                  <input
                    type="checkbox"
                    checked={preferences.functional}
                    onChange={(e) =>
                      setPreferences({ ...preferences, functional: e.target.checked })
                    }
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-charcoal-700">
                      Functional Cookies
                    </p>
                    <p className="text-sm text-charcoal-500">
                      Enable enhanced features and personalisation.
                    </p>
                  </div>
                </div>

                {/* Analytics */}
                <div className="flex items-start gap-4 p-4 bg-cream-100 rounded-lg">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) =>
                      setPreferences({ ...preferences, analytics: e.target.checked })
                    }
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-charcoal-700">
                      Analytics Cookies
                    </p>
                    <p className="text-sm text-charcoal-500">
                      Help us understand how visitors use our website.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => saveConsent("custom")}
                  className="bg-sage-400 hover:bg-sage-500 text-white"
                >
                  Save Preferences
                </Button>
                <Button
                  onClick={() => saveConsent("all")}
                  variant="outline"
                  className="border-sage-400 text-sage-600 hover:bg-sage-50"
                >
                  Accept All
                </Button>
              </div>
            </div>
          ) : (
            /* Simple Banner */
            <div className="bg-white rounded-xl shadow-soft-xl border border-cream-300 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Cookie className="h-8 w-8 text-sage-500 shrink-0 hidden sm:block" />
                <div className="flex-1">
                  <p className="text-charcoal-600 text-sm sm:text-base">
                    We use cookies to improve your experience on our website. By
                    continuing to browse, you agree to our use of cookies.{" "}
                    <Link
                      href="/legal/cookies"
                      className="text-sage-600 hover:underline"
                    >
                      Learn more
                    </Link>
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Button
                    onClick={() => saveConsent("all")}
                    size="sm"
                    className="bg-sage-400 hover:bg-sage-500 text-white"
                  >
                    Accept All
                  </Button>
                  <Button
                    onClick={() => saveConsent("essential")}
                    variant="outline"
                    size="sm"
                    className="border-cream-400 text-charcoal-600 hover:bg-cream-100"
                  >
                    Essential Only
                  </Button>
                  <Button
                    onClick={() => setShowPreferences(true)}
                    variant="ghost"
                    size="sm"
                    className="text-charcoal-500 hover:text-charcoal-700"
                  >
                    Manage
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
