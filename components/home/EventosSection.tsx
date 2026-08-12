"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, MapPin, ArrowUpRight } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useScrollReveal } from "@/lib/useScrollReveal";

interface Evento {
  id: string;
  titulo: string;
  descripcion: string | null;
  fecha: string | null;
  imagen_url: string | null;
  link: string | null;
}

export default function EventosSection() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const { ref, isVisible } = useScrollReveal();

  useEffect(() => {
    supabase
      .from("eventos")
      .select("id, titulo, descripcion, fecha, imagen_url, link")
      .eq("activo", true)
      .order("created_at", { ascending: false })
      .limit(3)
      .then(({ data }) => { if (data) setEventos(data); });
  }, []);

  if (eventos.length === 0) return null;

  return (
    <section ref={ref} className="py-16 sm:py-20 bg-cream-50 dark:bg-bark-950">
      <div className="container-page">
        <div className={`text-center mb-10 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-terracotta-100 dark:bg-terracotta-900/30 text-terracotta-700 dark:text-terracotta-300 text-[11px] font-mono font-semibold tracking-[0.14em] uppercase rounded-full mb-4">
            <Calendar className="h-3 w-3" /> Próximos
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-bark dark:text-cream-100">Eventos y talleres</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {eventos.map((e, i) => (
            <a
              key={e.id}
              href={e.link || "#"}
              target={e.link ? "_blank" : undefined}
              rel={e.link ? "noopener noreferrer" : undefined}
              className={`group bg-white dark:bg-bark-900 rounded-2xl border border-cream-200/80 dark:border-bark-700/80 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {e.imagen_url && (
                <div className={`${/\.(mp4|webm|mov|ogg)(\?|$)/i.test(e.imagen_url) ? "aspect-[9/16]" : "aspect-[4/5]"} overflow-hidden bg-cream-100`}>
                  {/\.(mp4|webm|mov|ogg)(\?|$)/i.test(e.imagen_url) ? (
                    <video
                      src={e.imagen_url}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img src={e.imagen_url} alt={e.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  )}
                </div>
              )}
              <div className="p-5">
                {e.fecha && (
                  <p className="text-xs font-medium text-terracotta-600 dark:text-terracotta-400 flex items-center gap-1.5 mb-2">
                    <Calendar className="h-3.5 w-3.5" /> {e.fecha}
                  </p>
                )}
                <h3 className="font-serif text-lg font-medium text-bark dark:text-cream-100 group-hover:text-sage-700 transition-colors flex items-center gap-2">
                  {e.titulo}
                  {e.link && <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-60 transition-opacity" />}
                </h3>
                {e.descripcion && (
                  <p className="text-sm text-bark-600 dark:text-cream-300 mt-2 line-clamp-2 leading-relaxed">{e.descripcion}</p>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
