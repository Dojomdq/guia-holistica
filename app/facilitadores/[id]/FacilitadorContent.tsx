"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  MapPin,
  ExternalLink,
  ArrowLeft,
  MessageCircle,
  Mail,
  Clock,
  Sparkles,
  User,
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
    <div className="h-52 bg-cream-200 rounded-2xl animate-pulse" />
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

function getIniciales(nombre: string): string {
  return nombre
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
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
          <div className="animate-pulse space-y-6">
            <div className="h-64 bg-white rounded-2xl border border-cream-200" />
            <div className="h-40 bg-white rounded-2xl border border-cream-200" />
            <div className="h-56 bg-white rounded-2xl border border-cream-200" />
          </div>
        </div>
      </div>
    );
  }

  if (noExiste || !f) {
    return (
      <div className="section-pad">
        <div className="container-page text-center max-w-3xl">
          <p className="text-bark-500 text-body-lg mb-6">Profesional no encontrado</p>
          <Link href="/facilitadores" className="btn-ghost">
            <ArrowLeft className="h-4 w-4" /> Volver al listado
          </Link>
        </div>
      </div>
    );
  }

  const Icon = getCategoryIcon(f.actividades[0]?.slug || "");
  const color = CATEGORY_MARKER_COLORS[f.actividades[0]?.slug || ""] || "#5d8a6e";
  const ubiPrincipal = f.ubicaciones[0];
  const iniciales = getIniciales(f.nombre);
  const tieneRedes = f.whatsapp || f.instagram || f.email || f.sitio_web;

  return (
    <div className="min-h-screen bg-cream-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none opacity-40" style={{ backgroundColor: `${color}10` }} />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-sand-200/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-4 h-4 rounded-full pointer-events-none opacity-10" style={{ backgroundColor: color }} />
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
            areaServed: { "@type": "City", name: ubiPrincipal?.ciudad || CITY_NAME },
            ...(ubiPrincipal?.latitud !== undefined && {
              geo: { "@type": "GeoCoordinates", latitude: ubiPrincipal.latitud, longitude: ubiPrincipal.longitud },
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

      {/* Header profile card */}
      <div className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${color}08 0%, ${color}03 50%, #FAF6EE 100%)` }}>
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-2xl pointer-events-none opacity-30" style={{ backgroundColor: `${color}20` }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-2 rounded-full pointer-events-none opacity-10" style={{ backgroundColor: color }} />

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

          <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-6">
            {f.foto_url ? (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden ring-4 ring-white shadow-lg shrink-0">
                <Image
                  src={f.foto_url}
                  alt={f.nombre}
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl flex items-center justify-center ring-4 ring-white shadow-lg shrink-0"
                style={{ backgroundColor: `${color}18` }}
              >
                <User className="h-12 w-12 sm:h-14 sm:w-14" style={{ color }} strokeWidth={1.5} />
              </div>
            )}

            <div className="flex-1 pt-1">
              <h1 className="font-serif text-2xl sm:text-3xl font-medium text-bark mb-2">
                {f.nombre}
              </h1>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {f.actividades.map((a) => (
                  <span key={a.id} className="badge">{a.nombre}</span>
                ))}
              </div>
              {ubiPrincipal?.direccion && (
                <p className="flex items-center gap-1.5 text-sm text-bark-600">
                  <MapPin className="h-4 w-4 text-sage-500 shrink-0" />
                  {ubiPrincipal.direccion}
                  {ubiPrincipal.ciudad && <span className="text-bark-400">· {ubiPrincipal.ciudad}</span>}
                </p>
              )}
            </div>
          </div>

          {tieneRedes && (
            <div className="flex flex-wrap gap-2.5 mt-6">
              {f.whatsapp && (
                <a
                  href={`https://wa.me/${f.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hola, te contacto desde la Guía de Bienestar")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-sage text-[13px]"
                  onClick={() => track("whatsapp", f.id)}
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              )}
              {f.instagram && (
                <a
                  href={`https://instagram.com/${f.instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline text-[13px]"
                >
                  <InstagramIcon className="h-4 w-4" /> Instagram
                </a>
              )}
              {f.email && (
                <a href={`mailto:${f.email}`} className="btn-outline text-[13px]">
                  <Mail className="h-4 w-4" /> Email
                </a>
              )}
              {f.sitio_web && (
                <a
                  href={f.sitio_web}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline text-[13px]"
                >
                  <ExternalLink className="h-4 w-4" /> Sitio Web
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="container-page max-w-3xl py-8 sm:py-12 space-y-6">
        {/* Bio */}
        {f.bio && (
          <div className="bg-white rounded-2xl border border-cream-200/80 shadow-sm p-6 sm:p-8">
            <h2 className="font-serif text-lg font-medium text-bark mb-3">Sobre mí</h2>
            <p className="text-bark-700 leading-relaxed">{f.bio}</p>
          </div>
        )}

        {/* Horarios */}
        <div className="bg-white rounded-2xl border border-cream-200/80 shadow-sm p-6 sm:p-8">
          <h2 className="font-serif text-lg font-medium text-bark mb-3 flex items-center gap-2">
            <Clock className="h-5 w-5" style={{ color }} />
            Horarios y disponibilidad
          </h2>
          {f.horarios ? (
            <p className="text-bark-700 leading-relaxed">{f.horarios}</p>
          ) : f.whatsapp ? (
            <div className="rounded-xl p-5 border text-center" style={{ backgroundColor: `${color}06`, borderColor: `${color}18` }}>
              <p className="text-sm text-bark-600 mb-4">
                Consultá disponibilidad y turnos directamente por WhatsApp.
              </p>
              <a
                href={`https://wa.me/${f.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hola, quisiera consultar disponibilidad y turnos")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-white rounded-full text-sm font-medium transition-colors"
                style={{ backgroundColor: color }}
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

        {/* Ubicaciones */}
        {f.ubicaciones.length > 0 && (
          <div className="bg-white rounded-2xl border border-cream-200/80 shadow-sm overflow-hidden">
            <div className="p-6 sm:p-8">
              <h2 className="font-serif text-lg font-medium text-bark mb-5 flex items-center gap-2">
                <MapPin className="h-5 w-5" style={{ color }} />
                {f.ubicaciones.length > 1 ? "Ubicaciones" : "Ubicación"}
              </h2>

              <div className="space-y-6">
                {f.ubicaciones.map((u, i) => (
                  <div key={u.id}>
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: `${color}10` }}>
                        <MapPin className="h-4 w-4" style={{ color }} />
                      </div>
                      <div>
                        {f.ubicaciones.length > 1 && (
                          <p className="text-[10px] font-mono font-medium tracking-[0.1em] uppercase text-bark-400 mb-0.5">
                            Sede {i + 1}
                          </p>
                        )}
                        <p className="text-bark font-medium">{u.direccion || "Consultar dirección"}</p>
                        {u.ciudad && (
                          <p className="text-sm text-bark-500 mt-0.5">{u.ciudad}</p>
                        )}
                      </div>
                    </div>

                    {u.latitud && u.longitud && (
                      <div className="rounded-2xl overflow-hidden border border-cream-200 shadow-sm">
                        <MiniMapDetail lat={u.latitud} lng={u.longitud} nombre={f.nombre} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center py-6">
          <p className="text-sm text-bark-400 mb-3">
            ¿Sos profesional? Sumá tu perfil gratis
          </p>
          <a
            href={`${WHATSAPP_LINK}?text=Hola%20quiero%20sumar%20mi%20perfil%20a%20la%20Gu%C3%ADa%20de%20Bienestar`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-bark text-white rounded-full text-sm font-medium hover:bg-bark/85 transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            Sumá tu perfil
          </a>
        </div>
      </div>
    </div>
  );
}
