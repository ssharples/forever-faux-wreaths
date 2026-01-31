"use client";

import { useState, useEffect } from "react";

export function useSessionId(): string | null {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("ffw_session_id");
    if (stored) {
      setSessionId(stored);
    } else {
      const newId = `guest_${crypto.randomUUID()}`;
      localStorage.setItem("ffw_session_id", newId);
      setSessionId(newId);
    }
  }, []);

  return sessionId;
}
