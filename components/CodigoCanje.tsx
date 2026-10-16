"use client";

import { useState } from "react";
import { Gift, Copy, RefreshCw, Check, MessageCircle } from "lucide-react";

export default function CodigoCanje({
  facilitadorId,
  whatsapp,
}: {
  facilitadorId: string;
  whatsapp?: string | null;
}) {
  const [cargando, setCargando] = useState(false);
  const [codigo, setCodigo] = useState<string | null>(null);
  const [beneficio, setBeneficio] = useState("");
  const [copiado, setCopiado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function obtener() {
    setCargando(true);
    setError(null);
    try {
      const res = await fetch("/api/canje-generar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ facilitador_id: facilitadorId }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error || "No se pudo generar el código");
        return;
      }
      setCodigo(json.data.codigo);
      setBeneficio(json.data.beneficio);
    } catch {
      setError("Error de conexión. Probá de nuevo.");
    } finally {
      setCargando(false);
    }
  }

  async function copiar() {
    if (!codigo) return;
    try {
      await navigator.clipboard.writeText(codigo);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {}
  }

  const whatsappLink = whatsapp
    ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
        `Hola! Te contacto desde la Guía de Bienestar y quería usar mi código de canje: ${codigo}`
      )}`
    : null;

  return (
    <div className="bg-gradient-to-br from-sage-50 to-cream-100 dark:from-bark-800 dark:to-bark-900 rounded-2xl border border-sage-200 dark:border-bark-700 shadow-sm overflow-hidden">
      <div className="p-6 sm:p-8">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-10 h-10 rounded-xl bg-sage-600 flex items-center justify-center">
            <Gift className="h-5 w-5 text-white" />
          </div>
          <h2 className="font-serif text-lg font-medium text-bark">Beneficio para vos</h2>
        </div>
        <p className="text-sm text-bark-600 leading-relaxed mb-5">
          Pedí tu código, presentalo al profesional cuando vayas y aprovechá el beneficio. Así la
          Guía puede confirmar que te contactó.
        </p>

        {!codigo ? (
          <button
            onClick={obtener}
            disabled={cargando}
            className="btn-sage w-full justify-center"
          >
            {cargando ? (
              <><RefreshCw className="h-4 w-4 animate-spin" /> Generando…</>
            ) : (
              <><Gift className="h-4 w-4" /> Obtener mi código</>
            )}
          </button>
        ) : (
          <div className="space-y-4">
            <div className="bg-white dark:bg-bark-800 rounded-xl border border-dashed border-sage-300 dark:border-bark-600 p-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-sage-600 mb-2">
                {beneficio}
              </p>
              <p className="font-mono text-3xl font-bold tracking-widest text-bark select-all">
                {codigo}
              </p>
              <p className="text-xs text-bark-400 mt-2">
                Presentá este código cuando vayas
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <button onClick={copiar} className="btn-outline text-[13px] justify-center flex-1">
                {copiado ? <><Check className="h-4 w-4" /> Copiado</> : <><Copy className="h-4 w-4" /> Copiar</>}
              </button>
              {whatsappLink && (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-sage text-[13px] justify-center flex-1"
                >
                  <MessageCircle className="h-4 w-4" /> Enviar por WhatsApp
                </a>
              )}
            </div>
          </div>
        )}

        {error && (
          <p className="text-sm text-terracotta-600 bg-terracotta-50 border border-terracotta-200 rounded-xl px-4 py-3 mt-4">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}