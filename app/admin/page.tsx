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
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

interface ClickStat {
  referencia_id: string;
  count: number;
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
  const [totalClicks, setTotalClicks] = useState(0);
  const [topActividades, setTopActividades] = useState<ClickStat[]>([]);
  const [topFacilitadores, setTopFacilitadores] = useState<ClickStat[]>([]);
  const [actividadNames, setActividadNames] = useState<Record<string, string>>({});
  const [facilitadorNames, setFacilitadorNames] = useState<Record<string, string>>({});
  const [comisionStats, setComisionStats] = useState<ComisionStat>({
    totalComisiones: 0,
    comisionesPendientes: 0,
    comisionesPagadas: 0,
    ingresoBruto: 0,
    ingresoNeto: 0,
  });

  useEffect(() => {
    async function load() {
      const [f, a, c] = await Promise.all([
        supabase.from("facilitadores").select("id", { count: "exact", head: true }),
        supabase.from("actividades").select("id", { count: "exact", head: true }),
        supabase.from("categorias").select("id", { count: "exact", head: true }),
      ]);
      setTotalFacilitadores(f.count || 0);
      setTotalActividades(a.count || 0);
      setTotalCategorias(c.count || 0);

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

      const { data: clicks } = await supabase.from("clicks").select("tipo, referencia_id");

      if (clicks) {
        setTotalClicks(clicks.length);

        const actClicks: Record<string, number> = {};
        const fasClicks: Record<string, number> = {};
        for (const click of clicks) {
          if (click.tipo === "actividad") {
            actClicks[click.referencia_id] = (actClicks[click.referencia_id] || 0) + 1;
          } else {
            fasClicks[click.referencia_id] = (fasClicks[click.referencia_id] || 0) + 1;
          }
        }

        setTopActividades(
          Object.entries(actClicks)
            .map(([id, count]) => ({ referencia_id: id, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10)
        );

        setTopFacilitadores(
          Object.entries(fasClicks)
            .map(([id, count]) => ({ referencia_id: id, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10)
        );

        const [actsRes, fasRes] = await Promise.all([
          supabase.from("actividades").select("slug, nombre"),
          supabase.from("facilitadores").select("id, nombre"),
        ]);

        if (actsRes.data) {
          const map: Record<string, string> = {};
          for (const act of actsRes.data) map[act.slug] = act.nombre;
          setActividadNames(map);
        }
        if (fasRes.data) {
          const map: Record<string, string> = {};
          for (const fa of fasRes.data) map[fa.id] = fa.nombre;
          setFacilitadorNames(map);
        }
      }
    }
    load();
  }, []);

  const stats = [
    { label: "Facilitadores", value: totalFacilitadores, icon: Users, href: "/admin/facilitadores" },
    { label: "Actividades", value: totalActividades, icon: Activity, href: "/admin/actividades" },
    { label: "Categorias", value: totalCategorias, icon: Tag, href: "/admin/categorias" },
    { label: "Total Clicks", value: totalClicks, icon: MousePointerClick, href: null as string | null },
  ];

  const formatPesos = (v: number) => v.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl sm:text-3xl font-medium text-bark">Dashboard</h1>
        <p className="text-small mt-1">Resumen de tu directorio de bienestar</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-cream-300/60">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="h-5 w-5 text-bark-500" />
            <h2 className="font-serif font-medium text-bark text-lg">Actividades mas clickeadas</h2>
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
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="h-5 w-5 text-bark-500" />
            <h2 className="font-serif font-medium text-bark text-lg">Facilitadores mas clickeados</h2>
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
