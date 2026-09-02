"use client";

import { useState } from "react";
import { KeyRound, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";

export default function CambiarContrasenaAdmin() {
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setExito(false);

    if (nueva.length < 8) {
      setError("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (nueva !== confirmar) {
      setError("Las contraseñas nuevas no coinciden.");
      return;
    }

    setGuardando(true);
    try {
      const res = await fetch("/api/auth/cambiar-contrasena", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actual, nueva }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "No se pudo cambiar la contraseña.");
      } else {
        setExito(true);
        setActual("");
        setNueva("");
        setConfirmar("");
      }
    } catch {
      setError("Error de red. Intentá de nuevo.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-serif font-semibold text-bark mb-2 flex items-center gap-2">
        <KeyRound className="h-5 w-5" /> Cambiar contraseña
      </h1>
      <p className="text-sm text-bark-500 mb-8">
        Cambiá la contraseña de acceso al panel de administración.
      </p>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      {exito && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 text-sm">
          <CheckCircle2 className="h-4 w-4 shrink-0" /> Contraseña actualizada correctamente.
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-soft border border-cream-300/60 space-y-4">
        <div>
          <label className="block text-sm font-medium text-bark-800 mb-1">Contraseña actual *</label>
          <input
            type="password"
            value={actual}
            onChange={(e) => setActual(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all"
            placeholder="Tu contraseña actual"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-bark-800 mb-1">Nueva contraseña *</label>
          <input
            type="password"
            value={nueva}
            onChange={(e) => setNueva(e.target.value)}
            required
            minLength={8}
            className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all"
            placeholder="Mínimo 8 caracteres"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-bark-800 mb-1">Confirmar nueva contraseña *</label>
          <input
            type="password"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
            required
            minLength={8}
            className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all"
            placeholder="Repetí la nueva contraseña"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-bark-500 bg-cream-100 rounded-xl px-4 py-3">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          Recomendación: 12+ caracteres con mayúsculas, números y símbolos.
        </div>

        <button
          type="submit"
          disabled={guardando || !actual || !nueva || !confirmar}
          className="bg-bark text-white px-6 py-2.5 rounded-xl hover:bg-bark/85 transition-all duration-300 text-sm font-medium disabled:opacity-50 hover:-translate-y-0.5"
        >
          {guardando ? "Guardando..." : "Cambiar contraseña"}
        </button>
      </form>
    </div>
  );
}
