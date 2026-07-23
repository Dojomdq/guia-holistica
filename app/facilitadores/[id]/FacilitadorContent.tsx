"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  MapPin,
  ExternalLink,
  ArrowLeft,
  MessageCircle,
  Mail,
} from "lucide-react";
import InstagramIcon from "@/components/ui/InstagramIcon";
import { supabase } from "@/lib/supabase/client";
import { getCategoryIcon, CATEGORY_MARKER_COLORS } from "@/lib/categories";
import type { FacilitadorConActividades } from "@/lib/types";

const MiniMapDetail = dynamic(() => import("@/components/MiniMapDetail"), {
  ssr: false,
  loading: () => (
    <div className="h-56 bg-cream-200 rounded-2xl animate-pulse" />
  ),
});

interface FacilitadorData {
  id: string;
  nombre: string;
  email: string;
  telefono: string | null;
  whatsapp: string | null;
  bio: string | null;
  direccion: string | null;
  latitud: number;
  longitud: number;
  instagram: string | null;
  sitio_web: string | null;
  foto_url: string | null;
  actividades: { id: string; nombre: string; slug: string }[];
}

export default function FacilitadorContent({
  params,
}: {
  params: { id: string };
}) {
  const [f, setF] = useState<FacilitadorData | null>(null);
  const [cargando, setCargando] = useState(true);
  const [noExiste, setNoExiste] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("facilitadores")
        .select("*, facilitador_actividades(actividades(id, nombre, slug))")
        .eq("id", params.id)
        .single();

      if (data) {
        setF({
          id: data.id,
          nombre: data.nombre,
          email: data.email,
          telefono: data.telefono,
          whatsapp: data.whatsapp,
          bio: data.bio,
          direccion: data.direccion,
          latitud: data.latitud,
          longitud: data.longitud,
          instagram: data.instagram,
          sitio_web: data.sitio_web,
          foto_url: data.foto_url,
          actividades: (data.facilitador_actividades || []).map((fa: any) => ({
            id: fa.actividades.id,
            nombre: fa.actividades.nombre,
            slug: fa.actividades.slug,
          })),
        });
      } else {
        setNoExiste(true);
      }
      setCargando(false);
    }
    load();
  }, [params.id]);

  if (cargando) {
    return (
      <div className="container-page py-8 max-w-4xl">
        <div className="bg-white/70 rounded-3xl border border-cream-300/60 p-8 animate-pulse">
          <div className="flex gap-6">
            <div className="h-24 w-24 rounded-2xl bg-cream-200" />
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-cream-200 rounded w-1/3" />
              <div className="h-4 bg-cream-200 rounded w-1/4" />
              <div className="h-4 bg-cream-200 rounded w-2/3" />
              <div className="h-4 bg-cream-200 rounded w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (noExiste || !f) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-warmblack/40 text-lg mb-4">
          Facilitador no encontrado
        </p>
        <Link
          href="/facilitadores"
          className="btn-ghost"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al listado
        </Link>
      </div>
    );
  }

  const Icon = getCategoryIcon(f.actividades[0]?.slug || "");
  const color =
    CATEGORY_MARKER_COLORS[f.actividades[0]?.slug || ""] || "#5d8a6e";

  return (
    <div className="container-page py-8 max-w-4xl">
      <Link
        href="/facilitadores"
        className="inline-flex items-center gap-1.5 text-warmblack/40 hover:text-warmblack/70 text-sm mb-8 transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
        Volver
      </Link>

      <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-cream-300/60 overflow-hidden shadow-soft">
        <div className="p-8 md:p-10">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            <div className="flex-shrink-0">
              <div
                className="h-24 w-24 rounded-3xl flex items-center justify-center transition-transform duration-300 hover:scale-105"
                style={{ backgroundColor: `${color}08` }}
              >
                <Icon className="h-10 w-10" style={{ color }} strokeWidth={1.5} />
              </div>
            </div>

            <div className="flex-1">
              <h1 className="font-serif text-3xl md:text-4xl font-medium text-warmblack mb-3">
                {f.nombre}
              </h1>
              <div className="flex flex-wrap gap-2 mb-5">
                {f.actividades.map((a) => (
                  <span key={a.id} className="badge-premium">
                    {a.nombre}
                  </span>
                ))}
              </div>

              {f.bio && (
                <p className="text-body mb-6">{f.bio}</p>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                {f.email && (
                  <a
                    href={`mailto:${f.email}`}
                    className="btn-primary group/btn"
                  >
                    <Mail className="h-4 w-4" />
                    Email
                  </a>
                )}
                {f.whatsapp && (
                  <a
                    href={`https://wa.me/${f.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-sage-500 text-white font-medium text-sm rounded-full hover:bg-sage-600 transition-all duration-300 hover:shadow-glow hover:-translate-y-0.5"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                )}
                {f.instagram && (
                  <a
                    href={`https://instagram.com/${f.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary group/ig"
                  >
                    <InstagramIcon className="h-4 w-4" />
                    Instagram
                  </a>
                )}
                {f.sitio_web && (
                  <a
                    href={f.sitio_web}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Sitio Web
                  </a>
                )}
              </div>
            </div>
          </div>

          {f.direccion && (
            <div className="mt-10 pt-8 divider-subtle">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-warmblack/30" />
                <h2 className="font-medium text-warmblack/70">
                  {f.direccion}
                </h2>
              </div>
              <div className="rounded-2xl overflow-hidden border border-cream-300/60">
                <MiniMapDetail
                  lat={f.latitud}
                  lng={f.longitud}
                  nombre={f.nombre}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
