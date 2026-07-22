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
import type { FacilitadorConActividades } from "@/lib/types";

const MiniMapDetail = dynamic(() => import("@/components/MiniMapDetail"), {
  ssr: false,
  loading: () => <div className="h-48 bg-stone-100 rounded-xl animate-pulse" />,
});

const CAT_ICOS: Record<string, string> = {
  chamanismo: "🪶", yoga: "🧘", reiki: "✋", meditacion: "🕯️",
  tarot: "🔮", astrologia: "⭐", "sanacion-energetica": "💫",
  "terapias-holisticas": "🌿", "circulos-de-mujeres": "🌙",
  "cacao-ceremonia": "🍫", "flores-de-bach": "🌸",
  "sonidos-y-vibraciones": "🔔", aromaterapia: "🫧",
  numerologia: "🔢", pranoterapia: "🌬️",
  "limpieza-energetica": "✨", "plantas-medicinales": "🍃",
  "masajes-terapeuticos": "💆",
};

function getIcon(slug: string): string {
  for (const [key, icon] of Object.entries(CAT_ICOS)) {
    if (slug.includes(key)) return icon;
  }
  return "🌿";
}

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
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8 animate-pulse">
          <div className="flex gap-6">
            <div className="h-24 w-24 rounded-2xl bg-stone-100" />
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-stone-100 rounded w-1/3" />
              <div className="h-4 bg-stone-100 rounded w-1/4" />
              <div className="h-4 bg-stone-100 rounded w-2/3" />
              <div className="h-4 bg-stone-100 rounded w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (noExiste || !f) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-stone-500 text-lg mb-4">Facilitador no encontrado</p>
        <Link href="/facilitadores" className="text-primary-600 hover:underline font-medium">
          ← Volver al listado
        </Link>
      </div>
    );
  }

  const icono = f.actividades[0] ? getIcon(f.actividades[0].slug) : "🌿";

  return (
    <div className="container-page py-8 max-w-4xl">
      <Link
        href="/facilitadores"
        className="inline-flex items-center gap-1 text-stone-500 hover:text-stone-700 text-sm mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="h-24 w-24 rounded-2xl bg-primary-50 flex items-center justify-center text-4xl">
                {icono}
              </div>
            </div>

            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-stone-800 mb-2">
                {f.nombre}
              </h1>
              <div className="flex flex-wrap gap-2 mb-4">
                {f.actividades.map((a) => (
                  <span key={a.id} className="px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full font-medium">
                    {a.nombre}
                  </span>
                ))}
              </div>

              {f.bio && <p className="text-stone-600 leading-relaxed mb-4">{f.bio}</p>}

              <div className="flex flex-col sm:flex-row gap-3">
                {f.email && (
                  <a
                    href={`mailto:${f.email}`}
                    className="inline-flex items-center gap-2 bg-stone-800 text-white px-5 py-2.5 rounded-xl hover:bg-stone-900 transition-colors font-medium text-sm"
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
                    className="inline-flex items-center gap-2 bg-green-500 text-white px-5 py-2.5 rounded-xl hover:bg-green-600 transition-colors font-medium text-sm"
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
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity font-medium text-sm"
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
                    className="inline-flex items-center gap-2 bg-stone-100 text-stone-700 px-5 py-2.5 rounded-xl hover:bg-stone-200 transition-colors font-medium text-sm"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Sitio Web
                  </a>
                )}
              </div>
            </div>
          </div>

          {f.direccion && (
            <div className="mt-8 pt-6 border-t border-stone-100">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-5 w-5 text-stone-400" />
                <h2 className="font-semibold text-stone-700">{f.direccion}</h2>
              </div>
              <div className="rounded-xl overflow-hidden border border-stone-200">
                <MiniMapDetail lat={f.latitud} lng={f.longitud} nombre={f.nombre} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
