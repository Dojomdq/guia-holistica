"use client";

import { useState, useEffect } from "react";
import { Users, Activity, Tag, ExternalLink, MousePointerClick, TrendingUp } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

interface ClickStat {
  referencia_id: string;
  count: number;
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
    { label: "Categorías", value: totalCategorias, icon: Tag, href: "/admin/categorias" },
    { label: "Total Clicks", value: totalClicks, icon: MousePointerClick, href: null },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const Wrapper = stat.href ? Link : "div";
          return (
            <Wrapper key={stat.label} href={stat.href || ""} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:border-gray-400 hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                <div className="bg-gray-900 h-10 w-10 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </div>
            </Wrapper>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-gray-400" />
            <h2 className="font-bold text-gray-900">Actividades más clickeadas</h2>
          </div>
          {topActividades.length === 0 ? (
            <p className="text-sm text-gray-400">Sin datos aún</p>
          ) : (
            <div className="space-y-2">
              {topActividades.map((item, i) => {
                const maxCount = topActividades[0]?.count || 1;
                const pct = Math.round((item.count / maxCount) * 100);
                return (
                  <div key={item.referencia_id} className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-4 text-right">{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-sm text-gray-700 truncate">{actividadNames[item.referencia_id] || item.referencia_id}</span>
                        <span className="text-xs font-medium text-gray-500">{item.count}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-gray-400" />
            <h2 className="font-bold text-gray-900">Facilitadores más clickeados</h2>
          </div>
          {topFacilitadores.length === 0 ? (
            <p className="text-sm text-gray-400">Sin datos aún</p>
          ) : (
            <div className="space-y-2">
              {topFacilitadores.map((item, i) => {
                const maxCount = topFacilitadores[0]?.count || 1;
                const pct = Math.round((item.count / maxCount) * 100);
                return (
                  <div key={item.referencia_id} className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-4 text-right">{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-sm text-gray-700 truncate">{facilitadorNames[item.referencia_id] || item.referencia_id}</span>
                        <span className="text-xs font-medium text-gray-500">{item.count}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <a href="/" target="_blank" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 font-medium">
        <ExternalLink className="h-4 w-4" /> Ver sitio público
      </a>
    </div>
  );
}
