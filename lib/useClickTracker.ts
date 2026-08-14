"use client";

import { useCallback } from "react";

export type ClickTipo =
  | "actividad"
  | "facilitador"
  | "whatsapp"
  | "instagram"
  | "telefono"
  | "sitio_web"
  | "como_llegar"
  | "busqueda"
  | "busqueda_sin_resultado";

export function useClickTracker() {
  const track = useCallback(async (tipo: ClickTipo, referencia_id: string) => {
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
