"use client";

import { useState, useEffect } from "react";
import { Star, Plus, X } from "lucide-react";

interface Facilitador {
  id: string;
  nombre: string;
}

interface Destacado {
  id: string;
  facilitador_id: string;
  tipo: string;
  activo: boolean;
  facilitadores: { nombre: string } | null;
}

interface PremiumDestacado {
  facilitador_id: string;
  facilitadores: { nombre: string; activo: boolean } | null;
  planes: { nombre: string; perfil_destacado: boolean } | null;
}

export default function DestacadosAdmin() {
  const [destacadosSitio, setDestacadosSitio] = useState<Destacado[]>([]);
  const [destacadosInstagram, setDestacadosInstagram] = useState<Destacado[]>([]);
  const [premiumDestacados, setPremiumDestacados] = useState<PremiumDestacado[]>([]);
  const [facilitadores, setFacilitadores] = useState<Facilitador[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ facilitador_id: "", tipo: "sitio" });
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    const [sitioRes, igRes, facRes, planesRes] = await Promise.all([
      fetch("/api/destacados?tipo=sitio").then((r) => r.json()),
      fetch("/api/destacados?tipo=instagram").then((r) => r.json()),
      fetch("/api/facilitadores").then((r) => r.json()),
      fetch("/api/facilitador-planes").then((r) => r.json()),
    ]);

    if (Array.isArray(sitioRes)) setDestacadosSitio(sitioRes);
    if (Array.isArray(igRes)) setDestacadosInstagram(igRes);
    if (Array.isArray(facRes)) setFacilitadores(facRes.map((f: any) => ({ id: f.id, nombre: f.nombre })));
    if (Array.isArray(planesRes)) {
      const premium = planesRes.filter((p: any) => p.planes?.perfil_destacado && p.estado === "activo" && p.facilitadores?.activo);
      setPremiumDestacados(premium);
    }
    setCargando(false);
  }

  useEffect(() => { load(); }, []);

  async function handleSave() {
    setGuardando(true);
    setError(null);
    if (!form.facilitador_id) {
      setError("Seleccioná un profesional");
      setGuardando(false);
      return;
    }

    const res = await fetch("/api/destacados", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ facilitador_id: form.facilitador_id, tipo: form.tipo }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError("Error: " + (data.error || res.statusText));
      setGuardando(false);
      return;
    }
    setShowForm(false);
    setForm({ facilitador_id: "", tipo: "sitio" });
    await load();
    setGuardando(false);
  }

  async function handleRemove(id: string) {
    if (!confirm("¿Quitar este destacado?")) return;
    await fetch(`/api/destacados/${id}`, { method: "DELETE" });
    await load();
  }

  function Lista({ titulo, items, icono }: { titulo: string; items: Destacado[]; icono: string }) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-soft border border-cream-300/60">
        <h2 className="font-serif font-semibold text-bark mb-4 flex items-center gap-2">
          <Star className="h-5 w-5 text-amber-500" /> {titulo} <span className="text-amber-500">{icono}</span>
        </h2>
        {items.length === 0 ? (
          <p className="text-sm text-bark-500">Sin destacados</p>
        ) : (
          <div className="space-y-2">
            {items.map((d) => (
              <div key={d.id} className="flex items-center justify-between bg-cream-50 rounded-xl px-3 py-2">
                <span className="text-sm text-bark">{d.facilitadores?.nombre || "—"}</span>
                <button onClick={() => handleRemove(d.id)} className="p-1 text-bark-400 hover:text-red-600 rounded transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-bark">Destacados del mes</h1>
          <p className="text-sm text-bark-500 mt-1">Administrá quiénes aparecen destacados en el sitio y en Instagram.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 bg-bark text-white px-4 py-2.5 rounded-xl hover:bg-bark/85 transition-all duration-300 text-sm font-medium hover:-translate-y-0.5">
          <Plus className="h-4 w-4" /> Agregar destacado
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
          {error}
          <button onClick={() => setError(null)} className="float-right font-bold">×</button>
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-cream-300/60 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif font-semibold text-bark">Nuevo destacado</h2>
            <button onClick={() => setShowForm(false)} className="text-bark-500 hover:text-bark-700 transition-colors"><X className="h-5 w-5" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-bark-800 mb-1">Profesional</label>
              <select value={form.facilitador_id} onChange={(e) => setForm({ ...form, facilitador_id: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all">
                <option value="">Seleccionar...</option>
                {facilitadores.map((f) => <option key={f.id} value={f.id}>{f.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-bark-800 mb-1">Tipo</label>
              <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all">
                <option value="sitio">Destacado del mes (sitio web)</option>
                <option value="instagram">Destacado del mes (Instagram)</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={handleSave} disabled={guardando} className="bg-bark text-white px-6 py-2.5 rounded-xl hover:bg-bark/85 transition-all duration-300 text-sm font-medium disabled:opacity-50">
              {guardando ? "Guardando..." : "Guardar"}
            </button>
            <button onClick={() => setShowForm(false)} className="bg-cream-200 text-bark-700 px-6 py-2.5 rounded-xl hover:bg-cream-300 transition-all duration-300 text-sm font-medium">Cancelar</button>
          </div>
        </div>
      )}

      {cargando ? (
        <div className="p-8 text-center text-bark-500">Cargando...</div>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Lista titulo="Destacados del sitio web" items={destacadosSitio} icono="🌐" />
            <Lista titulo="Destacados de Instagram" items={destacadosInstagram} icono="📸" />
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-soft border border-cream-300/60">
            <h2 className="font-serif font-semibold text-bark mb-1 flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" /> Destacados por plan premium
            </h2>
            <p className="text-xs text-bark-400 mb-4">Aparecen automáticamente en el sitio. Se gestionan desde la sección de Planes.</p>
            {premiumDestacados.length === 0 ? (
              <p className="text-sm text-bark-500">Sin destacados premium</p>
            ) : (
              <div className="space-y-2">
                {premiumDestacados.map((p) => (
                  <div key={p.facilitador_id} className="flex items-center justify-between bg-cream-50 rounded-xl px-3 py-2">
                    <div>
                      <span className="text-sm text-bark">{p.facilitadores?.nombre || "—"}</span>
                      <span className="text-xs text-bark-400 ml-2">({p.planes?.nombre})</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
