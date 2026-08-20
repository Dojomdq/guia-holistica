"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Download, DollarSign, Calendar, CreditCard, Check, Ban, Percent, ChevronLeft, ChevronRight } from "lucide-react";
import { downloadCSV } from "@/lib/csv";
import { ChartIngresosPorMes, ChartComisionesPorMes, ChartMetodosPago, ChartComisionesPorRep } from "@/components/admin/Charts";

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
interface Asignacion {
  facilitador_id: string;
  plan_id: string | null;
  representante_id: string | null;
  precio_contratado: number;
  ciudad: string | null;
}
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

const MESES_ES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

function formatMes(mes: string): string {
  const [y, m] = mes.split("-");
  return `${MESES_ES[parseInt(m) - 1]} ${y}`;
}

function mesAnterior(mes: string): string {
  const d = new Date(parseInt(mes.split("-")[0]), parseInt(mes.split("-")[1]) - 2, 1);
  return d.toISOString().slice(0, 7);
}

function mesSiguiente(mes: string): string {
  const d = new Date(parseInt(mes.split("-")[0]), parseInt(mes.split("-")[1]), 1);
  return d.toISOString().slice(0, 7);
}

export default function PagosAdmin() {
  const [tab, setTab] = useState<"pagos" | "comisiones">("pagos");

  const [pagos, setPagos] = useState<Pago[]>([]);
  const [comisiones, setComisiones] = useState<Comision[]>([]);
  const [facilitadores, setFacilitadores] = useState<Facilitador[]>([]);
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [representantes, setRepresentantes] = useState<Representante[]>([]);
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const [asignacionInfo, setAsignacionInfo] = useState<AsignacionInfo | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seleccionado, setSeleccionado] = useState(false);
  const [mesSeleccionado, setMesSeleccionado] = useState(new Date().toISOString().slice(0, 7));

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
    const [pagosRes, facRes, planRes, repRes, comRes, asignRes] = await Promise.all([
      fetch("/api/pagos").then((r) => r.json()),
      fetch("/api/facilitadores").then((r) => r.json()),
      fetch("/api/planes").then((r) => r.json()),
      fetch("/api/representantes").then((r) => r.json()),
      fetch("/api/comisiones").then((r) => r.json()),
      fetch("/api/facilitador-planes").then((r) => r.json()),
    ]);

    if (Array.isArray(pagosRes)) setPagos(pagosRes);
    else if (pagosRes?.error) setError("Error: " + pagosRes.error);
    if (Array.isArray(comRes)) setComisiones(comRes);
    if (Array.isArray(facRes)) setFacilitadores(facRes.map((f: any) => ({ id: f.id, nombre: f.nombre })));
    if (Array.isArray(planRes)) setPlanes(planRes.map((p: any) => ({ id: p.id, nombre: p.nombre, precio: p.precio })));
    if (Array.isArray(repRes)) setRepresentantes(repRes.map((r: any) => ({ id: r.id, nombre: r.nombre, comision_porcentaje: r.comision_porcentaje })));
    if (Array.isArray(asignRes)) setAsignaciones(asignRes.filter((a: any) => a.estado === "activo").map((a: any) => ({
      facilitador_id: a.facilitador_id,
      plan_id: a.plan_id,
      representante_id: a.representante_id,
      precio_contratado: parseFloat(a.precio_contratado) || 0,
      ciudad: a.ciudad || null,
    })));

    setCargando(false);
  }

  useEffect(() => { load(); }, []);

  async function fetchAsignacion(facilitadorId: string) {
    if (!facilitadorId) { setAsignacionInfo(null); return; }
    try {
      const [asignRes, repRes, planRes] = await Promise.all([
        fetch("/api/facilitador-planes").then((r) => r.json()),
        representantes.length ? Promise.resolve(representantes) : fetch("/api/representantes").then((r) => r.json()),
        planes.length ? Promise.resolve(planes) : fetch("/api/planes").then((r) => r.json()),
      ]);
      if (!Array.isArray(asignRes)) return;
      const asign = asignRes.find((a: any) => a.facilitador_id === facilitadorId && a.estado === "activo");
      if (!asign) { setAsignacionInfo(null); return; }
      const reps = Array.isArray(repRes) ? repRes.map((r: any) => ({ id: r.id, nombre: r.nombre, comision_porcentaje: r.comision_porcentaje })) : representantes;
      const pls = Array.isArray(planRes) ? planRes.map((p: any) => ({ id: p.id, nombre: p.nombre, precio: p.precio })) : planes;
      const rep = asign.representante_id ? reps.find((r: any) => r.id === asign.representante_id) : null;
      const plan = pls.find((p: any) => p.id === asign.plan_id);
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

  function getRepForFacilitador(facilitadorId: string): { nombre: string; porcentaje: number } | null {
    const asign = asignaciones.find((a) => a.facilitador_id === facilitadorId);
    if (!asign?.representante_id) return null;
    const rep = representantes.find((r) => r.id === asign.representante_id);
    if (!rep) return null;
    return { nombre: rep.nombre, porcentaje: rep.comision_porcentaje };
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

  const pagosMes = pagos.filter((p) => p.fecha_pago?.startsWith(mesSeleccionado));
  const totalMes = pagosMes.reduce((s, p) => s + (Number(p.monto) || 0), 0);
  const comisionesMes = comisiones.filter((c) => c.fecha_generacion?.startsWith(mesSeleccionado));
  const comisionMes = comisionesMes.reduce((s, c) => s + (Number(c.importe_comision) || 0), 0);
  const netoMes = totalMes - comisionMes;

  const porRepMes: Record<string, { nombre: string; total: number; comision: number; count: number }> = {};
  for (const c of comisionesMes) {
    const rid = c.representante_id || "none";
    if (!porRepMes[rid]) porRepMes[rid] = { nombre: c.representantes?.nombre || "Sin representante", total: 0, comision: 0, count: 0 };
    porRepMes[rid].total += Number(c.importe_cobrado) || 0;
    porRepMes[rid].comision += Number(c.importe_comision) || 0;
    porRepMes[rid].count++;
  }

  const chartMeses = mesesGrafico.map(([mes, ingresos]) => {
    const comMes = comisiones.filter((c) => c.fecha_generacion?.startsWith(mes)).reduce((s, c) => s + (Number(c.importe_comision) || 0), 0);
    const [y, m] = mes.split("-");
    return { mes, label: `${MESES_ES[parseInt(m) - 1]?.slice(0, 3)} ${y.slice(2)}`, ingresos, comisiones: comMes, neto: ingresos - comMes };
  });

  const porMetodo: Record<string, number> = {};
  for (const p of pagosMes) porMetodo[p.metodo_pago] = (porMetodo[p.metodo_pago] || 0) + (Number(p.monto) || 0);
  const chartMetodos = Object.entries(porMetodo).map(([k, v]) => ({ name: METODOS[k] || k, value: v }));

  const chartReps = Object.values(porRepMes).map((d) => ({ nombre: d.nombre, comision: d.comision, ingresos: d.total }));

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

          {/* Navegación mes a mes + resumen del mes */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-cream-300/60 mb-6">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setMesSeleccionado(mesAnterior(mesSeleccionado))} className="p-2 rounded-lg hover:bg-cream-100 text-bark-500 hover:text-bark-700 transition-colors">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="text-center">
                <h2 className="font-serif font-medium text-bark text-lg">{formatMes(mesSeleccionado)}</h2>
                <p className="text-xs text-bark-500">{pagosMes.length} pago{pagosMes.length !== 1 ? "s" : ""}</p>
              </div>
              <button onClick={() => setMesSeleccionado(mesSiguiente(mesSeleccionado))} className="p-2 rounded-lg hover:bg-cream-100 text-bark-500 hover:text-bark-700 transition-colors">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-cream-50 rounded-xl p-3">
                <p className="text-[11px] text-bark-500">Ingresos</p>
                <p className="text-sm font-semibold text-bark">{formatPesos(totalMes)}</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-3">
                <p className="text-[11px] text-amber-600">Comisiones</p>
                <p className="text-sm font-semibold text-amber-700">{formatPesos(comisionMes)}</p>
              </div>
              <div className="bg-sage-50 rounded-xl p-3">
                <p className="text-[11px] text-sage-600">Neto Guía</p>
                <p className="text-sm font-semibold text-sage-700">{formatPesos(netoMes)}</p>
              </div>
            </div>
          </div>

          {/* Gráfico de barras por mes */}
          {chartMeses.length > 0 && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-cream-300/60 mb-6">
              <h2 className="font-serif font-medium text-bark text-base mb-4">Ingresos por mes</h2>
              <ChartIngresosPorMes data={chartMeses} mesSeleccionado={mesSeleccionado} onSelect={setMesSeleccionado} />
            </div>
          )}

          {/* Gráfico de tendencia ingresos vs comisiones */}
          {chartMeses.length > 1 && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-cream-300/60 mb-6">
              <h2 className="font-serif font-medium text-bark text-base mb-4">Tendencia ingresos vs comisiones</h2>
              <ChartComisionesPorMes data={chartMeses} mesSeleccionado={mesSeleccionado} />
            </div>
          )}

          {/* Métodos de pago + Comisiones por representante */}
          {(chartMetodos.length > 0 || chartReps.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              {chartMetodos.length > 0 && (
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-cream-300/60">
                  <h2 className="font-serif font-medium text-bark text-base mb-4">Métodos de pago — {formatMes(mesSeleccionado)}</h2>
                  <ChartMetodosPago data={chartMetodos} />
                </div>
              )}
              {chartReps.length > 0 && (
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-cream-300/60">
                  <h2 className="font-serif font-medium text-bark text-base mb-4">Comisiones por representante — {formatMes(mesSeleccionado)}</h2>
                  <ChartComisionesPorRep data={chartReps} />
                </div>
              )}
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
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-[11px] text-bark-500">Plan</p>
                      <p className="text-sm font-medium text-bark">{asignacionInfo.plan_nombre}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-bark-500">Precio contratado</p>
                      <p className="text-sm font-medium text-bark">{formatPesos(asignacionInfo.precio_contratado)}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-bark-500">Monto a cobrar</p>
                      <p className="text-sm font-semibold text-bark">{formatPesos(parseFloat(form.monto || "0"))}</p>
                    </div>
                  </div>

                  {asignacionInfo.representante_nombre ? (
                    <div className="mt-3 pt-3 border-t border-cream-200">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200/60 rounded-full px-2.5 py-1">
                          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                          Delegado: {asignacionInfo.representante_nombre}
                        </span>
                        <span className="inline-flex items-center text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200/60 rounded-full px-2.5 py-1">
                          <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                          {asignacionInfo.comision_porcentaje}%
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex justify-between items-center bg-amber-50/60 rounded-lg px-3 py-2">
                          <span className="text-amber-700">Comisión ({asignacionInfo.comision_porcentaje}%)</span>
                          <span className="font-semibold text-amber-800">{formatPesos(Math.round((parseFloat(form.monto || "0") * asignacionInfo.comision_porcentaje) / 100))}</span>
                        </div>
                        <div className="flex justify-between items-center bg-sage-50/60 rounded-lg px-3 py-2">
                          <span className="text-sage-700">Ingreso Guía</span>
                          <span className="font-semibold text-sage-800">{formatPesos(Math.round(parseFloat(form.monto || "0") - (parseFloat(form.monto || "0") * asignacionInfo.comision_porcentaje) / 100))}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 pt-3 border-t border-cream-200 text-sm text-bark-500 text-center">
                      Sin delegado asignado — el 100% es para el Guía
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
              {pagosFiltrados.map((p) => {
                const rep = getRepForFacilitador(p.facilitador_id);
                return (
                <div key={p.id} className="bg-white rounded-xl border border-cream-200 p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-bark text-sm">{p.facilitadores?.nombre || "—"}</span>
                      {p.planes && <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">{p.planes.nombre}</span>}
                      <span className="text-xs text-bark-500">{p.fecha_pago}</span>
                      <span className="text-xs text-bark-500">{METODOS[p.metodo_pago] || p.metodo_pago}</span>
                      {p.periodo && <span className="text-xs text-bark-400">{p.periodo}</span>}
                    </div>
                    {rep && (
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 border border-amber-200/50 rounded-full px-2 py-0.5">
                          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                          {rep.nombre}
                        </span>
                        <span className="text-[11px] text-amber-600">→ {rep.porcentaje}% = {formatPesos(Math.round((Number(p.monto) * rep.porcentaje) / 100))}</span>
                        <span className="text-[11px] text-sage-600">Guía: {formatPesos(Math.round(Number(p.monto) - (Number(p.monto) * rep.porcentaje) / 100))}</span>
                      </div>
                    )}
                    {p.observaciones && <p className="text-xs text-bark-400 mt-1 truncate">{p.observaciones}</p>}
                  </div>
                  <span className="text-lg font-serif font-semibold text-sage-700 shrink-0">{formatPesos(p.monto)}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => openEdit(p)} className="p-1.5 text-bark-500 hover:text-bark-700 hover:bg-cream-200 rounded-lg transition-colors"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 text-bark-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
                );
              })}
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
