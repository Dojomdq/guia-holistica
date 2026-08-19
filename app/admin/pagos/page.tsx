"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Download, DollarSign, Calendar, CreditCard, Check, Ban, Percent } from "lucide-react";
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

interface Facilitador { id: string; nombre: string; }
interface Plan { id: string; nombre: string; precio: number; }
interface Representante { id: string; nombre: string; comision_porcentaje: number; }
interface AsignacionInfo {
  plan_nombre: string;
  precio_contratado: number;
  representante_nombre: string | null;
  comision_porcentaje: number;
}

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
  const [tab, setTab] = useState<"pagos" | "comisiones">("pagos");

  const [pagos, setPagos] = useState<Pago[]>([]);
  const [comisiones, setComisiones] = useState<Comision[]>([]);
  const [facilitadores, setFacilitadores] = useState<Facilitador[]>([]);
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [representantes, setRepresentantes] = useState<Representante[]>([]);
  const [asignacionInfo, setAsignacionInfo] = useState<AsignacionInfo | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seleccionado, setSeleccionado] = useState(false);

  const [filtroFacilitador, setFiltroFacilitador] = useState("");
  const [filtroMetodo, setFiltroMetodo] = useState("");
  const [filtroMes, setFiltroMes] = useState("");
  const [filtroRep, setFiltroRep] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

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
    const [pagosRes, facRes, planRes, repRes, comRes] = await Promise.all([
      fetch("/api/pagos").then((r) => r.json()),
      fetch("/api/facilitadores").then((r) => r.json()),
      fetch("/api/planes").then((r) => r.json()),
      fetch("/api/representantes").then((r) => r.json()),
      fetch("/api/comisiones").then((r) => r.json()),
    ]);

    if (Array.isArray(pagosRes)) setPagos(pagosRes);
    else if (pagosRes?.error) setError("Error: " + pagosRes.error);
    if (Array.isArray(comRes)) setComisiones(comRes);
    if (Array.isArray(facRes)) setFacilitadores(facRes.map((f: any) => ({ id: f.id, nombre: f.nombre })));
    if (Array.isArray(planRes)) setPlanes(planRes.map((p: any) => ({ id: p.id, nombre: p.nombre, precio: p.precio })));
    if (Array.isArray(repRes)) setRepresentantes(repRes.map((r: any) => ({ id: r.id, nombre: r.nombre, comision_porcentaje: r.comision_porcentaje })));

    setCargando(false);
  }

  useEffect(() => { load(); }, []);

  async function fetchAsignacion(facilitadorId: string) {
    if (!facilitadorId) { setAsignacionInfo(null); return; }
    try {
      const res = await fetch("/api/facilitador-planes");
      const data = await res.json();
      if (!Array.isArray(data)) return;
      const asign = data.find((a: any) => a.facilitador_id === facilitadorId && a.estado === "activo");
      if (!asign) { setAsignacionInfo(null); return; }
      const rep = asign.representante_id ? representantes.find((r) => r.id === asign.representante_id) : null;
      const plan = planes.find((p) => p.id === asign.plan_id);
      setAsignacionInfo({
        plan_nombre: plan?.nombre || "Sin plan",
        precio_contratado: parseFloat(asign.precio_contratado) || 0,
        representante_nombre: rep?.nombre || null,
        comision_porcentaje: rep?.comision_porcentaje ?? 0,
      });
    } catch {
      setAsignacionInfo(null);
    }
  }

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
    setAsignacionInfo(null);
    setSeleccionado(false);
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
    fetchAsignacion(p.facilitador_id);
    setSeleccionado(true);
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
    setSeleccionado(false);
    await load();
    setGuardando(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este pago?")) return;
    const res = await fetch(`/api/pagos/${id}`, { method: "DELETE" });
    if (res.ok) await load();
  }

  async function handleDeleteComision(id: string) {
    if (!confirm("¿Eliminar esta comisión?")) return;
    const res = await fetch(`/api/comisiones/${id}`, { method: "DELETE" });
    if (res.ok) await load();
  }

  async function handleChangeEstado(c: Comision, nuevoEstado: string) {
    const res = await fetch(`/api/comisiones/${c.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: nuevoEstado, fecha_pago: nuevoEstado === "pagada" ? new Date().toISOString().slice(0, 10) : c.fecha_pago }),
    });
    if (res.ok) await load();
  }

  const meses = Array.from(new Set(pagos.filter((p) => p.fecha_pago).map((p) => p.fecha_pago.slice(0, 7)))).sort().reverse();

  const pagosFiltrados = pagos.filter((p) => {
    if (filtroFacilitador && p.facilitador_id !== filtroFacilitador) return false;
    if (filtroMetodo && p.metodo_pago !== filtroMetodo) return false;
    if (filtroMes && !p.fecha_pago.startsWith(filtroMes)) return false;
    return true;
  });

  const comFiltradas = comisiones.filter((c) => {
    if (filtroFacilitador && c.facilitador_id !== filtroFacilitador) return false;
    if (filtroRep && c.representante_id !== filtroRep) return false;
    if (filtroEstado && c.estado !== filtroEstado) return false;
    return true;
  });

  const totalPagos = pagosFiltrados.reduce((s, p) => s + (Number(p.monto) || 0), 0);
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

  const totalComBruto = comFiltradas.reduce((s, c) => s + (Number(c.importe_cobrado) || 0), 0);
  const totalComision = comFiltradas.reduce((s, c) => s + (Number(c.importe_comision) || 0), 0);
  const totalComNeto = comFiltradas.reduce((s, c) => s + (Number(c.importe_neto) || 0), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-bark">Pagos y Comisiones</h1>
          <p className="text-sm text-bark-500 mt-1">Registro de cobros y comisiones de representantes.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-cream-100 rounded-xl p-1 w-fit">
        <button onClick={() => setTab("pagos")} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === "pagos" ? "bg-white text-bark shadow-sm" : "text-bark-500 hover:text-bark-700"}`}>
          <DollarSign className="h-4 w-4 inline mr-1.5" />Pagos
        </button>
        <button onClick={() => setTab("comisiones")} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === "comisiones" ? "bg-white text-bark shadow-sm" : "text-bark-500 hover:text-bark-700"}`}>
          <Percent className="h-4 w-4 inline mr-1.5" />Comisiones
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
          {error}
          <button onClick={() => setError(null)} className="float-right font-bold">×</button>
        </div>
      )}

      {/* ========== TAB PAGOS ========== */}
      {tab === "pagos" && (
        <>
          <div className="flex items-center justify-between mb-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/70 rounded-2xl p-4 border border-cream-300/60 text-center">
                <p className="text-xl font-serif font-medium text-bark">{formatPesos(totalMesActual)}</p>
                <p className="text-xs text-bark-500 mt-0.5">Este mes</p>
              </div>
              <div className="bg-white/70 rounded-2xl p-4 border border-cream-300/60 text-center">
                <p className="text-xl font-serif font-medium text-sage-700">{formatPesos(totalPagos)}</p>
                <p className="text-xs text-bark-500 mt-0.5">Total filtrado</p>
              </div>
              <div className="bg-white/70 rounded-2xl p-4 border border-cream-300/60 text-center">
                <p className="text-xl font-serif font-medium text-bark">{pagosFiltrados.length}</p>
                <p className="text-xs text-bark-500 mt-0.5">Pagos</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {pagosFiltrados.length > 0 && (
                <button onClick={() => downloadCSV(pagosFiltrados.map((p) => ({ facilitador: p.facilitadores?.nombre || "", plan: p.planes?.nombre || "", monto: p.monto, fecha: p.fecha_pago, metodo: METODOS[p.metodo_pago] || p.metodo_pago, periodo: p.periodo || "" })), `pagos_${new Date().toISOString().slice(0, 10)}.csv`)} className="inline-flex items-center gap-2 bg-sage-50 text-sage-700 border border-sage-200 px-4 py-2.5 rounded-xl hover:bg-sage-100 transition-all text-sm font-medium">
                  <Download className="h-4 w-4" /> CSV
                </button>
              )}
              <button onClick={openNew} className="inline-flex items-center gap-2 bg-bark text-white px-4 py-2.5 rounded-xl hover:bg-bark/85 transition-all text-sm font-medium hover:-translate-y-0.5">
                <Plus className="h-4 w-4" /> Registrar pago
              </button>
            </div>
          </div>

          {mesesGrafico.length > 0 && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-cream-300/60 mb-6">
              <h2 className="font-serif font-medium text-bark text-base mb-4">Ingresos por mes</h2>
              <div className="space-y-2">
                {mesesGrafico.map(([mes, total]) => {
                  const pct = Math.round((total / maxMes) * 100);
                  return (
                    <div key={mes} className="flex items-center gap-3">
                      <span className="text-xs text-bark-500 w-20 shrink-0">{mes}</span>
                      <div className="flex-1 h-4 bg-cream-100 rounded-full overflow-hidden">
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
                <button onClick={() => { setShowForm(false); setEditando(null); setSeleccionado(false); }} className="text-bark-500 hover:text-bark-700 transition-colors"><X className="h-5 w-5" /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-bark-800 mb-1">Profesional</label>
                  <select value={form.facilitador_id} onChange={(e) => { setForm({ ...form, facilitador_id: e.target.value }); setSeleccionado(true); fetchAsignacion(e.target.value); }} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm text-bark focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all">
                    <option value="">Seleccionar...</option>
                    {facilitadores.map((f) => <option key={f.id} value={f.id}>{f.nombre}</option>)}
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

              {asignacionInfo && (
                <div className="bg-cream-50 border border-cream-200 rounded-xl p-4 mt-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                    <div>
                      <p className="text-[11px] text-bark-500">Plan</p>
                      <p className="text-sm font-medium text-bark">{asignacionInfo.plan_nombre}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-bark-500">Precio</p>
                      <p className="text-sm font-medium text-bark">{formatPesos(asignacionInfo.precio_contratado)}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-bark-500">Representante</p>
                      <p className="text-sm font-medium text-bark">{asignacionInfo.representante_nombre || "Sin representante"}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-bark-500">Comisión ({asignacionInfo.comision_porcentaje}%)</p>
                      <p className="text-sm font-semibold text-amber-700">{formatPesos(Math.round((parseFloat(form.monto || "0") * asignacionInfo.comision_porcentaje) / 100))}</p>
                    </div>
                  </div>
                  {asignacionInfo.representante_nombre && (
                    <div className="flex justify-between mt-3 pt-3 border-t border-cream-200 text-sm">
                      <span className="text-bark-500">Ingreso Guía</span>
                      <span className="font-semibold text-sage-700">{formatPesos(Math.round(parseFloat(form.monto || "0") - (parseFloat(form.monto || "0") * asignacionInfo.comision_porcentaje) / 100))}</span>
                    </div>
                  )}
                </div>
              )}

              {seleccionado && form.facilitador_id && !asignacionInfo && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mt-4 text-sm text-amber-700">
                  Este profesional no tiene plan contratado. Editá su plan en Facilitadores primero.
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <button onClick={handleSave} disabled={guardando || !form.facilitador_id || !form.monto} className="bg-bark text-white px-6 py-2.5 rounded-xl hover:bg-bark/85 transition-all text-sm font-medium disabled:opacity-50 hover:-translate-y-0.5">
                  {guardando ? "Guardando..." : "Guardar"}
                </button>
                <button onClick={() => { setShowForm(false); setEditando(null); setSeleccionado(false); }} className="bg-cream-200 text-bark-700 px-6 py-2.5 rounded-xl hover:bg-cream-300 transition-all text-sm font-medium">Cancelar</button>
              </div>
            </div>
          )}

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
              <button onClick={() => { setFiltroFacilitador(""); setFiltroMetodo(""); setFiltroMes(""); }} className="text-xs text-sage-600 hover:text-sage-700 font-medium mt-2">Limpiar</button>
            )}
          </div>

          {cargando ? (
            <div className="p-8 text-center text-bark-500">Cargando...</div>
          ) : (
            <div className="space-y-2">
              {pagosFiltrados.length === 0 && <p className="text-bark-500 text-center py-8">No hay pagos registrados.</p>}
              {pagosFiltrados.map((p) => (
                <div key={p.id} className="bg-white rounded-xl border border-cream-200 p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-bark text-sm">{p.facilitadores?.nombre || "—"}</span>
                      {p.planes && <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">{p.planes.nombre}</span>}
                      <span className="text-xs text-bark-500">{p.fecha_pago}</span>
                      <span className="text-xs text-bark-500">{METODOS[p.metodo_pago] || p.metodo_pago}</span>
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
        </>
      )}

      {/* ========== TAB COMISIONES ========== */}
      {tab === "comisiones" && (
        <>
          <div className="flex items-center justify-between mb-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/70 rounded-2xl p-4 border border-cream-300/60 text-center">
                <p className="text-xl font-serif font-medium text-bark">{formatPesos(totalComBruto)}</p>
                <p className="text-xs text-bark-500 mt-0.5">Ingreso bruto</p>
              </div>
              <div className="bg-white/70 rounded-2xl p-4 border border-cream-300/60 text-center">
                <p className="text-xl font-serif font-medium text-amber-700">{formatPesos(totalComision)}</p>
                <p className="text-xs text-bark-500 mt-0.5">Comisiones</p>
              </div>
              <div className="bg-white/70 rounded-2xl p-4 border border-cream-300/60 text-center">
                <p className="text-xl font-serif font-medium text-sage-700">{formatPesos(totalComNeto)}</p>
                <p className="text-xs text-bark-500 mt-0.5">Ingreso neto Guía</p>
              </div>
            </div>
            {comFiltradas.length > 0 && (
              <button onClick={() => downloadCSV(comFiltradas.map((c) => ({ profesional: c.facilitadores?.nombre || "", representante: c.representantes?.nombre || "", plan: c.planes?.nombre || "", bruto: c.importe_cobrado, comision_pct: c.comision_porcentaje, comision: c.importe_comision, neto: c.importe_neto, estado: c.estado, fecha: c.fecha_generacion || "", periodo: c.periodo || "" })), `comisiones_${new Date().toISOString().slice(0, 10)}.csv`)} className="inline-flex items-center gap-2 bg-sage-50 text-sage-700 border border-sage-200 px-4 py-2.5 rounded-xl hover:bg-sage-100 transition-all text-sm font-medium">
                <Download className="h-4 w-4" /> CSV
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <select value={filtroFacilitador} onChange={(e) => setFiltroFacilitador(e.target.value)} className="px-3 py-2 rounded-xl border border-cream-300 text-sm text-bark bg-white focus:outline-none focus:ring-2 focus:ring-sage-400/40">
              <option value="">Todos los profesionales</option>
              {facilitadores.map((f) => <option key={f.id} value={f.id}>{f.nombre}</option>)}
            </select>
            <select value={filtroRep} onChange={(e) => setFiltroRep(e.target.value)} className="px-3 py-2 rounded-xl border border-cream-300 text-sm text-bark bg-white focus:outline-none focus:ring-2 focus:ring-sage-400/40">
              <option value="">Todos los representantes</option>
              {representantes.map((r) => <option key={r.id} value={r.id}>{r.nombre}</option>)}
            </select>
            <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="px-3 py-2 rounded-xl border border-cream-300 text-sm text-bark bg-white focus:outline-none focus:ring-2 focus:ring-sage-400/40">
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="pagada">Pagada</option>
              <option value="cancelada">Cancelada</option>
            </select>
            {(filtroFacilitador || filtroRep || filtroEstado) && (
              <button onClick={() => { setFiltroFacilitador(""); setFiltroRep(""); setFiltroEstado(""); }} className="text-xs text-sage-600 hover:text-sage-700 font-medium mt-2">Limpiar</button>
            )}
          </div>

          {cargando ? (
            <div className="p-8 text-center text-bark-500">Cargando...</div>
          ) : (
            <div className="space-y-2">
              {comFiltradas.length === 0 && <p className="text-bark-500 text-center py-8">No hay comisiones registradas.</p>}
              {comFiltradas.map((c) => (
                <div key={c.id} className="bg-white rounded-xl border border-cream-200 p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-bark text-sm">{c.facilitadores?.nombre || "—"}</span>
                      <span className="text-xs text-bark-400">→</span>
                      <span className="text-sm text-bark-700">{c.representantes?.nombre || "Sin representante"}</span>
                      {c.planes && <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">{c.planes.nombre}</span>}
                      {c.ciudad && <span className="text-xs text-bark-500">{c.ciudad}</span>}
                      {c.periodo && <span className="text-xs text-bark-500">{c.periodo}</span>}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-bark-500">
                      <span>Bruto: {formatPesos(c.importe_cobrado)}</span>
                      <span className="text-amber-700">Comisión ({c.comision_porcentaje}%): {formatPesos(c.importe_comision)}</span>
                      <span className="text-sage-700">Guía: {formatPesos(c.importe_neto)}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${c.estado === "pagada" ? "bg-sage-50 text-sage-700 border border-sage-200/60" : c.estado === "cancelada" ? "bg-gray-100 text-gray-500 border border-gray-200" : "bg-amber-50 text-amber-700 border border-amber-200/60"}`}>
                    {c.estado === "pagada" ? "Pagada" : c.estado === "cancelada" ? "Cancelada" : "Pendiente"}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    {c.estado === "pendiente" && <button onClick={() => handleChangeEstado(c, "pagada")} title="Marcar pagada" className="p-1.5 text-bark-500 hover:text-sage-700 hover:bg-sage-50 rounded-lg transition-colors"><Check className="h-4 w-4" /></button>}
                    {c.estado === "pendiente" && <button onClick={() => handleChangeEstado(c, "cancelada")} title="Cancelar" className="p-1.5 text-bark-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Ban className="h-4 w-4" /></button>}
                    <button onClick={() => handleDeleteComision(c.id)} className="p-1.5 text-bark-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
