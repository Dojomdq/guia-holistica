"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Users, TrendingUp, Check } from "lucide-react";

interface Representante {
  id: string;
  nombre: string;
  contacto: string | null;
  ciudades: string | null;
  comision_porcentaje: number;
  activo: boolean;
  observaciones: string | null;
}

const EMPTY_FORM = {
  nombre: "",
  contacto: "",
  ciudades: "",
  comision_porcentaje: "50",
  activo: true,
  observaciones: "",
};

function formatPesos(v: number): string {
  return v.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
}

export default function RepresentantesAdmin() {
  const [representantes, setRepresentantes] = useState<Representante[]>([]);
  const [metrics, setMetrics] = useState<Record<string, any>>({});
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    const [repRes, comRes, fpRes] = await Promise.all([
      fetch("/api/representantes").then((r) => r.json()),
      fetch("/api/comisiones").then((r) => r.json()),
      fetch("/api/facilitador-planes").then((r) => r.json()),
    ]);

    if (Array.isArray(repRes)) setRepresentantes(repRes);
    else if (repRes?.error) setError("Error cargando representantes: " + repRes.error);

    const comisiones = Array.isArray(comRes) ? comRes : [];
    const asignaciones = Array.isArray(fpRes) ? fpRes : [];

    const m: Record<string, any> = {};
    for (const r of Array.isArray(repRes) ? repRes : []) {
      const profCount = asignaciones.filter((a: any) => a.representante_id === r.id).length;
      const coms = comisiones.filter((c: any) => c.representante_id === r.id);
      const brutos = coms.reduce((s: number, c: any) => s + (Number(c.importe_cobrado) || 0), 0);
      const comisionTotal = coms.reduce((s: number, c: any) => s + (Number(c.importe_comision) || 0), 0);
      const neto = coms.reduce((s: number, c: any) => s + (Number(c.importe_neto) || 0), 0);
      const pendientes = coms.filter((c: any) => c.estado === "pendiente");
      const pagadas = coms.filter((c: any) => c.estado === "pagada");
      m[r.id] = {
        profesionales: profCount,
        ingresosBrutos: brutos,
        comisionesGeneradas: comisionTotal,
        comisionesPendientes: pendientes.reduce((s: number, c: any) => s + (Number(c.importe_comision) || 0), 0),
        comisionesPagadas: pagadas.reduce((s: number, c: any) => s + (Number(c.importe_comision) || 0), 0),
        ingresoNetoGuia: neto,
      };
    }
    setMetrics(m);
    setCargando(false);
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setForm(EMPTY_FORM);
    setEditando(null);
    setShowForm(true);
  }

  function openEdit(r: Representante) {
    setForm({
      nombre: r.nombre,
      contacto: r.contacto || "",
      ciudades: r.ciudades || "",
      comision_porcentaje: String(r.comision_porcentaje ?? 50),
      activo: r.activo,
      observaciones: r.observaciones || "",
    });
    setEditando(r.id);
    setShowForm(true);
  }

  async function handleSave() {
    setGuardando(true);
    setError(null);

    const payload = {
      nombre: form.nombre,
      contacto: form.contacto || null,
      ciudades: form.ciudades || null,
      comision_porcentaje: parseFloat(form.comision_porcentaje) || 0,
      activo: form.activo,
      observaciones: form.observaciones || null,
    };

    const url = editando ? `/api/representantes/${editando}` : "/api/representantes";
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

  async function handleDelete(id: string, nombre: string) {
    if (!confirm(`¿Eliminar al representante "${nombre}"?`)) return;
    const res = await fetch(`/api/representantes/${id}`, { method: "DELETE" });
    if (res.ok) await load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-bark">Representantes</h1>
          <p className="text-sm text-bark-500 mt-1">Comerciales por ciudad y sus comisiones.</p>
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-2 bg-bark text-white px-4 py-2.5 rounded-xl hover:bg-bark/85 transition-all duration-300 text-sm font-medium hover:-translate-y-0.5">
          <Plus className="h-4 w-4" /> Nuevo Representante
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
            <h2 className="font-serif font-semibold text-bark">{editando ? "Editar Representante" : "Nuevo Representante"}</h2>
            <button onClick={() => { setShowForm(false); setEditando(null); }} className="text-bark-500 hover:text-bark-700 transition-colors"><X className="h-5 w-5" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-bark-800 mb-1">Nombre *</label>
              <input type="text" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all" placeholder="Ej: Juan Pérez" />
            </div>
            <div>
              <label className="block text-sm font-medium text-bark-800 mb-1">Contacto</label>
              <input type="text" value={form.contacto} onChange={(e) => setForm({ ...form, contacto: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all" placeholder="Teléfono / email" />
            </div>
            <div>
              <label className="block text-sm font-medium text-bark-800 mb-1">Ciudades asignadas</label>
              <input type="text" value={form.ciudades} onChange={(e) => setForm({ ...form, ciudades: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all" placeholder="Ej: Bahía Blanca, Tandil" />
            </div>
            <div>
              <label className="block text-sm font-medium text-bark-800 mb-1">Comisión (%)</label>
              <input type="number" min="0" max="100" value={form.comision_porcentaje} onChange={(e) => setForm({ ...form, comision_porcentaje: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all" placeholder="50" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-bark-800 mb-1">Observaciones</label>
              <textarea rows={2} value={form.observaciones} onChange={(e) => setForm({ ...form, observaciones: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all" />
            </div>
            <label className="flex items-center gap-2 text-sm text-bark-700 cursor-pointer">
              <input type="checkbox" checked={form.activo} onChange={(e) => setForm({ ...form, activo: e.target.checked })} className="rounded border-cream-300 text-sage-600 focus:ring-sage-400" />
              Activo
            </label>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={handleSave} disabled={guardando || !form.nombre} className="bg-bark text-white px-6 py-2.5 rounded-xl hover:bg-bark/85 transition-all duration-300 text-sm font-medium disabled:opacity-50 hover:-translate-y-0.5">
              {guardando ? "Guardando..." : "Guardar"}
            </button>
            <button onClick={() => { setShowForm(false); setEditando(null); }} className="bg-cream-200 text-bark-700 px-6 py-2.5 rounded-xl hover:bg-cream-300 transition-all duration-300 text-sm font-medium">Cancelar</button>
          </div>
        </div>
      )}

      {cargando ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-soft border border-cream-300/60 animate-pulse h-24" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {representantes.length === 0 && <p className="text-bark-500 text-center py-8">No hay representantes aún. Creá el primero.</p>}
          {representantes.map((r) => {
            const met = metrics[r.id] || {};
            return (
              <div key={r.id} className={`bg-white rounded-2xl p-5 shadow-soft border ${r.activo ? "border-cream-300/60" : "border-cream-200 opacity-60"} transition-all duration-300`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-serif font-semibold text-bark text-base">{r.nombre}</h3>
                      {r.ciudades && <span className="text-xs text-bark-500">📍 {r.ciudades}</span>}
                      <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60 font-medium">Comisión {r.comision_porcentaje}%</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${r.activo ? "bg-sage-50 text-sage-700 border border-sage-200/60" : "bg-gray-100 text-gray-500"}`}>
                        {r.activo ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                    {r.contacto && <p className="text-xs text-bark-500 mt-1">{r.contacto}</p>}

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
                      <div className="bg-cream-50 rounded-xl p-3 text-center">
                        <p className="text-xl font-serif font-semibold text-bark">{met.profesionales || 0}</p>
                        <p className="text-[11px] text-bark-500 mt-0.5 flex items-center justify-center gap-1"><Users className="h-3 w-3" />Profesionales</p>
                      </div>
                      <div className="bg-cream-50 rounded-xl p-3 text-center">
                        <p className="text-sm font-serif font-semibold text-bark">{formatPesos(met.ingresosBrutos || 0)}</p>
                        <p className="text-[11px] text-bark-500 mt-0.5">Ingresos brutos</p>
                      </div>
                      <div className="bg-cream-50 rounded-xl p-3 text-center">
                        <p className="text-sm font-serif font-semibold text-bark">{formatPesos(met.comisionesGeneradas || 0)}</p>
                        <p className="text-[11px] text-bark-500 mt-0.5">Comisiones</p>
                      </div>
                      <div className="bg-cream-50 rounded-xl p-3 text-center">
                        <p className="text-sm font-serif font-semibold text-amber-700">{formatPesos(met.comisionesPendientes || 0)}</p>
                        <p className="text-[11px] text-bark-500 mt-0.5">Pendientes</p>
                      </div>
                      <div className="bg-cream-50 rounded-xl p-3 text-center">
                        <p className="text-sm font-serif font-semibold text-sage-700">{formatPesos(met.ingresoNetoGuia || 0)}</p>
                        <p className="text-[11px] text-bark-500 mt-0.5">Ingreso Guía</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => openEdit(r)} className="p-1.5 text-bark-500 hover:text-bark-700 hover:bg-cream-200 rounded-lg transition-colors"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(r.id, r.nombre)} className="p-1.5 text-bark-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
