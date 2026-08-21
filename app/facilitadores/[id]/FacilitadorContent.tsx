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
  Share2,
  Navigation,
  Phone,
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
  reel_url: string | null;
  actividades: { id: string; nombre: string; slug: string; categoria_id: string }[];
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
  const [categoriaMap, setCategoriaMap] = useState<Record<string, string>>({});
  const [cargando, setCargando] = useState(true);
  const [noExiste, setNoExiste] = useState(false);
  const track = useClickTracker();

  async function compartirPerfil() {
    const url = `${SITE_URL}/facilitadores/${params.id}`;
    const titulo = `${f?.nombre} | Guía de Bienestar`;
    try {
      if (navigator.share) {
        await navigator.share({ title: titulo, url });
        return;
      }
    } catch {}
    try {
      await navigator.clipboard.writeText(url);
      alert("Enlace copiado al portapapeles");
    } catch {
      prompt("Copiá este enlace:", url);
    }
  }

  useEffect(() => {
    async function load() {
      const esUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.id);

      const query = supabase
        .from("facilitadores")
        .select("*, facilitador_actividades(actividades(id, nombre, slug, categoria_id)), ubicaciones(*)")
        .limit(1);

      const res = esUuid
        ? await query.eq("id", params.id).single()
        : await query.eq("slug", params.id).single();

      const { data } = res;
      const { data: cats } = await supabase.from("categorias").select("id, nombre");

      if (cats) {
        const map: Record<string, string> = {};
        cats.forEach((c: any) => { map[c.id] = c.nombre; });
        setCategoriaMap(map);
      }

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
          reel_url: data.reel_url || null,
          actividades: (data.facilitador_actividades || []).map((fa: any) => ({
            id: fa.actividades.id,
            nombre: fa.actividades.nombre,
            slug: fa.actividades.slug,
            categoria_id: fa.actividades.categoria_id,
          })),
          ubicaciones: (data.ubicaciones || []).map((u: any) => ({
            id: u.id,
            facilitador_id: u.facilitador_id,
            direccion: u.direccion,
            latitud: u.latitud,
            longitud: u.longitud,
            ciudad: u.ciudad,
            descripcion: u.descripcion || null,
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
  const tieneRedes = f.whatsapp || f.telefono || f.instagram || f.email || f.sitio_web;

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: `linear-gradient(180deg, ${color}06 0%, #FAF6EE 30%, #FAF6EE 70%, ${color}04 100%)` }}>
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, ${color} 1px, transparent 1px), radial-gradient(circle at 80% 20%, ${color} 1px, transparent 1px), radial-gradient(circle at 40% 80%, ${color} 1.5px, transparent 1.5px)`,
        backgroundSize: "80px 80px, 100px 100px, 120px 120px",
      }} />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none opacity-30" style={{ backgroundColor: `${color}0D` }} />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sand-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full pointer-events-none opacity-15" style={{ backgroundColor: color }} />
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
          <button
            onClick={compartirPerfil}
            className="inline-flex items-center gap-1.5 text-bark-500 hover:text-bark-700 text-[13px] my-5 ml-4 transition-colors"
            type="button"
          >
            <Share2 className="h-4 w-4" />
            Compartir
          </button>

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
                  {(() => {
                    const grouped: Record<string, typeof f.actividades> = {};
                    f.actividades.forEach((a) => {
                      const cat = categoriaMap[a.categoria_id] || "Otras";
                      if (!grouped[cat]) grouped[cat] = [];
                      grouped[cat].push(a);
                    });
                    return Object.entries(grouped).map(([cat, acts]) => (
                      <span key={cat} className="inline-flex items-center gap-1.5">
                        <span className="text-[10px] font-mono uppercase text-bark-400 dark:text-cream-500 tracking-wider">{cat}</span>
                        {acts.map((a) => (
                          <Link
                            key={a.id}
                            href={`/mapa?q=${encodeURIComponent(a.slug)}`}
                            className="badge hover:bg-sage-100 dark:hover:bg-sage-800/50 transition-colors"
                          >
                            {a.nombre}
                          </Link>
                        ))}
                      </span>
                    ));
                  })()}
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
              {f.telefono && (
                <a
                  href={`tel:${f.telefono.replace(/[^0-9+]/g, "")}`}
                  className="btn-outline text-[13px]"
                  onClick={() => track("telefono", f.id)}
                >
                  <Phone className="h-4 w-4" /> {f.telefono}
                </a>
              )}
              {f.instagram && (
                <a
                  href={`https://instagram.com/${f.instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline text-[13px]"
                  onClick={() => track("instagram", f.id)}
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
                  onClick={() => track("sitio_web", f.id)}
                >
                  <ExternalLink className="h-4 w-4" /> Sitio Web
                </a>
              )}
              {ubiPrincipal?.direccion && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${ubiPrincipal.direccion}, ${ubiPrincipal.ciudad || ""}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline text-[13px]"
                  onClick={() => track("como_llegar", f.id)}
                >
                  <Navigation className="h-4 w-4" /> Cómo llegar
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
            <h2 className="font-serif text-lg font-medium text-bark mb-3">Sobre el profesional</h2>
            <p className="text-bark-700 leading-relaxed">{f.bio}</p>
          </div>
        )}

        {/* Horarios */}
        {f.horarios && (
          <div className="bg-white rounded-2xl border border-cream-200/80 shadow-sm p-6 sm:p-8">
            <h2 className="font-serif text-lg font-medium text-bark mb-3 flex items-center gap-2">
              <Clock className="h-5 w-5" style={{ color }} />
              Horarios
            </h2>
            <p className="text-bark-700 leading-relaxed">{f.horarios}</p>
          </div>
        )}

        {/* Contenido destacado */}
        {f.reel_url && (
          <div className="bg-white rounded-2xl border border-cream-200/80 shadow-sm overflow-hidden">
            <div className="p-5 sm:p-6">
              <h2 className="font-serif text-lg font-medium text-bark mb-3 flex items-center gap-2">
                📹 Contenido destacado
              </h2>
              <div className="rounded-xl overflow-hidden" style={{ maxWidth: 400, margin: "0 auto" }}>
                <iframe
                  src={f.reel_url}
                  width="100%"
                  height="480"
                  style={{ border: "none", overflow: "hidden" }}
                  scrolling="no"
                  allowTransparency
                  allow="encrypted-media"
                  title="Contenido de Instagram"
                />
              </div>
            </div>
          </div>
        )}

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
                        {u.descripcion && (
                          <p className="text-sm text-bark-600 mt-1.5 leading-relaxed">{u.descripcion}</p>
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
            ¿Sos profesional? Sumá tu perfil
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
