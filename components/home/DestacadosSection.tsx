"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ArrowUpRight, MessageCircle } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { getCategoryIcon, CATEGORY_MARKER_COLORS } from "@/lib/categories";
import InstagramIcon from "@/components/ui/InstagramIcon";

interface Destacado {
  id: string;
  facilitador_id: string;
  facilitadores: {
    id: string;
    nombre: string;
    bio: string | null;
    foto_url: string | null;
    slug: string | null;
    instagram: string | null;
    whatsapp: string | null;
    facilitador_actividades: { actividades: { nombre: string; slug: string } | null }[] | null;
  } | null;
}

export default function DestacadosSection() {
  const [destacados, setDestacados] = useState<Destacado[]>([]);

  useEffect(() => {
    async function load() {
      const [manualRes, premiumRes] = await Promise.all([
        supabase
          .from("destacados")
          .select("id, facilitador_id, facilitadores(id, nombre, bio, foto_url, slug, instagram, whatsapp, facilitador_actividades(actividades(nombre, slug)))")
          .eq("tipo", "sitio")
          .eq("activo", true),
        supabase
          .from("facilitador_planes")
          .select("facilitador_id, planes(perfil_destacado), facilitadores(id, nombre, bio, foto_url, slug, instagram, whatsapp, activo, facilitador_actividades(actividades(nombre, slug)))")
          .eq("estado", "activo"),
      ]);

      const manuales = (manualRes.data || []) as Destacado[];
      const idsManuales = new Set(manuales.map((d) => d.facilitador_id));

      // Premium (perfil destacado) auto-incluidos
      const premium: Destacado[] = (premiumRes.data || [])
        .filter((p: any) => p.planes?.perfil_destacado && p.facilitadores?.activo)
        .filter((p: any) => !idsManuales.has(p.facilitador_id))
        .map((p: any) => ({
          id: p.facilitador_id,
          facilitador_id: p.facilitador_id,
          facilitadores: p.facilitadores,
        }));

      setDestacados([...manuales, ...premium]);
    }
    load();
  }, []);

  if (destacados.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 bg-cream-50 dark:bg-bark-950">
      <div className="container-page">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-[11px] font-mono font-semibold tracking-[0.14em] uppercase rounded-full mb-4">
            <Star className="h-3 w-3" /> Del mes
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-bark dark:text-cream-100">Destacados del mes</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {destacados.map((d) => {
            const f = d.facilitadores;
            if (!f) return null;
            const act = f.facilitador_actividades?.[0]?.actividades;
            const Icon = getCategoryIcon(act?.slug || "");
            const color = CATEGORY_MARKER_COLORS[act?.slug || ""] || "#5d8a6e";
            const waLink = f.whatsapp
              ? `https://wa.me/${f.whatsapp.replace(/[^0-9]/g, "")}`
              : null;
            const igLink = f.instagram
              ? `https://instagram.com/${f.instagram.replace("@", "")}`
              : null;
            return (
              <div
                key={d.id}
                className="group bg-white dark:bg-bark-900 rounded-2xl border border-cream-200/80 dark:border-bark-700/80 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col"
              >
                <div className="aspect-[4/3] overflow-hidden bg-cream-100 relative">
                  {f.foto_url ? (
                    <Image
                      src={f.foto_url}
                      alt={f.nombre}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: `${color}12` }}>
                      <Icon className="h-16 w-16" style={{ color }} strokeWidth={1} />
                    </div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2.5 mb-1">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${color}12` }}
                    >
                      <Icon className="h-4 w-4" style={{ color }} strokeWidth={1.5} />
                    </div>
                    <h3 className="font-serif text-lg font-medium text-bark dark:text-cream-100 truncate">{f.nombre}</h3>
                  </div>
                  {act && <p className="text-xs text-bark-500 mb-3">{act.nombre}</p>}

                  <div className="flex items-center gap-2 mt-auto">
                    <Link
                      href={`/facilitadores/${f.slug || f.id}`}
                      className="inline-flex items-center gap-1 text-[13px] font-medium text-sage-600 hover:text-sage-700 transition-colors"
                    >
                      Ver perfil
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                    {waLink && (
                      <a href={waLink} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="ml-auto p-2 rounded-full bg-sage-50 hover:bg-sage-100 text-sage-600 transition-colors">
                        <MessageCircle className="h-4 w-4" />
                      </a>
                    )}
                    {igLink && (
                      <a href={igLink} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-2 rounded-full bg-cream-100 hover:bg-cream-200 text-bark-600 transition-colors">
                        <InstagramIcon className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
