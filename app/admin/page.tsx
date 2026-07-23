"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Activity,
  Tag,
  ExternalLink,
  MousePointerClick,
  TrendingUp,
} from "lucide-react";
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
    { label: "Categorias", value: totalCategorias, icon: Tag, href: "/admin/categorias" },
    { label: "Total Clicks", value: totalClicks, icon: MousePointerClick, href: null as string | null },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl sm:text-3xl font-medium text-warmblack">Dashboard</h1>
        <p className="text-small mt-1">Resumen de tu guia holistica</p>
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
                <div className="bg-warmblack h-10 w-10 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-2xl font-serif font-medium text-warmblack">{stat.value}</p>
                  <p className="text-xs text-warmblack/40">{stat.label}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-cream-300/60">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="h-5 w-5 text-warmblack/30" />
            <h2 className="font-serif font-medium text-warmblack text-lg">Actividades mas clickeadas</h2>
          </div>
          {topActividades.length === 0 ? (
            <p className="text-sm text-warmblack/30">Sin datos aun</p>
          ) : (
            <div className="space-y-3">
              {topActividades.map((item, i) => {
                const maxCount = topActividades[0]?.count || 1;
                const pct = Math.round((item.count / maxCount) * 100);
                return (
                  <div key={item.referencia_id} className="flex items-center gap-3">
                    <span className="text-xs text-warmblack/20 w-4 text-right">{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-warmblack/70 truncate">
                          {actividadNames[item.referencia_id] || item.referencia_id}
                        </span>
                        <span className="text-xs font-medium text-warmblack/40">{item.count}</span>
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
            <TrendingUp className="h-5 w-5 text-warmblack/30" />
            <h2 className="font-serif font-medium text-warmblack text-lg">Facilitadores mas clickeados</h2>
          </div>
          {topFacilitadores.length === 0 ? (
            <p className="text-sm text-warmblack/30">Sin datos aun</p>
          ) : (
            <div className="space-y-3">
              {topFacilitadores.map((item, i) => {
                const maxCount = topFacilitadores[0]?.count || 1;
                const pct = Math.round((item.count / maxCount) * 100);
                return (
                  <div key={item.referencia_id} className="flex items-center gap-3">
                    <span className="text-xs text-warmblack/20 w-4 text-right">{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-warmblack/70 truncate">
                          {facilitadorNames[item.referencia_id] || item.referencia_id}
                        </span>
                        <span className="text-xs font-medium text-warmblack/40">{item.count}</span>
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

      <a href="/" target="_blank" className="inline-flex items-center gap-2 text-sm text-warmblack/40 hover:text-warmblack/60 font-medium transition-colors">
        <ExternalLink className="h-4 w-4" /> Ver sitio publico
      </a>
    </div>
  );
}
