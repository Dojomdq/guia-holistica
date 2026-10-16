"use client";

import { useState, useEffect } from "react";
import { Ticket, Search, CheckCircle2, RotateCcw, Filter } from "lucide-react";

interface CodigoCanje {
  id: string;
  codigo: string;
  beneficio: string;
  estado: "activo" | "usado";
  created_at: string;
  usado_at: string | null;
  vence: string | null;
  facilitadores: { id: string; nombre: string } | null;
}

export default function CanjesAdmin() {
  const [codigos, setCodigos] = useState<CodigoCanje[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [guardandoId, setGuardandoId] = useState<string | null>(null);

  async function load(estado?: string) {
    setCargando(true);
    setError(null);
    try {
      const params = estado && estado !== "todos" ? `?estado=${estado}` : "";
      const res = await fetch(`/api/canje${params}`);
      const data = await res.json();
      if (!res.ok || !Array.isArray(data)) throw new Error(data?.error || "Error al cargar");
      setCodigos(data);
    } catch (e: any) {
      setError(e.message || "Error al cargar");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { load(filtroEstado); }, [filtroEstado]);

  async function cambiarEstado(c: CodigoCanje, estado: "activo" | "usado") {
    setGuardandoId(c.id);
    setError(null);
    try {
      const res = await fetch("/api/canje", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: c.id, estado }),
      });
      const json = await res.json();
      if (!res.ok || json.success === false) throw new Error(json.error || "Error al actualizar");
      await load(filtroEstado);
    } catch (e: any) {
      setError(e.message || "Error al actualizar");
    } finally {
      setGuardandoId(null);
    }
  }

  const filtrados = codigos.filter((c) =>
    !busqueda.trim() ||
    c.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
    (c.facilitadores?.nombre || "").toLowerCase().includes(busqueda.toLowerCase())
  );

  const activos = codigos.filter((c) => c.estado === "activo").length;
  const usados = codigos.filter((c) => c.estado === "usado").length;

  function fechaLabel(fecha: string | null): string {
    if (!fecha) return "—";
    return new Date(fecha).toLocaleString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl bg-sage-600 flex items-center justify-center">
          <Ticket className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-semibold text-bark">Códigos de Canje</h1>
          <p className="text-sm text-bark-500">
            Cuando el visitante presenta su código, marcálo como usado para registrar la conversión.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/70 border border-cream-200 rounded-2xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-bark-400">Activos</p>
          <p className="text-3xl font-serif font-semibold text-sage-600 mt-1">{activos}</p>
        </div>
        <div className="bg-white/70 border border-cream-200 rounded-2xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-bark-400">Usados (conversiones)</p>
          <p className="text-3xl font-serif font-semibold text-bark mt-1">{usados}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-bark-400" />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por código o profesional…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-bark-400" />
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-cream-300 text-sm text-bark focus:outline-none focus:ring-2 focus:ring-sage-400/40 transition-all bg-white"
          >
            <option value="todos">Todos</option>
            <option value="activo">Activos</option>
            <option value="usado">Usados</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
          {error}
        </div>
      )}

      {cargando ? (
        <p className="text-sm text-bark-500 text-center py-12">Cargando códigos…</p>
      ) : filtrados.length === 0 ? (
        <p className="text-bark-500 text-center py-12 bg-white/50 border border-cream-200 rounded-2xl">
          No hay códigos todavía. Se generan cuando un visitante pide su beneficio en la ficha de un profesional.
        </p>
      ) : (
        <div className="space-y-3">
          {filtrados.map((c) => (
            <div key={c.id} className={`bg-white/70 border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 ${c.estado === "usado" ? "border-cream-200" : "border-sage-300"}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-base font-bold tracking-wider text-bark">{c.codigo}</span>
                  {c.estado === "usado" ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-bark-500 bg-cream-200 rounded-full px-2.5 py-0.5">
                      <CheckCircle2 className="h-3 w-3" /> Usado
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-sage-700 bg-sage-100 rounded-full px-2.5 py-0.5">
                      Activo · vence {fechaLabel(c.vence)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-bark-700 mt-1 truncate">
                  {c.facilitadores?.nombre || "Sin profesional"}
                </p>
                <p className="text-xs text-bark-500">
                  {c.beneficio} · Generado: {fechaLabel(c.created_at)}
                  {c.usado_at ? ` · Usado: ${fechaLabel(c.usado_at)}` : ""}
                </p>
              </div>
              {c.estado === "activo" ? (
                <button
                  onClick={() => cambiarEstado(c, "usado")}
                  disabled={guardandoId === c.id}
                  className="btn-sage text-[13px] shrink-0"
                >
                  {guardandoId === c.id ? "Guardando…" : "Marcar usado"}
                </button>
              ) : (
                <button
                  onClick={() => cambiarEstado(c, "activo")}
                  disabled={guardandoId === c.id}
                  className="btn-outline text-[13px] shrink-0"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Revertir
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}