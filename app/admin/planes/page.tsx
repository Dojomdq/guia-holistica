"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Check, Minus } from "lucide-react";

interface Plan {
  id: string;
  nombre: string;
  slug: string | null;
  precio: number | null;
  periodicidad: string | null;
  descripcion: string | null;
  beneficios: string | null;
  activo: boolean;
  acciones_difusion: number;
  publicacion_individual: boolean;
  perfil_destacado: boolean;
  prioridad_categoria: boolean;
  aparicion_destacados: boolean;
  contenidos_tematicos: boolean;
}

const EMPTY_FORM = {
  nombre: "",
  slug: "",
  precio: "",
  periodicidad: "mensual",
  descripcion: "",
  beneficios: "",
  activo: true,
  acciones_difusion: "0",
  publicacion_individual: false,
  perfil_destacado: false,
  prioridad_categoria: false,
  aparicion_destacados: false,
  contenidos_tematicos: false,
};

function formatPrecio(v: number | null): string {
  if (v === null || v === undefined) return "";
  return v.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
}

export default function PlanesAdmin() {
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    const res = await fetch("/api/planes");
    const data = await res.json();
    if (!res.ok) {
      setError("Error cargando planes: " + (data.error || res.statusText));
    } else {
      setPlanes(data || []);
    }
    setCargando(false);
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setForm(EMPTY_FORM);
    setEditando(null);
    setShowForm(true);
  }

  function openEdit(p: Plan) {
    setForm({
      nombre: p.nombre,
      slug: p.slug || "",
      precio: p.precio !== null && p.precio !== undefined ? String(p.precio) : "",
      periodicidad: p.periodicidad || "mensual",
      descripcion: p.descripcion || "",
      beneficios: p.beneficios || "",
      activo: p.activo,
      acciones_difusion: String(p.acciones_difusion ?? 0),
      publicacion_individual: p.publicacion_individual,
      perfil_destacado: p.perfil_destacado,
      prioridad_categoria: p.prioridad_categoria,
      aparicion_destacados: p.aparicion_destacados,
      contenidos_tematicos: p.contenidos_tematicos,
    });
    setEditando(p.id);
    setShowForm(true);
  }

  function setField(field: string, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setGuardando(true);
    setError(null);

    const payload: any = {
      nombre: form.nombre,
      slug: form.slug || null,
      precio: form.precio === "" ? null : parseFloat(form.precio),
      periodicidad: form.periodicidad,
      descripcion: form.descripcion,
      beneficios: form.beneficios,
      activo: form.activo,
      acciones_difusion: parseInt(form.acciones_difusion, 10) || 0,
      publicacion_individual: form.publicacion_individual,
      perfil_destacado: form.perfil_destacado,
      prioridad_categoria: form.prioridad_categoria,
      aparicion_destacados: form.aparicion_destacados,
      contenidos_tematicos: form.contenidos_tematicos,
    };

    const url = editando ? `/api/planes/${editando}` : "/api/planes";
    const method = editando ? "PUT" : "POST";

    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json();

    if (!res.ok) {
      setError("Error al guardar: " + (data.error || res.statusText));
      setGuardando(false);
      return;
    }

    setShowForm(false);
    setEditando(null);
    setForm(EMPTY_FORM);
    await load();
    setGuardando(false);
  }

  async function handleToggleActivo(p: Plan) {
    const res = await fetch(`/api/planes/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activo: !p.activo }),
    });
    if (res.ok) await load();
  }

  async function handleDelete(id: string, nombre: string) {
    if (!confirm(`¿Eliminar el plan "${nombre}"?`)) return;
    const res = await fetch(`/api/planes/${id}`, { method: "DELETE" });
    if (res.ok) await load();
  }

  const booleanField = (label: string, field: string) => (
    <label className="flex items-center gap-2 text-sm text-bark-700 cursor-pointer">
      <input
        type="checkbox"
        checked={Boolean((form as any)[field])}
        onChange={(e) => setField(field, e.target.checked)}
        className="rounded border-cream-300 text-sage-600 focus:ring-sage-400"
      />
      {label}
    </label>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-bark">Planes</h1>
          <p className="text-sm text-bark-500 mt-1">Gestión interna de planes y precios.</p>
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-2 bg-bark text-white px-4 py-2.5 rounded-xl hover:bg-bark/85 transition-all duration-300 text-sm font-medium hover:-translate-y-0.5">
          <Plus className="h-4 w-4" /> Nuevo Plan
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
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif font-semibold text-bark">{editando ? "Editar Plan" : "Nuevo Plan"}</h2>
            <button onClick={() => { setShowForm(false); setEditando(null); }} className="text-bark-500 hover:text-bark-700 transition-colors"><X className="h-5 w-5" /></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-bark-800 mb-1">Nombre *</label>
              <input type="text" value={form.nombre} onChange={(e) => setField("nombre", e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all" placeholder="Ej: Difusión" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-bark-800 mb-1">Precio ($)</label>
                <input type="number" value={form.precio} onChange={(e) => setField("precio", e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all" placeholder="20000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-bark-800 mb-1">Periodicidad</label>
                <select value={form.periodicidad} onChange={(e) => setField("periodicidad", e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all">
                  <option value="mensual">Mensual</option>
                  <option value="anual">Anual</option>
                  <option value="unico">Único</option>
                </select>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-bark-800 mb-1">Descripción</label>
              <input type="text" value={form.descripcion} onChange={(e) => setField("descripcion", e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all" placeholder="Resumen del plan" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-bark-800 mb-1">Beneficios (uno por línea)</label>
              <textarea rows={6} value={form.beneficios} onChange={(e) => setField("beneficios", e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all" placeholder="Perfil en Guía de Bienestar.&#10;Aparición en el mapa.&#10;..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-bark-800 mb-1">Acciones de difusión mensuales</label>
              <input type="number" min="0" value={form.acciones_difusion} onChange={(e) => setField("acciones_difusion", e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all" />
            </div>
            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 text-sm text-bark-700 cursor-pointer">
                <input type="checkbox" checked={form.activo} onChange={(e) => setField("activo", e.target.checked)} className="rounded border-cream-300 text-sage-600 focus:ring-sage-400" />
                Activo
              </label>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-2 bg-cream-50 rounded-xl p-4 border border-cream-200">
              {booleanField("Publicación individual", "publicacion_individual")}
              {booleanField("Perfil destacado", "perfil_destacado")}
              {booleanField("Prioridad en categoría", "prioridad_categoria")}
              {booleanField("Aparición en Destacados", "aparicion_destacados")}
              {booleanField("Contenidos temáticos", "contenidos_tematicos")}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={handleSave} disabled={guardando || !form.nombre} className="bg-bark text-white px-6 py-2.5 rounded-xl hover:bg-bark/85 transition-all duration-300 text-sm font-medium disabled:opacity-50 hover:-translate-y-0.5">
              {guardando ? "Guardando..." : "Guardar"}
            </button>
            <button onClick={() => { setShowForm(false); setEditando(null); }} className="bg-cream-200 text-bark-700 px-6 py-2.5 rounded-xl hover:bg-cream-300 transition-all duration-300 text-sm font-medium">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {cargando ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-soft border border-cream-300/60 animate-pulse h-20" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {planes.length === 0 && <p className="text-bark-500 text-center py-8">No hay planes aún. Creá el primero.</p>}
          {planes.map((p) => (
            <div key={p.id} className={`bg-white rounded-2xl p-5 shadow-soft border ${p.activo ? "border-cream-300/60" : "border-cream-200 opacity-60"} transition-all duration-300`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-serif font-semibold text-bark text-base">{p.nombre}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${p.activo ? "bg-sage-50 text-sage-700 border border-sage-200/60" : "bg-gray-100 text-gray-500"}`}>
                      {p.activo ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                  <p className="text-sm text-bark-600 mt-1">
                    {p.precio !== null && p.precio !== undefined ? formatPrecio(p.precio) : "—"}
                    {p.periodicidad ? ` / ${p.periodicidad}` : ""}
                    {" · "}{p.acciones_difusion} difusión(es)
                  </p>
                  {p.descripcion && <p className="text-xs text-bark-500 mt-1">{p.descripcion}</p>}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {p.publicacion_individual && <span className="inline-flex items-center gap-1 text-[11px] text-bark-600 bg-cream-100 px-2 py-0.5 rounded-md"><Check className="h-3 w-3 text-sage-600" /> Pub. individual</span>}
                    {p.perfil_destacado && <span className="inline-flex items-center gap-1 text-[11px] text-bark-600 bg-cream-100 px-2 py-0.5 rounded-md"><Check className="h-3 w-3 text-sage-600" /> Destacado</span>}
                    {p.prioridad_categoria && <span className="inline-flex items-center gap-1 text-[11px] text-bark-600 bg-cream-100 px-2 py-0.5 rounded-md"><Check className="h-3 w-3 text-sage-600" /> Prioridad</span>}
                    {p.aparicion_destacados && <span className="inline-flex items-center gap-1 text-[11px] text-bark-600 bg-cream-100 px-2 py-0.5 rounded-md"><Check className="h-3 w-3 text-sage-600" /> Destacados</span>}
                    {p.contenidos_tematicos && <span className="inline-flex items-center gap-1 text-[11px] text-bark-600 bg-cream-100 px-2 py-0.5 rounded-md"><Check className="h-3 w-3 text-sage-600" /> Temáticos</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => handleToggleActivo(p)} title={p.activo ? "Desactivar" : "Activar"} className="p-1.5 text-bark-500 hover:text-sage-700 hover:bg-sage-50 rounded-lg transition-colors">
                    {p.activo ? <Minus className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                  </button>
                  <button onClick={() => openEdit(p)} className="p-1.5 text-bark-500 hover:text-bark-700 hover:bg-cream-200 rounded-lg transition-colors"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(p.id, p.nombre)} className="p-1.5 text-bark-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
