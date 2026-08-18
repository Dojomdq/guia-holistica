"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Check, Ban, Download } from "lucide-react";
import { downloadCSV } from "@/lib/csv";

interface Comision {
  id: string;
  facilitador_id: string | null;
  representante_id: string | null;
  plan_id: string | null;
  ciudad: string | null;
  periodo: string | null;
  importe_cobrado: number;
  comision_porcentaje: number;
  importe_comision: number;
  importe_neto: number;
  estado: string;
  fecha_generacion: string | null;
  fecha_pago: string | null;
  observaciones: string | null;
  facilitadores: { nombre: string } | null;
  representantes: { nombre: string } | null;
  planes: { nombre: string } | null;
}

interface Representante { id: string; nombre: string; comision_porcentaje: number; }
interface Facilitador { id: string; nombre: string; }
interface Plan { id: string; nombre: string; }

function formatPesos(v: number): string {
  return v.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
}

export default function ComisionesAdmin() {
  const [comisiones, setComisiones] = useState<Comision[]>([]);
  const [representantes, setRepresentantes] = useState<Representante[]>([]);
  const [facilitadores, setFacilitadores] = useState<Facilitador[]>([]);
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filtroRepresentante, setFiltroRepresentante] = useState("");
  const [filtroCiudad, setFiltroCiudad] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  const [form, setForm] = useState({
    facilitador_id: "",
    representante_id: "",
    plan_id: "",
    ciudad: "",
    periodo: "",
    importe_cobrado: "",
    estado: "pendiente",
    fecha_generacion: "",
    fecha_pago: "",
    observaciones: "",
  });

  async function load() {
    setError(null);
    const [comRes, repRes, facRes, planRes] = await Promise.all([
      fetch("/api/comisiones").then((r) => r.json()),
      fetch("/api/representantes").then((r) => r.json()),
      fetch("/api/facilitadores").then((r) => r.json()),
      fetch("/api/planes").then((r) => r.json()),
    ]);

    if (Array.isArray(comRes)) setComisiones(comRes);
    else if (comRes?.error) setError("Error: " + comRes.error);

    if (Array.isArray(repRes)) setRepresentantes(repRes);
    if (Array.isArray(facRes)) setFacilitadores(facRes.map((f: any) => ({ id: f.id, nombre: f.nombre })));
    if (Array.isArray(planRes)) setPlanes(planRes.map((p: any) => ({ id: p.id, nombre: p.nombre })));

    setCargando(false);
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setForm({
      facilitador_id: "",
      representante_id: "",
      plan_id: "",
      ciudad: "",
      periodo: "",
      importe_cobrado: "",
      estado: "pendiente",
      fecha_generacion: new Date().toISOString().slice(0, 10),
      fecha_pago: "",
      observaciones: "",
    });
    setEditando(null);
    setShowForm(true);
  }

  function openEdit(c: Comision) {
    setForm({
      facilitador_id: c.facilitador_id || "",
      representante_id: c.representante_id || "",
      plan_id: c.plan_id || "",
      ciudad: c.ciudad || "",
      periodo: c.periodo || "",
      importe_cobrado: String(c.importe_cobrado ?? ""),
      estado: c.estado,
      fecha_generacion: c.fecha_generacion || "",
      fecha_pago: c.fecha_pago || "",
      observaciones: c.observaciones || "",
    });
    setEditando(c.id);
    setShowForm(true);
  }

  const representanteSeleccionado = representantes.find((r) => r.id === form.representante_id);
  const porcentajeEfectivo = representanteSeleccionado ? representanteSeleccionado.comision_porcentaje : 0;
  const importeCobrado = parseFloat(form.importe_cobrado) || 0;
  const importeComision = Math.round((importeCobrado * porcentajeEfectivo) / 100);
  const importeNeto = importeCobrado - importeComision;

  async function handleSave() {
    setGuardando(true);
    setError(null);

    const payload = {
      facilitador_id: form.facilitador_id || null,
      representante_id: form.representante_id || null,
      plan_id: form.plan_id || null,
      ciudad: form.ciudad || null,
      periodo: form.periodo || null,
      importe_cobrado: importeCobrado,
      comision_porcentaje: porcentajeEfectivo,
      estado: form.estado,
      fecha_generacion: form.fecha_generacion || null,
      fecha_pago: form.fecha_pago || null,
      observaciones: form.observaciones || null,
    };

    const url = editando ? `/api/comisiones/${editando}` : "/api/comisiones";
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
    await load();
    setGuardando(false);
  }

  async function handleChangeEstado(c: Comision, nuevoEstado: string) {
    const res = await fetch(`/api/comisiones/${c.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: nuevoEstado, fecha_pago: nuevoEstado === "pagada" ? new Date().toISOString().slice(0, 10) : c.fecha_pago }),
    });
    if (res.ok) await load();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta comisión?")) return;
    const res = await fetch(`/api/comisiones/${id}`, { method: "DELETE" });
    if (res.ok) await load();
  }

  const ciudades = Array.from(new Set(comisiones.filter((c) => c.ciudad).map((c) => c.ciudad as string)));

  const filtradas = comisiones.filter((c) => {
    if (filtroRepresentante && c.representante_id !== filtroRepresentante) return false;
    if (filtroCiudad && c.ciudad !== filtroCiudad) return false;
    if (filtroEstado && c.estado !== filtroEstado) return false;
    return true;
  });

  const totalBruto = filtradas.reduce((s, c) => s + (Number(c.importe_cobrado) || 0), 0);
  const totalComision = filtradas.reduce((s, c) => s + (Number(c.importe_comision) || 0), 0);
  const totalNeto = filtradas.reduce((s, c) => s + (Number(c.importe_neto) || 0), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-bark">Comisiones</h1>
          <p className="text-sm text-bark-500 mt-1">Seguimiento de comisiones por representante.</p>
        </div>
        <div className="flex items-center gap-2">
          {filtradas.length > 0 && (
            <button
              onClick={() => downloadCSV(filtradas.map((c) => ({
                profesional: c.facilitadores?.nombre || "",
                representante: c.representantes?.nombre || "",
                plan: c.planes?.nombre || "",
                ciudad: c.ciudad || "",
                periodo: c.periodo || "",
                bruto: c.importe_cobrado,
                comision_pct: c.comision_porcentaje,
                comision: c.importe_comision,
                neto: c.importe_neto,
                estado: c.estado,
                fecha_generacion: c.fecha_generacion || "",
                fecha_pago: c.fecha_pago || "",
                observaciones: c.observaciones || "",
              })), `comisiones_${new Date().toISOString().slice(0, 10)}.csv`)}
              className="inline-flex items-center gap-2 bg-sage-50 text-sage-700 border border-sage-200 px-4 py-2.5 rounded-xl hover:bg-sage-100 transition-all duration-300 text-sm font-medium"
            >
              <Download className="h-4 w-4" /> Descargar
            </button>
          )}
          <button onClick={openNew} className="inline-flex items-center gap-2 bg-bark text-white px-4 py-2.5 rounded-xl hover:bg-bark/85 transition-all duration-300 text-sm font-medium hover:-translate-y-0.5">
            <Plus className="h-4 w-4" /> Nueva Comisión
          </button>
        </div>
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
            <h2 className="font-serif font-semibold text-bark">{editando ? "Editar Comisión" : "Nueva Comisión"}</h2>
            <button onClick={() => { setShowForm(false); setEditando(null); }} className="text-bark-500 hover:text-bark-700 transition-colors"><X className="h-5 w-5" /></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-bark-800 mb-1">Profesional</label>
              <select value={form.facilitador_id} onChange={(e) => setForm({ ...form, facilitador_id: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all">
                <option value="">—</option>
                {facilitadores.map((f) => <option key={f.id} value={f.id}>{f.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-bark-800 mb-1">Representante</label>
              <select value={form.representante_id} onChange={(e) => setForm({ ...form, representante_id: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all">
                <option value="">Sin representante</option>
                {representantes.map((r) => <option key={r.id} value={r.id}>{r.nombre} ({r.comision_porcentaje}%)</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-bark-800 mb-1">Plan</label>
              <select value={form.plan_id} onChange={(e) => setForm({ ...form, plan_id: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all">
                <option value="">—</option>
                {planes.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-bark-800 mb-1">Ciudad</label>
              <input type="text" value={form.ciudad} onChange={(e) => setForm({ ...form, ciudad: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all" placeholder="Ej: Bahía Blanca" />
            </div>
            <div>
              <label className="block text-sm font-medium text-bark-800 mb-1">Período</label>
              <input type="text" value={form.periodo} onChange={(e) => setForm({ ...form, periodo: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all" placeholder="Ej: Septiembre 2026" />
            </div>
            <div>
              <label className="block text-sm font-medium text-bark-800 mb-1">Importe cobrado ($)</label>
              <input type="number" min="0" value={form.importe_cobrado} onChange={(e) => setForm({ ...form, importe_cobrado: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all" placeholder="20000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-bark-800 mb-1">Estado</label>
              <select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all">
                <option value="pendiente">Pendiente</option>
                <option value="pagada">Pagada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-bark-800 mb-1">Fecha de generación</label>
              <input type="date" value={form.fecha_generacion} onChange={(e) => setForm({ ...form, fecha_generacion: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-bark-800 mb-1">Fecha de pago</label>
              <input type="date" value={form.fecha_pago} onChange={(e) => setForm({ ...form, fecha_pago: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all" />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-bark-800 mb-1">Observaciones</label>
              <textarea rows={2} value={form.observaciones} onChange={(e) => setForm({ ...form, observaciones: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all" />
            </div>
          </div>

          <div className="bg-cream-50 rounded-xl p-4 mt-4 border border-cream-200 grid grid-cols-3 gap-3">
            <div>
              <p className="text-[11px] text-bark-500">Comisión ({porcentajeEfectivo}%)</p>
              <p className="text-lg font-serif font-semibold text-amber-700">{formatPesos(importeComision)}</p>
            </div>
            <div>
              <p className="text-[11px] text-bark-500">Ingreso Guía</p>
              <p className="text-lg font-serif font-semibold text-sage-700">{formatPesos(importeNeto)}</p>
            </div>
            <div>
              <p className="text-[11px] text-bark-500">Bruto</p>
              <p className="text-lg font-serif font-semibold text-bark">{formatPesos(importeCobrado)}</p>
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            <button onClick={handleSave} disabled={guardando} className="bg-bark text-white px-6 py-2.5 rounded-xl hover:bg-bark/85 transition-all duration-300 text-sm font-medium disabled:opacity-50 hover:-translate-y-0.5">
              {guardando ? "Guardando..." : "Guardar"}
            </button>
            <button onClick={() => { setShowForm(false); setEditando(null); }} className="bg-cream-200 text-bark-700 px-6 py-2.5 rounded-xl hover:bg-cream-300 transition-all duration-300 text-sm font-medium">Cancelar</button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3 mb-6">
        <select value={filtroRepresentante} onChange={(e) => setFiltroRepresentante(e.target.value)} className="px-3 py-2 rounded-xl border border-cream-300 text-sm text-bark bg-white focus:outline-none focus:ring-2 focus:ring-sage-400/40">
          <option value="">Todos los representantes</option>
          {representantes.map((r) => <option key={r.id} value={r.id}>{r.nombre}</option>)}
        </select>
        <select value={filtroCiudad} onChange={(e) => setFiltroCiudad(e.target.value)} className="px-3 py-2 rounded-xl border border-cream-300 text-sm text-bark bg-white focus:outline-none focus:ring-2 focus:ring-sage-400/40">
          <option value="">Todas las ciudades</option>
          {ciudades.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="px-3 py-2 rounded-xl border border-cream-300 text-sm text-bark bg-white focus:outline-none focus:ring-2 focus:ring-sage-400/40">
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="pagada">Pagada</option>
          <option value="cancelada">Cancelada</option>
        </select>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-xl p-4 border border-cream-300/60 text-center">
          <p className="text-[11px] text-bark-500">Ingreso bruto</p>
          <p className="text-lg font-serif font-semibold text-bark">{formatPesos(totalBruto)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-cream-300/60 text-center">
          <p className="text-[11px] text-bark-500">Comisiones</p>
          <p className="text-lg font-serif font-semibold text-amber-700">{formatPesos(totalComision)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-cream-300/60 text-center">
          <p className="text-[11px] text-bark-500">Ingreso neto Guía</p>
          <p className="text-lg font-serif font-semibold text-sage-700">{formatPesos(totalNeto)}</p>
        </div>
      </div>

      {cargando ? (
        <div className="p-8 text-center text-bark-500">Cargando...</div>
      ) : (
        <div className="space-y-2">
          {filtradas.length === 0 && <p className="text-bark-500 text-center py-8">No hay comisiones registradas.</p>}
          {filtradas.map((c) => (
            <div key={c.id} className="bg-white rounded-xl border border-cream-200 p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-bark text-sm">{c.facilitadores?.nombre || "—"}</span>
                  <span className="text-xs text-bark-400">→</span>
                  <span className="text-sm text-bark-700">{c.representantes?.nombre || "Sin representante"}</span>
                  {c.planes && <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">{c.planes.nombre}</span>}
                  {c.ciudad && <span className="text-xs text-bark-500">📍 {c.ciudad}</span>}
                  {c.periodo && <span className="text-xs text-bark-500">{c.periodo}</span>}
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-bark-500">
                  <span>Bruto: {formatPesos(c.importe_cobrado)}</span>
                  <span className="text-amber-700">Comisión ({c.comision_porcentaje}%): {formatPesos(c.importe_comision)}</span>
                  <span className="text-sage-700">Guía: {formatPesos(c.importe_neto)}</span>
                </div>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${
                c.estado === "pagada" ? "bg-sage-50 text-sage-700 border border-sage-200/60" :
                c.estado === "cancelada" ? "bg-gray-100 text-gray-500 border border-gray-200" :
                "bg-amber-50 text-amber-700 border border-amber-200/60"
              }`}>
                {c.estado === "pagada" ? "Pagada" : c.estado === "cancelada" ? "Cancelada" : "Pendiente"}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                {c.estado === "pendiente" && (
                  <button onClick={() => handleChangeEstado(c, "pagada")} title="Marcar pagada" className="p-1.5 text-bark-500 hover:text-sage-700 hover:bg-sage-50 rounded-lg transition-colors"><Check className="h-4 w-4" /></button>
                )}
                {c.estado === "pendiente" && (
                  <button onClick={() => handleChangeEstado(c, "cancelada")} title="Cancelar" className="p-1.5 text-bark-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Ban className="h-4 w-4" /></button>
                )}
                <button onClick={() => openEdit(c)} className="p-1.5 text-bark-500 hover:text-bark-700 hover:bg-cream-200 rounded-lg transition-colors"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => handleDelete(c.id)} className="p-1.5 text-bark-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
