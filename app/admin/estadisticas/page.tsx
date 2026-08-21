"use client";

import { useState, useEffect } from "react";
import {
  MousePointerClick,
  TrendingUp,
  Search,
  BarChart3,
  CalendarRange,
  MessageCircle,
  Phone,
  ExternalLink,
  Navigation,
  Eye,
  SearchX,
  Download,
} from "lucide-react";

function Instagram({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
import { supabase } from "@/lib/supabase/client";
import { downloadCSV } from "@/lib/csv";

interface ClickRaw {
  tipo: string;
  referencia_id: string;
  created_at: string;
}

const TIPOS_LABEL: Record<string, string> = {
  actividad: "Actividad",
  facilitador: "Visita a perfil",
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  telefono: "Teléfono",
  sitio_web: "Sitio web",
  como_llegar: "Cómo llegar",
  busqueda: "Búsqueda",
  busqueda_sin_resultado: "Búsqueda sin resultado",
};

const TIPOS_ICON: Record<string, any> = {
  whatsapp: MessageCircle,
  instagram: Instagram,
  telefono: Phone,
  sitio_web: ExternalLink,
  como_llegar: Navigation,
  facilitador: Eye,
  busqueda: Search,
  busqueda_sin_resultado: SearchX,
};

export default function EstadisticasAdmin() {
  const [clicks, setClicks] = useState<ClickRaw[]>([]);
  const [actividadNames, setActividadNames] = useState<Record<string, string>>({});
  const [facilitadorNames, setFacilitadorNames] = useState<Record<string, string>>({});
  const [cargando, setCargando] = useState(true);
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [filtroFacilitador, setFiltroFacilitador] = useState("");

  useEffect(() => {
    async function load() {
      const [{ data: clicks }, { data: acts }, { data: fas }] = await Promise.all([
        supabase.from("clicks").select("tipo, referencia_id, created_at").order("created_at", { ascending: false }),
        supabase.from("actividades").select("slug, nombre"),
        supabase.from("facilitadores").select("id, nombre"),
      ]);

      if (clicks) setClicks(clicks as ClickRaw[]);

      if (acts) {
        const map: Record<string, string> = {};
        for (const a of acts) map[a.slug] = a.nombre;
        setActividadNames(map);
      }
      if (fas) {
        const map: Record<string, string> = {};
        for (const f of fas) map[f.id] = f.nombre;
        setFacilitadorNames(map);
      }

      setCargando(false);
    }
    load();
  }, []);

  const filtered = clicks.filter((c) => {
    const fecha = c.created_at ? c.created_at.slice(0, 10) : "";
    if (desde && fecha < desde) return false;
    if (hasta && fecha > hasta) return false;
    if (filtroFacilitador && c.referencia_id !== filtroFacilitador) return false;
    return true;
  });

  // Conteo por tipo
  const conteoPorTipo: Record<string, number> = {};
  for (const c of filtered) {
    conteoPorTipo[c.tipo] = (conteoPorTipo[c.tipo] || 0) + 1;
  }

  // Búsquedas más frecuentes (termino = referencia_id)
  const busquedas: Record<string, number> = {};
  const sinResultado: Record<string, number> = {};
  for (const c of filtered) {
    if (c.tipo === "busqueda") busquedas[c.referencia_id] = (busquedas[c.referencia_id] || 0) + 1;
    if (c.tipo === "busqueda_sin_resultado") sinResultado[c.referencia_id] = (sinResultado[c.referencia_id] || 0) + 1;
  }
  const topBusquedas = Object.entries(busquedas).sort((a, b) => b[1] - a[1]).slice(0, 15);
  const topSinResultado = Object.entries(sinResultado).sort((a, b) => b[1] - a[1]).slice(0, 15);

  // Actividades más clickeadas (tipo = actividad)
  const actClicks: Record<string, number> = {};
  for (const c of filtered) {
    if (c.tipo === "actividad") actClicks[c.referencia_id] = (actClicks[c.referencia_id] || 0) + 1;
  }
  const topActividades = Object.entries(actClicks).sort((a, b) => b[1] - a[1]).slice(0, 10);

  // Visitas a perfiles (tipo = facilitador)
  const perfClicks: Record<string, number> = {};
  for (const c of filtered) {
    if (c.tipo === "facilitador") perfClicks[c.referencia_id] = (perfClicks[c.referencia_id] || 0) + 1;
  }
  const topPerfiles = Object.entries(perfClicks).sort((a, b) => b[1] - a[1]).slice(0, 10);

  // Evolución por día
  const porDia: Record<string, number> = {};
  for (const c of filtered) {
    const dia = c.created_at ? c.created_at.slice(0, 10) : "sin fecha";
    porDia[dia] = (porDia[dia] || 0) + 1;
  }
  const dias = Object.entries(porDia).sort((a, b) => a[0].localeCompare(b[0]));

  const total = filtered.length;

  function BarRow({ label, count, max, color = "bg-sage-500" }: { label: string; count: number; max: number; color?: string }) {
    const pct = max > 0 ? Math.round((count / max) * 100) : 0;
    return (
      <div className="flex items-center gap-3">
        <span className="text-xs text-bark-600 w-40 truncate shrink-0">{label}</span>
        <div className="flex-1 h-4 bg-cream-100 rounded-full overflow-hidden">
          <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
        </div>
        <span className="text-xs font-medium text-bark-600 w-10 text-right shrink-0">{count}</span>
      </div>
    );
  }

  const tiposFiltrables = ["facilitador", "whatsapp", "instagram", "telefono", "sitio_web", "como_llegar", "busqueda", "busqueda_sin_resultado"];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium text-bark">Estadísticas</h1>
          <p className="text-sm text-bark-500 mt-1">Actividad de la plataforma filtrable por fecha.</p>
        </div>
        {filtered.length > 0 && (
          <button
            onClick={() => downloadCSV(filtered.map((c) => ({
              fecha: c.created_at?.slice(0, 10) || "",
              hora: c.created_at?.slice(11, 19) || "",
              tipo: TIPOS_LABEL[c.tipo] || c.tipo,
              referencia: c.tipo === "actividad" ? (actividadNames[c.referencia_id] || c.referencia_id)
                : c.tipo === "facilitador" ? (facilitadorNames[c.referencia_id] || c.referencia_id)
                : c.referencia_id,
            })), `estadisticas_${new Date().toISOString().slice(0, 10)}.csv`)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sage-50 text-sage-700 border border-sage-200 hover:bg-sage-100 transition-all duration-300 text-sm font-medium"
          >
            <Download className="h-4 w-4" /> Descargar CSV
          </button>
        )}
      </div>

      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-cream-300/60 mb-6">
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
          <div>
            <label className="block text-xs font-medium text-bark-600 mb-1">Profesional (estadísticas individuales)</label>
            <select value={filtroFacilitador} onChange={(e) => setFiltroFacilitador(e.target.value)} className="px-3 py-2 rounded-xl border border-cream-300 text-sm text-bark bg-white focus:outline-none focus:ring-2 focus:ring-sage-400/40 max-w-xs">
              <option value="">Todos</option>
              {Object.entries(facilitadorNames).map(([id, nombre]) => (
                <option key={id} value={id}>{nombre}</option>
              ))}
            </select>
          </div>
          {(desde || hasta || filtroFacilitador) && (
            <button onClick={() => { setDesde(""); setHasta(""); setFiltroFacilitador(""); }} className="mt-5 text-xs text-sage-600 hover:text-sage-700 font-medium">Limpiar</button>
          )}
        </div>
      </div>

      {cargando ? (
        <div className="p-8 text-center text-bark-500">Cargando...</div>
      ) : (
        <>
          {/* Total y clicks por tipo */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
            <div className="bg-white/70 rounded-2xl p-4 border border-cream-300/60 text-center">
              <p className="text-2xl font-serif font-medium text-bark">{total}</p>
              <p className="text-xs text-bark-500 mt-0.5">Eventos totales</p>
            </div>
            {tiposFiltrables.map((tipo) => {
              const Icon = TIPOS_ICON[tipo] || MousePointerClick;
              return (
                <div key={tipo} className="bg-white/70 rounded-2xl p-4 border border-cream-300/60 text-center">
                  <Icon className="h-5 w-5 mx-auto mb-1 text-bark-400" />
                  <p className="text-xl font-serif font-medium text-bark">{conteoPorTipo[tipo] || 0}</p>
                  <p className="text-xs text-bark-500 mt-0.5">{TIPOS_LABEL[tipo]}</p>
                </div>
              );
            })}
          </div>

          {/* Evolución por día */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-cream-300/60 mb-6">
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 className="h-5 w-5 text-bark-500" />
              <h2 className="font-serif font-medium text-bark text-lg">Evolución por día</h2>
            </div>
            {dias.length === 0 ? (
              <p className="text-sm text-bark-500">Sin datos en el período</p>
            ) : (
              <div className="space-y-2">
                {dias.map(([dia, count]) => (
                  <div key={dia} className="flex items-center gap-3">
                    <span className="text-xs text-bark-500 w-24 shrink-0">{dia}</span>
                    <div className="flex-1 h-5 bg-cream-100 rounded-full overflow-hidden">
                      <div className="h-full bg-sage-500 rounded-full" style={{ width: `${Math.round((count / dias[0][1]) * 100)}%` }} />
                    </div>
                    <span className="text-xs font-medium text-bark-600 w-8 text-right">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Búsquedas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div className="bg-white/70 rounded-2xl p-6 border border-cream-300/60">
              <div className="flex items-center gap-2 mb-5">
                <Search className="h-5 w-5 text-bark-500" />
                <h2 className="font-serif font-medium text-bark text-lg">Búsquedas más frecuentes</h2>
              </div>
              {topBusquedas.length === 0 ? (
                <p className="text-sm text-bark-500">Sin búsquedas registradas</p>
              ) : (
                <div className="space-y-2">
                  {topBusquedas.map(([term, count]) => (
                    <BarRow key={term} label={term} count={count} max={topBusquedas[0][1]} />
                  ))}
                </div>
              )}
            </div>
            <div className="bg-white/70 rounded-2xl p-6 border border-cream-300/60">
              <div className="flex items-center gap-2 mb-5">
                <SearchX className="h-5 w-5 text-bark-500" />
                <h2 className="font-serif font-medium text-bark text-lg">Búsquedas sin resultado</h2>
              </div>
              {topSinResultado.length === 0 ? (
                <p className="text-sm text-bark-500">Sin búsquedas sin resultado</p>
              ) : (
                <div className="space-y-2">
                  {topSinResultado.map(([term, count]) => (
                    <BarRow key={term} label={term} count={count} max={topSinResultado[0][1]} color="bg-amber-500" />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actividades y perfiles más clickeados */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div className="bg-white/70 rounded-2xl p-6 border border-cream-300/60">
              <div className="flex items-center gap-2 mb-5">
                <TrendingUp className="h-5 w-5 text-bark-500" />
                <h2 className="font-serif font-medium text-bark text-lg">Actividades más vistas</h2>
              </div>
              {topActividades.length === 0 ? (
                <p className="text-sm text-bark-500">Sin datos</p>
              ) : (
                <div className="space-y-2">
                  {topActividades.map(([slug, count]) => (
                    <BarRow key={slug} label={actividadNames[slug] || slug} count={count} max={topActividades[0][1]} />
                  ))}
                </div>
              )}
            </div>
            <div className="bg-white/70 rounded-2xl p-6 border border-cream-300/60">
              <div className="flex items-center gap-2 mb-5">
                <Eye className="h-5 w-5 text-bark-500" />
                <h2 className="font-serif font-medium text-bark text-lg">Perfiles más visitados</h2>
              </div>
              {topPerfiles.length === 0 ? (
                <p className="text-sm text-bark-500">Sin datos</p>
              ) : (
                <div className="space-y-2">
                  {topPerfiles.map(([id, count]) => (
                    <BarRow key={id} label={facilitadorNames[id] || id} count={count} max={topPerfiles[0][1]} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
