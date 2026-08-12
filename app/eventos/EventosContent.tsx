"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Calendar, MapPin, ArrowUpRight, Filter } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { CITY_COORDS } from "@/lib/constants";

const EventoMapa = dynamic(() => import("@/components/EventoMapa"), { ssr: false, loading: () => <div className="h-[300px] bg-cream-100 dark:bg-bark-800 rounded-2xl animate-pulse" /> });

interface Evento {
  id: string; titulo: string; descripcion: string | null; fecha: string | null;
  imagen_url: string | null; link: string | null; ciudad: string | null;
  latitud: number | null; longitud: number | null;
}

export default function EventosContent() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [ciudades, setCiudades] = useState<string[]>([]);
  const [filtroCiudad, setFiltroCiudad] = useState<string | null>(null);
  const [eventoSeleccionado, setEventoSeleccionado] = useState<Evento | null>(null);

  useEffect(() => {
    supabase.from("eventos").select("*").eq("activo", true).order("created_at", { ascending: false }).then(({ data }) => {
      if (data) {
        setEventos(data);
        const cSet = new Set(data.filter((e:Evento) => e.ciudad).map((e:Evento) => e.ciudad));
        setCiudades(Array.from(cSet) as string[]);
      }
    });
  }, []);

  const filtered = filtroCiudad ? eventos.filter(e => e.ciudad === filtroCiudad) : eventos;
  const mapaEventos = filtered.filter(e => e.latitud && e.longitud);

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-bark-950">
      <div className="container-page py-10 sm:py-14">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-terracotta-100 dark:bg-terracotta-900/30 text-terracotta-700 dark:text-terracotta-300 text-[11px] font-mono font-semibold tracking-[0.14em] uppercase rounded-full mb-4">
            <Calendar className="h-3 w-3" /> Próximos
          </span>
          <h1 className="heading-lg text-bark dark:text-cream-100">Eventos y talleres</h1>
          <p className="text-bark-600 dark:text-cream-300 mt-3 max-w-lg mx-auto">Descubrí los próximos encuentros de bienestar.</p>
        </div>

        {ciudades.length > 1 && (
          <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
            <Filter className="h-4 w-4 text-bark-400" />
            <button onClick={() => { setFiltroCiudad(null); setEventoSeleccionado(null); }} className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${!filtroCiudad ? "bg-bark text-white" : "bg-white dark:bg-bark-900 text-bark-600 dark:text-cream-300 border"}`}>Todos</button>
            {ciudades.map(c => (
              <button key={c} onClick={() => { setFiltroCiudad(c); setEventoSeleccionado(null); }} className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${filtroCiudad === c ? "bg-bark text-white" : "bg-white dark:bg-bark-900 text-bark-600 dark:text-cream-300 border"}`}>{c}</button>
            ))}
          </div>
        )}

        {mapaEventos.length > 0 && (
          <div className="max-w-5xl mx-auto mb-8">
            <div className="rounded-2xl overflow-hidden border border-cream-200 dark:border-bark-700 shadow-md">
              <EventoMapa eventos={mapaEventos} seleccionado={eventoSeleccionado} onSelect={setEventoSeleccionado} />
            </div>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-bark-500"><Calendar className="h-12 w-12 mx-auto mb-3 opacity-30" /><p>No hay eventos {filtroCiudad ? `en ${filtroCiudad}` : "aún"}.</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {filtered.map(e => (
              <a key={e.id} href={e.link || "#"} target={e.link ? "_blank" : undefined} rel={e.link ? "noopener noreferrer" : undefined}
                className="group bg-white dark:bg-bark-900 rounded-2xl border border-cream-200/80 dark:border-bark-700/80 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                {e.imagen_url && <div className="aspect-[4/5] overflow-hidden"><img src={e.imagen_url} alt={e.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>}
                <div className="p-5">
                  {e.fecha && <p className="text-xs font-medium text-terracotta-600 dark:text-terracotta-400 flex items-center gap-1.5 mb-2"><Calendar className="h-3.5 w-3.5" />{e.fecha}</p>}
                  <h3 className="font-serif text-lg font-medium text-bark dark:text-cream-100 group-hover:text-sage-700 transition-colors flex items-center gap-2">{e.titulo}{e.link && <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-60 transition-opacity" />}</h3>
                  {e.descripcion && <p className="text-sm text-bark-600 dark:text-cream-300 mt-2 line-clamp-2">{e.descripcion}</p>}
                  {e.ciudad && <p className="text-xs text-bark-500 dark:text-cream-400 mt-3 flex items-center gap-1"><MapPin className="h-3 w-3" />{e.ciudad}</p>}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
