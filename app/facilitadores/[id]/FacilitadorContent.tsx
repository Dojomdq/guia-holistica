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
  Clock,
  Sparkles,
} from "lucide-react";
import InstagramIcon from "@/components/ui/InstagramIcon";
import { supabase } from "@/lib/supabase/client";
import { getCategoryIcon, CATEGORY_MARKER_COLORS } from "@/lib/categories";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE_URL, CITY_NAME, WHATSAPP_LINK } from "@/lib/constants";
import { useClickTracker } from "@/lib/useClickTracker";
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
  horarios: string | null;
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
  const track = useClickTracker();

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
          horarios: data.horarios || null,
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
            Profesional no encontrado
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
  const color = CATEGORY_MARKER_COLORS[f.actividades[0]?.slug || ""] || "#5d8a6e";
  const ubiPrincipal = f.ubicaciones[0];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-cream-50 via-white to-cream-50">
      <div className="absolute top-0 right-0 w-96 h-96 bg-sage-200/15 rounded-full blur-3xl pointer-events-none -translate-y-1/4 translate-x-1/4" />
      <div className="absolute bottom-1/3 left-0 w-80 h-80 bg-sand-200/20 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/4" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-sage-200/5 pointer-events-none" />
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
            "@type": "ProfessionalService",
            name: f.nombre,
            description: f.bio,
            url: `${SITE_URL}/facilitadores/${f.id}`,
            ...(f.foto_url && { image: f.foto_url }),
            telephone: f.whatsapp || f.telefono || undefined,
            email: f.email,
            knowsAbout: f.actividades.map((a) => a.nombre),
            areaServed: {
              "@type": "City",
              name: ubiPrincipal?.ciudad || CITY_NAME,
            },
            ...(ubiPrincipal?.latitud !== undefined && {
              geo: {
                "@type": "GeoCoordinates",
                latitude: ubiPrincipal.latitud,
                longitude: ubiPrincipal.longitud,
              },
            }),
            ...(ubiPrincipal?.direccion && {
              address: {
                "@type": "PostalAddress",
                streetAddress: ubiPrincipal.direccion,
                addressLocality: ubiPrincipal.ciudad || CITY_NAME,
                addressCountry: "AR",
              },
            }),
            ...(f.instagram && { sameAs: [`https://instagram.com/${f.instagram.replace("@", "")}`] }),
          }),
        }}
      />

      <div className="container-page max-w-3xl py-10 sm:py-14">
        <Breadcrumbs items={[
          { label: "Facilitadores", href: "/facilitadores" },
          { label: f.nombre },
        ]} />
        <Link
          href="/facilitadores"
          className="inline-flex items-center gap-1.5 text-bark-500 hover:text-bark-700 text-[13px] my-5 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
          Volver
        </Link>

        <div className="bg-white rounded-2xl border border-cream-200/80 shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-5 sm:gap-6">
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${color}12` }}
              >
                <Icon className="h-8 w-8 sm:h-9 sm:w-9" style={{ color }} strokeWidth={1.5} />
              </div>

              <div className="flex-1">
                <h1 className="font-serif text-2xl sm:text-3xl font-medium text-bark mb-2">
                  {f.nombre}
                </h1>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {f.actividades.map((a) => (
                    <span key={a.id} className="badge">{a.nombre}</span>
                  ))}
                </div>

                {f.bio && (
                  <p className="text-bark-700 leading-relaxed mb-5">{f.bio}</p>
                )}

                <div className="flex flex-wrap gap-2.5">
                  {f.whatsapp && (
                    <a
                      href={`https://wa.me/${f.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hola, te contacto desde la Guía de Bienestar")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-sage text-[13px]"
                      onClick={() => track("whatsapp", f.id)}
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
                  {f.email && (
                    <a
                      href={`mailto:${f.email}`}
                      className="btn-outline text-[13px]"
                    >
                      <Mail className="h-4 w-4" />
                      Email
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

            <div className="mt-8 pt-6 border-t border-cream-200/60">
              <h2 className="font-serif text-lg font-medium text-bark mb-3 flex items-center gap-2">
                <Clock className="h-5 w-5 text-sage-600" />
                Horarios y disponibilidad
              </h2>
              {f.horarios ? (
                <p className="text-bark-700 leading-relaxed">{f.horarios}</p>
              ) : f.whatsapp ? (
                <div className="bg-sage-50 rounded-xl p-4 border border-sage-100">
                  <p className="text-sm text-bark-600 mb-3">
                    Consultá disponibilidad y turnos directamente por WhatsApp.
                  </p>
                  <a
                    href={`https://wa.me/${f.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hola, quisiera consultar disponibilidad y turnos")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-sage-600 text-white rounded-full text-sm font-medium hover:bg-sage-700 transition-colors"
                    onClick={() => track("whatsapp", f.id)}
                  >
                    <MessageCircle className="h-4 w-4" />
                    Consultar por WhatsApp
                  </a>
                </div>
              ) : (
                <p className="text-sm text-bark-500">Atiende por turnos. Consultá disponibilidad por sus redes.</p>
              )}
            </div>

            {f.ubicaciones.length > 0 && (
              <div className="mt-8 pt-8 border-t border-cream-200/60">
                <h2 className="font-serif text-lg font-medium text-bark mb-5 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-sage-600" />
                  {f.ubicaciones.length > 1 ? "Ubicaciones" : "Ubicación"}
                </h2>

                <div className="space-y-5">
                  {f.ubicaciones.map((u, i) => (
                    <div key={u.id}>
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                          style={{ backgroundColor: `${color}10` }}>
                          <MapPin className="h-4 w-4" style={{ color }} />
                        </div>
                        <div>
                          {f.ubicaciones.length > 1 && (
                            <p className="text-[11px] font-mono font-medium tracking-[0.1em] uppercase text-bark-500 mb-0.5">
                              Sede {i + 1}
                            </p>
                          )}
                          <p className="text-bark font-medium">
                            {u.direccion || "Consultar dirección"}
                          </p>
                          {u.ciudad && (
                            <p className="text-sm text-bark-500 mt-0.5">{u.ciudad}</p>
                          )}
                        </div>
                      </div>

                      {u.latitud && u.longitud && (
                        <div className="rounded-xl overflow-hidden border border-cream-200 shadow-sm">
                          <MiniMapDetail
                            lat={u.latitud}
                            lng={u.longitud}
                            nombre={f.nombre}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-10 pt-8 border-t border-cream-200/60 text-center">
              <p className="text-sm text-bark-500 mb-4">
                ¿Querés sumar tu perfil como {f.nombre}?
              </p>
              <a
                href={`${WHATSAPP_LINK}?text=Hola%20quiero%20sumar%20mi%20perfil%20a%20la%20Gu%C3%ADa%20de%20Bienestar`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-sage-600 text-white rounded-full text-sm font-medium hover:bg-terracotta-600 transition-colors"
              >
                <Sparkles className="h-4 w-4" />
                Sumá tu perfil
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
