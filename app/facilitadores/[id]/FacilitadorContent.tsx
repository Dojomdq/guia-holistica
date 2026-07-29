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
import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE_URL } from "@/lib/constants";
import type { Ubicacion } from "@/lib/types";

const MiniMapDetail = dynamic(() => import("@/components/MiniMapDetail"), {
  ssr: false,
  loading: () => (
    <div className="h-56 bg-cream-200 rounded-xl animate-pulse" />
  ),
});

interface FacilitadorData {
  id: string;
  nombre: string;
  email: string;
  telefono: string | null;
  whatsapp: string | null;
  bio: string | null;
  instagram: string | null;
  sitio_web: string | null;
  foto_url: string | null;
  actividades: { id: string; nombre: string; slug: string }[];
  ubicaciones: Ubicacion[];
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
        .select("*, facilitador_actividades(actividades(id, nombre, slug)), ubicaciones(*)")
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
          instagram: data.instagram,
          sitio_web: data.sitio_web,
          foto_url: data.foto_url,
          actividades: (data.facilitador_actividades || []).map((fa: any) => ({
            id: fa.actividades.id,
            nombre: fa.actividades.nombre,
            slug: fa.actividades.slug,
          })),
          ubicaciones: (data.ubicaciones || []).map((u: any) => ({
            id: u.id,
            facilitador_id: u.facilitador_id,
            direccion: u.direccion,
            latitud: u.latitud,
            longitud: u.longitud,
            ciudad: u.ciudad,
            created_at: u.created_at,
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
      <div className="section-pad">
        <div className="container-page max-w-3xl">
          <div className="bg-white rounded-2xl border border-cream-200 p-8 animate-pulse">
            <div className="flex gap-6">
              <div className="h-20 w-20 rounded-xl bg-cream-200 shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-cream-200 rounded w-1/3" />
                <div className="h-3 bg-cream-200 rounded w-1/4" />
                <div className="h-3 bg-cream-200 rounded w-2/3" />
                <div className="h-3 bg-cream-200 rounded w-1/2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (noExiste || !f) {
    return (
      <div className="section-pad">
        <div className="container-page text-center max-w-3xl">
          <p className="text-bark-500 text-body-lg mb-6">
            Facilitador no encontrado
          </p>
          <Link href="/facilitadores" className="btn-ghost">
            <ArrowLeft className="h-4 w-4" />
            Volver al listado
          </Link>
        </div>
      </div>
    );
  }

  const Icon = getCategoryIcon(f.actividades[0]?.slug || "");
  const color =
    CATEGORY_MARKER_COLORS[f.actividades[0]?.slug || ""] || "#5d8a6e";

  return (
    <div className="section-pad">
      <div className="container-page max-w-3xl">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
                { "@type": "ListItem", position: 2, name: "Facilitadores", item: `${SITE_URL}/facilitadores` },
                { "@type": "ListItem", position: 3, name: f.nombre },
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: f.nombre,
              description: f.bio,
              email: f.email,
              url: `${SITE_URL}/facilitadores/${f.id}`,
              ...(f.instagram && { sameAs: [`https://instagram.com/${f.instagram.replace("@", "")}`] }),
              ...(f.sitio_web && { url: f.sitio_web }),
            }),
          }}
        />
        <Breadcrumbs items={[
          { label: "Facilitadores", href: "/facilitadores" },
          { label: f.nombre },
        ]} />
        <Link
          href="/facilitadores"
          className="inline-flex items-center gap-1.5 text-bark-500 hover:text-bark-700 text-[13px] mb-8 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
          Volver
        </Link>

        <div className="bg-white rounded-2xl border border-cream-200 overflow-hidden shadow-soft">
          <div className="p-7 md:p-10">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              <div className="flex-shrink-0">
                <div
                  className="h-20 w-20 rounded-2xl flex items-center justify-center transition-transform duration-300 hover:scale-105"
                  style={{ backgroundColor: `${color}0A` }}
                >
                  <Icon className="h-9 w-9" style={{ color }} strokeWidth={1.5} />
                </div>
              </div>

              <div className="flex-1">
                <h1 className="heading-md text-bark mb-3">
                  {f.nombre}
                </h1>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {f.actividades.map((a) => (
                    <span key={a.id} className="badge">
                      {a.nombre}
                    </span>
                  ))}
                </div>

                {f.bio && (
                  <p className="body-lg mb-6">{f.bio}</p>
                )}

                <div className="flex flex-wrap gap-2.5">
                  {f.email && (
                    <a
                      href={`mailto:${f.email}`}
                      className="btn-dark text-[13px]"
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
                      className="btn-sage text-[13px]"
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
                      className="btn-outline text-[13px]"
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
                      className="btn-outline text-[13px]"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Sitio Web
                    </a>
                  )}
                </div>
              </div>
            </div>

            {f.ubicaciones && f.ubicaciones.length > 0 && (
              <div className="mt-10 pt-8 divider">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-4 w-4 text-bark-400" />
                  <h2 className="text-[15px] font-medium text-bark-700">
                    {f.ubicaciones.length > 1 ? "Ubicaciones" : "Ubicación"}
                  </h2>
                </div>
                <div className="space-y-4">
                  {f.ubicaciones.map((u, i) => (
                    <div key={u.id}>
                      {f.ubicaciones.length > 1 && (
                        <p className="text-[13px] font-medium text-bark-600 mb-2 flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-bark-300" />
                          {u.direccion || `Ubicación ${i + 1}`}
                        </p>
                      )}
                      <div className="rounded-xl overflow-hidden border border-cream-200">
                        <MiniMapDetail
                          lat={u.latitud}
                          lng={u.longitud}
                          nombre={f.nombre}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
