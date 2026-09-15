"use client";

import { useState, useEffect } from "react";
import { Megaphone, Info, CheckCircle2, AlertCircle } from "lucide-react";

export default function PopupEventoAdmin() {
  const [habilitado, setHabilitado] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/popup-config")
      .then((r) => r.json())
      .then((data) => {
        setHabilitado(data?.habilitado === true);
        setCargando(false);
      })
      .catch(() => {
        setError("No se pudo leer la configuración del popup");
        setCargando(false);
      });
  }, []);

  async function toggle() {
    const nuevo = !habilitado;
    setGuardando(true);
    setError(null);
    setOkMsg(null);
    try {
      const res = await fetch("/api/popup-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habilitado: nuevo }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError("Error: " + (data.error || res.statusText));
        return;
      }
      setHabilitado(nuevo);
      setOkMsg(nuevo ? "Popup de eventos solidarios ACTIVADO" : "Popup de eventos solidarios desactivado");
    } catch {
      setError("Error de conexión");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl bg-sage-600 flex items-center justify-center">
          <Megaphone className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-semibold text-bark">Popup de Eventos</h1>
          <p className="text-sm text-bark-500">Activá o desactivá la ventana de eventos solidarios</p>
        </div>
      </div>

      <div className="bg-white/70 border border-cream-200 rounded-2xl p-6 space-y-4">
        <div className="flex items-start gap-2.5 text-sm text-bark-600">
          <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <p>
            El popup solo se muestra en la home después de unos segundos, y únicamente cuando hay al
            menos un evento solidario activo. Si lo desactivás, no aparece aunque existan eventos.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}
        {okMsg && (
          <div className="flex items-center gap-2 bg-sage-50 border border-sage-200 text-sage-700 text-sm rounded-xl px-4 py-3">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            {okMsg}
          </div>
        )}

        {cargando ? (
          <p className="text-sm text-bark-500">Cargando estado actual…</p>
        ) : (
          <div className="flex items-center justify-between gap-4 rounded-xl border border-cream-200 bg-cream-50 p-5">
            <div>
              <p className="font-semibold text-bark">Popup de eventos solidarios</p>
              <p className="text-sm text-bark-500">
                {habilitado ? "Activado — aparece en la home si hay eventos solidarios" : "Desactivado — no se muestra"}
              </p>
            </div>
            <button
              onClick={toggle}
              disabled={guardando}
              aria-pressed={habilitado}
              className={`relative w-14 h-8 rounded-full transition-colors duration-300 flex-shrink-0 ${
                habilitado ? "bg-sage-600" : "bg-cream-300"
              } ${guardando ? "opacity-60" : ""}`}
              aria-label="Activar o desactivar popup de eventos"
            >
              <span
                className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all duration-300 ${
                  habilitado ? "left-7" : "left-1"
                }`}
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}