"use client";

import { useCallback } from "react";

export function useClickTracker() {
  const track = useCallback(async (tipo: "actividad" | "facilitador", referencia_id: string) => {
    try {
      await fetch("/api/clicks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo, referencia_id }),
      });
    } catch {
      // silent fail
    }
  }, []);

  return track;
}
