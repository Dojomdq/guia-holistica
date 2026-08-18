"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Download, DollarSign, Calendar, CreditCard } from "lucide-react";
import { downloadCSV } from "@/lib/csv";

interface Pago {
  id: string;
  facilitador_id: string;
  plan_id: string | null;
  monto: number;
  fecha_pago: string;
  metodo_pago: string;
  periodo: string | null;
  observaciones: string | null;
  created_at: string;
  facilitadores: { id: string; nombre: string } | null;
  planes: { id: string; nombre: string; precio: number } | null;
}

interface Facilitador { id: string; nombre: string; }
interface Plan { id: string; nombre: string; precio: number; }

const METODOS: Record<string, string> = {
  efectivo: "Efectivo",
  transferencia: "Transferencia",
  mercado_pago: "Mercado Pago",
  otro: "Otro",
};

function formatPesos(v: number): string {
  return v.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
}

export default function PagosAdmin() {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [facilitadores, setFacilitadores] = useState<Facilitador[]>([]);
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filtroFacilitador, setFiltroFacilitador] = useState("");
  const [filtroMetodo, setFiltroMetodo] = useState("");
  const [filtroMes, setFiltroMes] = useState("");

  const [form, setForm] = useState({
    facilitador_id: "",
    plan_id: "",
    monto: "",
    fecha_pago: new Date().toISOString().slice(0, 10),
    metodo_pago: "transferencia",
    periodo: "",
    observaciones: "",
  });

  async function load() {
    setError(null);
    const [pagosRes, facRes, planRes] = await Promise.all([
      fetch("/api/pagos").then((r) => r.json()),
      fetch("/api/facilitadores").then((r) => r.json()),
      fetch("/api/planes").then((r) => r.json()),
    ]);

    if (Array.isArray(pagosRes)) setPagos(pagosRes);
    else if (pagosRes?.error) setError("Error: " + pagosRes.error);

    if (Array.isArray(facRes)) setFacilitadores(facRes.map((f: any) => ({ id: f.id, nombre: f.nombre })));
    if (Array.isArray(planRes)) setPlanes(planRes.map((p: any) => ({ id: p.id, nombre: p.nombre, precio: p.precio })));

    setCargando(false);
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setForm({
      facilitador_id: "",
      plan_id: "",
      monto: "",
      fecha_pago: new Date().toISOString().slice(0, 10),
      metodo_pago: "transferencia",
      periodo: "",
      observaciones: "",
    });
    setEditando(null);
    setShowForm(true);
  }

  function openEdit(p: Pago) {
    setForm({
      facilitador_id: p.facilitador_id,
      plan_id: p.plan_id || "",
      monto: String(p.monto),
      fecha_pago: p.fecha_pago,
      metodo_pago: p.metodo_pago,
      periodo: p.periodo || "",
      observaciones: p.observaciones || "",
    });
    setEditando(p.id);
    setShowForm(true);
  }

  async function handleSave() {
    setGuardando(true);
    setError(null);

    const payload = {
      facilitador_id: form.facilitador_id,
      plan_id: form.plan_id || null,
      monto: parseFloat(form.monto) || 0,
      fecha_pago: form.fecha_pago,
      metodo_pago: form.metodo_pago,
      periodo: form.periodo || null,
      observaciones: form.observaciones || null,
    };

    const url = editando ? `/api/pagos/${editando}` : "/api/pagos";
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

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este pago?")) return;
    const res = await fetch(`/api/pagos/${id}`, { method: "DELETE" });
    if (res.ok) await load();
  }

  const meses = Array.from(new Set(pagos.filter((p) => p.fecha_pago).map((p) => p.fecha_pago.slice(0, 7)))).sort().reverse();

  const filtrados = pagos.filter((p) => {
    if (filtroFacilitador && p.facilitador_id !== filtroFacilitador) return false;
    if (filtroMetodo && p.metodo_pago !== filtroMetodo) return false;
    if (filtroMes && !p.fecha_pago.startsWith(filtroMes)) return false;
    return true;
  });

  const totalMonto = filtrados.reduce((s, p) => s + (Number(p.monto) || 0), 0);

  const mesActual = new Date().toISOString().slice(0, 7);
  const pagosMesActual = pagos.filter((p) => p.fecha_pago.startsWith(mesActual));
  const totalMesActual = pagosMesActual.reduce((s, p) => s + (Number(p.monto) || 0), 0);

  const porMes: Record<string, number> = {};
  for (const p of pagos) {
    const m = p.fecha_pago?.slice(0, 7) || "sin fecha";
    porMes[m] = (porMes[m] || 0) + (Number(p.monto) || 0);
  }
  const mesesGrafico = Object.entries(porMes).sort((a, b) => a[0].localeCompare(b[0]));
  const maxMes = Math.max(...mesesGrafico.map((m) => m[1]), 1);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-bark">Pagos</h1>
          <p className="text-sm text-bark-500 mt-1">Registro de cobros a facilitadores.</p>
        </div>
        <div className="flex items-center gap-2">
          {filtrados.length > 0 && (
            <button
              onClick={() => downloadCSV(filtrados.map((p) => ({
                facilitador: p.facilitadores?.nombre || "",
                plan: p.planes?.nombre || "",
                monto: p.monto,
                fecha: p.fecha_pago,
                metodo: METODOS[p.metodo_pago] || p.metodo_pago,
                periodo: p.periodo || "",
                observaciones: p.observaciones || "",
              })), `pagos_${new Date().toISOString().slice(0, 10)}.csv`)}
              className="inline-flex items-center gap-2 bg-sage-50 text-sage-700 border border-sage-200 px-4 py-2.5 rounded-xl hover:bg-sage-100 transition-all duration-300 text-sm font-medium"
            >
              <Download className="h-4 w-4" /> Descargar
            </button>
          )}
          <button onClick={openNew} className="inline-flex items-center gap-2 bg-bark text-white px-4 py-2.5 rounded-xl hover:bg-bark/85 transition-all duration-300 text-sm font-medium hover:-translate-y-0.5">
            <Plus className="h-4 w-4" /> Registrar pago
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
          {error}
          <button onClick={() => setError(null)} className="float-right font-bold">×</button>
        </div>
      )}

      {/* Resumen */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/70 rounded-2xl p-5 border border-cream-300/60">
          <div className="flex items-center gap-3">
            <div className="bg-sage h-10 w-10 rounded-xl flex items-center justify-center text-white flex-shrink-0">
              <DollarSign className="h-5 w-5" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-2xl font-serif font-medium text-bark">{formatPesos(totalMesActual)}</p>
              <p className="text-xs text-bark-600">Este mes</p>
            </div>
          </div>
        </div>
        <div className="bg-white/70 rounded-2xl p-5 border border-cream-300/60">
          <div className="flex items-center gap-3">
            <div className="bg-bark h-10 w-10 rounded-xl flex items-center justify-center text-white flex-shrink-0">
              <Calendar className="h-5 w-5" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-2xl font-serif font-medium text-bark">{formatPesos(totalMonto)}</p>
              <p className="text-xs text-bark-600">Total filtrado</p>
            </div>
          </div>
        </div>
        <div className="bg-white/70 rounded-2xl p-5 border border-cream-300/60">
          <div className="flex items-center gap-3">
            <div className="bg-amber-600 h-10 w-10 rounded-xl flex items-center justify-center text-white flex-shrink-0">
              <CreditCard className="h-5 w-5" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-2xl font-serif font-medium text-bark">{filtrados.length}</p>
              <p className="text-xs text-bark-600">Pagos registrados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ingresos por mes */}
      {mesesGrafico.length > 0 && (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-cream-300/60 mb-8">
          <h2 className="font-serif font-medium text-bark text-lg mb-5">Ingresos por mes</h2>
          <div className="space-y-2">
            {mesesGrafico.map(([mes, total]) => {
              const pct = Math.round((total / maxMes) * 100);
              return (
                <div key={mes} className="flex items-center gap-3">
                  <span className="text-xs text-bark-500 w-20 shrink-0">{mes}</span>
                  <div className="flex-1 h-5 bg-cream-100 rounded-full overflow-hidden">
                    <div className="h-full bg-sage-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs font-medium text-bark-600 w-28 text-right">{formatPesos(total)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-cream-300/60 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif font-semibold text-bark">{editando ? "Editar Pago" : "Registrar Pago"}</h2>
            <button onClick={() => { setShowForm(false); setEditando(null); }} className="text-bark-500 hover:text-bark-700 transition-colors"><X className="h-5 w-5" /></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-bark-800 mb-1">Profesional</label>
              <select value={form.facilitador_id} onChange={(e) => setForm({ ...form, facilitador_id: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all">
                <option value="">Seleccionar...</option>
                {facilitadores.map((f) => <option key={f.id} value={f.id}>{f.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-bark-800 mb-1">Plan</label>
              <select value={form.plan_id} onChange={(e) => setForm({ ...form, plan_id: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all">
                <option value="">Sin plan</option>
                {planes.map((p) => <option key={p.id} value={p.id}>{p.nombre} ({formatPesos(p.precio)})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-bark-800 mb-1">Monto ($)</label>
              <input type="number" min="0" value={form.monto} onChange={(e) => setForm({ ...form, monto: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all" placeholder="20000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-bark-800 mb-1">Fecha de pago</label>
              <input type="date" value={form.fecha_pago} onChange={(e) => setForm({ ...form, fecha_pago: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-bark-800 mb-1">Método de pago</label>
              <select value={form.metodo_pago} onChange={(e) => setForm({ ...form, metodo_pago: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all">
                {Object.entries(METODOS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-bark-800 mb-1">Período</label>
              <input type="text" value={form.periodo} onChange={(e) => setForm({ ...form, periodo: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all" placeholder="Ej: Agosto 2026" />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-bark-800 mb-1">Observaciones</label>
              <textarea rows={2} value={form.observaciones} onChange={(e) => setForm({ ...form, observaciones: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all" />
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            <button onClick={handleSave} disabled={guardando || !form.facilitador_id || !form.monto} className="bg-bark text-white px-6 py-2.5 rounded-xl hover:bg-bark/85 transition-all duration-300 text-sm font-medium disabled:opacity-50 hover:-translate-y-0.5">
              {guardando ? "Guardando..." : "Guardar"}
            </button>
            <button onClick={() => { setShowForm(false); setEditando(null); }} className="bg-cream-200 text-bark-700 px-6 py-2.5 rounded-xl hover:bg-cream-300 transition-all duration-300 text-sm font-medium">Cancelar</button>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select value={filtroFacilitador} onChange={(e) => setFiltroFacilitador(e.target.value)} className="px-3 py-2 rounded-xl border border-cream-300 text-sm text-bark bg-white focus:outline-none focus:ring-2 focus:ring-sage-400/40">
          <option value="">Todos los profesionales</option>
          {facilitadores.map((f) => <option key={f.id} value={f.id}>{f.nombre}</option>)}
        </select>
        <select value={filtroMetodo} onChange={(e) => setFiltroMetodo(e.target.value)} className="px-3 py-2 rounded-xl border border-cream-300 text-sm text-bark bg-white focus:outline-none focus:ring-2 focus:ring-sage-400/40">
          <option value="">Todos los métodos</option>
          {Object.entries(METODOS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={filtroMes} onChange={(e) => setFiltroMes(e.target.value)} className="px-3 py-2 rounded-xl border border-cream-300 text-sm text-bark bg-white focus:outline-none focus:ring-2 focus:ring-sage-400/40">
          <option value="">Todos los meses</option>
          {meses.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        {(filtroFacilitador || filtroMetodo || filtroMes) && (
          <button onClick={() => { setFiltroFacilitador(""); setFiltroMetodo(""); setFiltroMes(""); }} className="text-xs text-sage-600 hover:text-sage-700 font-medium mt-2">Limpiar filtros</button>
        )}
      </div>

      {/* Lista */}
      {cargando ? (
        <div className="p-8 text-center text-bark-500">Cargando...</div>
      ) : (
        <div className="space-y-2">
          {filtrados.length === 0 && <p className="text-bark-500 text-center py-8">No hay pagos registrados.</p>}
          {filtrados.map((p) => (
            <div key={p.id} className="bg-white rounded-xl border border-cream-200 p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-bark text-sm">{p.facilitadores?.nombre || "—"}</span>
                  {p.planes && <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">{p.planes.nombre}</span>}
                  <span className="text-xs text-bark-500">📅 {p.fecha_pago}</span>
                  <span className="text-xs text-bark-500">💰 {METODOS[p.metodo_pago] || p.metodo_pago}</span>
                  {p.periodo && <span className="text-xs text-bark-400">{p.periodo}</span>}
                </div>
                {p.observaciones && <p className="text-xs text-bark-400 mt-1 truncate">{p.observaciones}</p>}
              </div>
              <span className="text-lg font-serif font-semibold text-sage-700 shrink-0">{formatPesos(p.monto)}</span>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => openEdit(p)} className="p-1.5 text-bark-500 hover:text-bark-700 hover:bg-cream-200 rounded-lg transition-colors"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => handleDelete(p.id)} className="p-1.5 text-bark-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
