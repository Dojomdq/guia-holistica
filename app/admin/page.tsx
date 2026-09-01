"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Activity,
  Tag,
  ExternalLink,
  MousePointerClick,
  TrendingUp,
  Percent,
  CalendarRange,
  Trash2,
  BarChart3,
  Download,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { downloadCSV } from "@/lib/csv";

interface ClickStat {
  referencia_id: string;
  count: number;
}

interface ClickRaw {
  tipo: string;
  referencia_id: string;
  created_at: string;
}

interface ComisionStat {
  totalComisiones: number;
  comisionesPendientes: number;
  comisionesPagadas: number;
  ingresoBruto: number;
  ingresoNeto: number;
}

export default function AdminDashboard() {
  const [totalFacilitadores, setTotalFacilitadores] = useState(0);
  const [totalActividades, setTotalActividades] = useState(0);
  const [totalCategorias, setTotalCategorias] = useState(0);
  const [clicksRaw, setClicksRaw] = useState<ClickRaw[]>([]);
  const [actividadNames, setActividadNames] = useState<Record<string, string>>({});
  const [facilitadorNames, setFacilitadorNames] = useState<Record<string, string>>({});
  const [comisionStats, setComisionStats] = useState<ComisionStat>({
    totalComisiones: 0,
    comisionesPendientes: 0,
    comisionesPagadas: 0,
    ingresoBruto: 0,
    ingresoNeto: 0,
  });
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [reseteando, setReseteando] = useState(false);
  const [planesAsignados, setPlanesAsignados] = useState<any[]>([]);
  const [planesNombres, setPlanesNombres] = useState<Record<string, string>>({});
  const [pagosTotal, setPagosTotal] = useState(0);
  const [pagosMes, setPagosMes] = useState(0);
  const [pagosCount, setPagosCount] = useState(0);

  useEffect(() => {
    async function load() {
      const [f, a, c, cl] = await Promise.all([
        fetch("/api/facilitadores").then((r) => r.json()),
        fetch("/api/actividades").then((r) => r.json()),
        fetch("/api/categorias").then((r) => r.json()),
        fetch("/api/clicks-admin").then((r) => r.json()),
      ]);
      setTotalFacilitadores(Array.isArray(f) ? f.length : 0);
      setTotalActividades(Array.isArray(a) ? a.length : 0);
      setTotalCategorias(Array.isArray(c) ? c.length : 0);

      try {
        const [planRes, fpRes] = await Promise.all([
          fetch("/api/planes").then((r) => r.json()),
          fetch("/api/facilitador-planes").then((r) => r.json()),
        ]);
        if (Array.isArray(planRes)) {
          const map: Record<string, string> = {};
          for (const p of planRes) map[p.id] = p.nombre;
          setPlanesNombres(map);
        }
        if (Array.isArray(fpRes)) setPlanesAsignados(fpRes);
      } catch {}

      try {
        const comRes = await fetch("/api/comisiones");
        const comData = await comRes.json();
        if (Array.isArray(comData)) {
          const pendientes = comData.filter((x: any) => x.estado === "pendiente").reduce((s: number, x: any) => s + (Number(x.importe_comision) || 0), 0);
          const pagadas = comData.filter((x: any) => x.estado === "pagada").reduce((s: number, x: any) => s + (Number(x.importe_comision) || 0), 0);
          const brutos = comData.reduce((s: number, x: any) => s + (Number(x.importe_cobrado) || 0), 0);
          const netos = comData.reduce((s: number, x: any) => s + (Number(x.importe_neto) || 0), 0);
          setComisionStats({
            totalComisiones: comData.reduce((s: number, x: any) => s + (Number(x.importe_comision) || 0), 0),
            comisionesPendientes: pendientes,
            comisionesPagadas: pagadas,
            ingresoBruto: brutos,
            ingresoNeto: netos,
          });
        }
      } catch {}

      try {
        const pagRes = await fetch("/api/pagos");
        const pagData = await pagRes.json();
        if (Array.isArray(pagData)) {
          const mesActual = new Date().toISOString().slice(0, 7);
          setPagosTotal(pagData.reduce((s: number, x: any) => s + (Number(x.monto) || 0), 0));
          setPagosMes(pagData.filter((x: any) => x.fecha_pago?.startsWith(mesActual)).reduce((s: number, x: any) => s + (Number(x.monto) || 0), 0));
          setPagosCount(pagData.length);
        }
      } catch {}

      if (f) {
        const map: Record<string, string> = {};
        for (const fa of f) map[fa.id] = fa.nombre;
        setFacilitadorNames(map);
      }

      if (a) {
        const map: Record<string, string> = {};
        for (const act of a) map[act.slug] = act.nombre;
        setActividadNames(map);
      }

      if (Array.isArray(cl)) setClicksRaw(cl as ClickRaw[]);
    }
    load();
  }, []);

  const filteredClicks = clicksRaw.filter((click) => {
    const fecha = click.created_at ? click.created_at.slice(0, 10) : "";
    if (desde && fecha < desde) return false;
    if (hasta && fecha > hasta) return false;
    return true;
  });

  const totalClicks = filteredClicks.length;

  const actClicks: Record<string, number> = {};
  const fasClicks: Record<string, number> = {};
  for (const click of filteredClicks) {
    if (click.tipo === "actividad") {
      actClicks[click.referencia_id] = (actClicks[click.referencia_id] || 0) + 1;
    } else {
      fasClicks[click.referencia_id] = (fasClicks[click.referencia_id] || 0) + 1;
    }
  }

  const topActividades = Object.entries(actClicks)
    .map(([id, count]) => ({ referencia_id: id, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const topFacilitadores = Object.entries(fasClicks)
    .map(([id, count]) => ({ referencia_id: id, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const clicksPorDia: Record<string, number> = {};
  for (const click of filteredClicks) {
    const dia = click.created_at ? click.created_at.slice(0, 10) : "sin fecha";
    clicksPorDia[dia] = (clicksPorDia[dia] || 0) + 1;
  }
  const diasOrdenados = Object.entries(clicksPorDia).sort((a, b) => a[0].localeCompare(b[0]));

  const stats = [
    { label: "Facilitadores", value: totalFacilitadores, icon: Users, href: "/admin/facilitadores" },
    { label: "Actividades", value: totalActividades, icon: Activity, href: "/admin/actividades" },
    { label: "Categorias", value: totalCategorias, icon: Tag, href: "/admin/categorias" },
    { label: "Total Clicks", value: totalClicks, icon: MousePointerClick, href: null as string | null },
  ];

  const formatPesos = (v: number) => v.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

  async function handleReset() {
    if (!confirm("¿Borrar TODOS los clicks registrados? Esta acción no se puede deshacer.")) return;
    setReseteando(true);
    const query = new URLSearchParams();
    if (desde) query.set("desde", desde);
    if (hasta) query.set("hasta", hasta);
    if (!desde && !hasta) query.set("confirmar", "1");
    const res = await fetch(`/api/clicks-admin?${query.toString()}`, { method: "DELETE" });
    const data = await res.json();
    setReseteando(false);
    if (res.ok) {
      alert(`Borrados ${data.deleted || 0} clicks.`);
      window.location.reload();
    } else {
      alert("Error al borrar: " + (data.error || res.statusText));
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium text-bark">Dashboard</h1>
          <p className="text-small mt-1">Resumen de tu directorio de bienestar</p>
        </div>
        <button
          onClick={() => {
            const rows = filteredClicks.map((c) => ({
              fecha: c.created_at?.slice(0, 10) || "",
              tipo: c.tipo,
              referencia: actividadNames[c.referencia_id] || facilitadorNames[c.referencia_id] || c.referencia_id,
              hora: c.created_at?.slice(11, 19) || "",
            }));
            downloadCSV(rows, `clicks_${new Date().toISOString().slice(0, 10)}.csv`);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sage-50 text-sage-700 border border-sage-200 hover:bg-sage-100 transition-all duration-300 text-sm font-medium"
        >
          <Download className="h-4 w-4" />
          Descargar clicks
        </button>
        <button
          onClick={handleReset}
          disabled={reseteando}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-all duration-300 text-sm font-medium"
        >
          <Trash2 className="h-4 w-4" />
          {reseteando ? "Borrando..." : "Resetear clicks"}
        </button>
      </div>

      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-cream-300/60 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <CalendarRange className="h-5 w-5 text-bark-500" />
          <h2 className="font-serif font-medium text-bark text-base">Filtrar por fecha</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-xs font-medium text-bark-600 mb-1">Desde</label>
            <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} className="px-3 py-2 rounded-xl border border-cream-300 text-sm text-bark bg-white focus:outline-none focus:ring-2 focus:ring-sage-400/40" />
          </div>
          <div>
            <label className="block text-xs font-medium text-bark-600 mb-1">Hasta</label>
            <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} className="px-3 py-2 rounded-xl border border-cream-300 text-sm text-bark bg-white focus:outline-none focus:ring-2 focus:ring-sage-400/40" />
          </div>
          {(desde || hasta) && (
            <button onClick={() => { setDesde(""); setHasta(""); }} className="mt-5 text-xs text-sage-600 hover:text-sage-700 font-medium">Limpiar filtro</button>
          )}
          {(desde || hasta) && (
            <span className="mt-5 text-xs text-bark-500">Mostrando {totalClicks} clicks</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href || "#"}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-cream-300/60 hover:border-cream-400/60 hover:shadow-medium transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="bg-bark h-10 w-10 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-2xl font-serif font-medium text-bark">{stat.value}</p>
                  <p className="text-xs text-bark-600">{stat.label}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Percent className="h-5 w-5 text-bark-500" />
          <h2 className="font-serif font-medium text-bark text-lg">Comisiones de representantes</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white/70 rounded-2xl p-4 border border-cream-300/60 text-center">
            <p className="text-xl font-serif font-medium text-bark">{formatPesos(comisionStats.ingresoBruto)}</p>
            <p className="text-xs text-bark-500 mt-0.5">Ingreso bruto</p>
          </div>
          <div className="bg-white/70 rounded-2xl p-4 border border-cream-300/60 text-center">
            <p className="text-xl font-serif font-medium text-amber-700">{formatPesos(comisionStats.totalComisiones)}</p>
            <p className="text-xs text-bark-500 mt-0.5">Comisiones generadas</p>
          </div>
          <div className="bg-white/70 rounded-2xl p-4 border border-cream-300/60 text-center">
            <p className="text-xl font-serif font-medium text-amber-700">{formatPesos(comisionStats.comisionesPendientes)}</p>
            <p className="text-xs text-bark-500 mt-0.5">Pendientes</p>
          </div>
          <div className="bg-white/70 rounded-2xl p-4 border border-cream-300/60 text-center">
            <p className="text-xl font-serif font-medium text-sage-700">{formatPesos(comisionStats.comisionesPagadas)}</p>
            <p className="text-xs text-bark-500 mt-0.5">Pagadas</p>
          </div>
          <div className="bg-white/70 rounded-2xl p-4 border border-cream-300/60 text-center">
            <p className="text-xl font-serif font-medium text-sage-700">{formatPesos(comisionStats.ingresoNeto)}</p>
            <p className="text-xs text-bark-500 mt-0.5">Ingreso neto Guía</p>
          </div>
        </div>
      </div>

      <Link href="/admin/pagos" className="block bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-cream-300/60 mb-8 hover:border-sage-300/60 hover:shadow-medium transition-all duration-300">
        <div className="flex items-center gap-2 mb-5">
          <DollarSign className="h-5 w-5 text-bark-500" />
          <h2 className="font-serif font-medium text-bark text-lg">Pagos</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-xl font-serif font-medium text-bark">{formatPesos(pagosMes)}</p>
            <p className="text-xs text-bark-500 mt-0.5">Este mes</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-serif font-medium text-sage-700">{formatPesos(pagosTotal)}</p>
            <p className="text-xs text-bark-500 mt-0.5">Total histórico</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-serif font-medium text-bark">{pagosCount}</p>
            <p className="text-xs text-bark-500 mt-0.5">Pagos registrados</p>
          </div>
        </div>
      </Link>

      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-cream-300/60 mb-8">
        <div className="flex items-center gap-2 mb-5">
          <Users className="h-5 w-5 text-bark-500" />
          <h2 className="font-serif font-medium text-bark text-lg">Profesionales por plan</h2>
        </div>
        {planesAsignados.length === 0 ? (
          <p className="text-sm text-bark-500">Sin planes asignados aún</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {(() => {
              const conteo: Record<string, number> = {};
              for (const p of planesAsignados) {
                if (p.plan_id) {
                  const nombre = planesNombres[p.plan_id] || "Plan";
                  conteo[nombre] = (conteo[nombre] || 0) + 1;
                }
              }
              return Object.entries(conteo).map(([nombre, count]) => (
                <span key={nombre} className="px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  {nombre}: {count}
                </span>
              ));
            })()}
          </div>
        )}
      </div>

      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-cream-300/60 mb-8">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-bark-500" />
            <h2 className="font-serif font-medium text-bark text-lg">Tracción por día</h2>
          </div>
          {diasOrdenados.length > 0 && (
            <button
              onClick={() => downloadCSV(diasOrdenados.map(([dia, count]) => ({ fecha: dia, clicks: count })), `traccion_por_dia_${new Date().toISOString().slice(0, 10)}.csv`)}
              className="inline-flex items-center gap-1.5 text-xs text-sage-600 hover:text-sage-700 font-medium"
            >
              <Download className="h-3.5 w-3.5" /> CSV
            </button>
          )}
        </div>
        {diasOrdenados.length === 0 ? (
          <p className="text-sm text-bark-500">Sin datos aún</p>
        ) : (
          <div className="space-y-2">
            {diasOrdenados.map(([dia, count]) => {
              const max = Math.max(...diasOrdenados.map((d) => d[1]));
              const pct = Math.round((count / max) * 100);
              return (
                <div key={dia} className="flex items-center gap-3">
                  <span className="text-xs text-bark-500 w-24 shrink-0">{dia}</span>
                  <div className="flex-1 h-5 bg-cream-100 rounded-full overflow-hidden">
                    <div className="h-full bg-sage-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs font-medium text-bark-600 w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-cream-300/60">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-bark-500" />
              <h2 className="font-serif font-medium text-bark text-lg">Actividades mas clickeadas</h2>
            </div>
            {topActividades.length > 0 && (
              <button
                onClick={() => downloadCSV(topActividades.map((item) => ({ actividad: actividadNames[item.referencia_id] || item.referencia_id, clicks: item.count })), `top_actividades_${new Date().toISOString().slice(0, 10)}.csv`)}
                className="inline-flex items-center gap-1.5 text-xs text-sage-600 hover:text-sage-700 font-medium"
              >
                <Download className="h-3.5 w-3.5" /> CSV
              </button>
            )}
          </div>
          {topActividades.length === 0 ? (
            <p className="text-sm text-bark-500">Sin datos aun</p>
          ) : (
            <div className="space-y-3">
              {topActividades.map((item, i) => {
                const maxCount = topActividades[0]?.count || 1;
                const pct = Math.round((item.count / maxCount) * 100);
                return (
                  <div key={item.referencia_id} className="flex items-center gap-3">
                    <span className="text-xs text-bark-300 w-4 text-right">{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-bark-800 truncate">
                          {actividadNames[item.referencia_id] || item.referencia_id}
                        </span>
                        <span className="text-xs font-medium text-bark-600">{item.count}</span>
                      </div>
                      <div className="h-1.5 bg-cream-200 rounded-full overflow-hidden">
                        <div className="h-full bg-sage-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-cream-300/60">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-bark-500" />
              <h2 className="font-serif font-medium text-bark text-lg">Facilitadores mas clickeados</h2>
            </div>
            {topFacilitadores.length > 0 && (
              <button
                onClick={() => downloadCSV(topFacilitadores.map((item) => ({ facilitador: facilitadorNames[item.referencia_id] || item.referencia_id, clicks: item.count })), `top_facilitadores_${new Date().toISOString().slice(0, 10)}.csv`)}
                className="inline-flex items-center gap-1.5 text-xs text-sage-600 hover:text-sage-700 font-medium"
              >
                <Download className="h-3.5 w-3.5" /> CSV
              </button>
            )}
          </div>
          {topFacilitadores.length === 0 ? (
            <p className="text-sm text-bark-500">Sin datos aun</p>
          ) : (
            <div className="space-y-3">
              {topFacilitadores.map((item, i) => {
                const maxCount = topFacilitadores[0]?.count || 1;
                const pct = Math.round((item.count / maxCount) * 100);
                return (
                  <div key={item.referencia_id} className="flex items-center gap-3">
                    <span className="text-xs text-bark-300 w-4 text-right">{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-bark-800 truncate">
                          {facilitadorNames[item.referencia_id] || item.referencia_id}
                        </span>
                        <span className="text-xs font-medium text-bark-600">{item.count}</span>
                      </div>
                      <div className="h-1.5 bg-cream-200 rounded-full overflow-hidden">
                        <div className="h-full bg-sage-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <a href="/" target="_blank" className="inline-flex items-center gap-2 text-sm text-bark-600 hover:text-bark-700 font-medium transition-colors">
        <ExternalLink className="h-4 w-4" /> Ver sitio publico
      </a>
    </div>
  );
}
