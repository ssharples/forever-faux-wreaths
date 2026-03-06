"use client";

import { useState, useEffect } from "react";

function generateSessionId(): string {
  return `cart_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

export function useCartSession(): string | null {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    let id = localStorage.getItem("cart_session_id");
    if (!id) {
      id = generateSessionId();
      localStorage.setItem("cart_session_id", id);
    }
    setSessionId(id);
  }, []);

  return sessionId;
}
