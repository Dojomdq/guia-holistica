"use client";

import { useState, useEffect } from "react";
import { Home, MessageCircle, ArrowRight, MapPin, Phone } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { WHATSAPP_LINK } from "@/lib/constants";
import { CATEGORY_MARKER_COLORS } from "@/lib/categories";
import { useScrollReveal } from "@/lib/useScrollReveal";
import Breadcrumbs from "@/components/Breadcrumbs";

interface Espacio {
  id: string;
  nombre: string;
  descripcion: string | null;
  whatsapp: string | null;
  telefono: string | null;
  direccion: string | null;
  ciudad: string | null;
}

export default function AlquilerEspaciosContent() {
  const [espacios, setEspacios] = useState<Espacio[]>([]);
  const [cargando, setCargando] = useState(true);
  const { ref, isVisible } = useScrollReveal();

  const markerColor = CATEGORY_MARKER_COLORS["alquiler-espacios"] || "#b45309";

  useEffect(() => {
    async function load() {
      const { data: actividad } = await supabase
        .from("actividades")
        .select("id")
        .eq("slug", "salones-generales")
        .single();

      if (!actividad) {
        setCargando(false);
        return;
      }

      const { data: links } = await supabase
        .from("facilitador_actividades")
        .select("facilitador_id")
        .eq("actividad_id", actividad.id);

      const ids = (links || []).map((l) => l.facilitador_id);

      if (ids.length === 0) {
        setCargando(false);
        return;
      }

      const { data: facilitadores } = await supabase
        .from("facilitadores")
        .select("id, nombre, bio, whatsapp, telefono, direccion, ciudad")
        .in("id", ids)
        .eq("activo", true)
        .order("nombre");

      setEspacios(
        (facilitadores || []).map((f) => ({
          id: f.id,
          nombre: f.nombre,
          descripcion: f.bio,
          whatsapp: f.whatsapp,
          telefono: f.telefono,
          direccion: f.direccion,
          ciudad: f.ciudad,
        }))
      );
      setCargando(false);
    }
    load();
  }, []);

  const linkContacto = (e: Espacio) => {
    if (e.whatsapp) {
      return `https://wa.me/${e.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
        "Hola, vi tu espacio en la Guía de Bienestar y quiero consultar disponibilidad."
      )}`;
    }
    return `${WHATSAPP_LINK}?text=${encodeURIComponent(
      `Hola, quiero consultar por el espacio "${e.nombre}" de la Guía de Bienestar.`
    )}`;
  };

  return (
    <div className="bg-gradient-to-b from-cream-50 via-sage-50/20 to-cream-50 min-h-screen">
      <div className="container-page py-16 sm:py-20 lg:py-24">
        <Breadcrumbs items={[{ label: "Alquiler de espacios" }]} />

        <div
          ref={ref}
          className={`max-w-2xl mb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <span className="label">Espacios</span>
          <h1 className="heading-lg text-bark mt-4">Alquiler de espacios</h1>
          <p className="text-lg text-bark-700 mt-4 max-w-lg leading-relaxed">
            Salones disponibles para tu actividad, evento o práctica. Consultá
            disponibilidad directo con el responsable.
          </p>
        </div>

        {cargando ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-cream-200 animate-pulse h-48"
              />
            ))}
          </div>
        ) : espacios.length === 0 ? (
          <div className="text-center py-16 text-bark-500">
            <Home className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Todavía no hay salones publicados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {espacios.map((e, i) => (
              <div
                key={e.id}
                className={`card flex flex-col ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${markerColor}12` }}
                  >
                    <Home
                      className="h-5 w-5"
                      style={{ color: markerColor }}
                      strokeWidth={1.5}
                    />
                  </div>
                  {e.ciudad && (
                    <span className="text-[11px] text-bark-400 font-mono flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {e.ciudad}
                    </span>
                  )}
                </div>

                <h2 className="font-serif text-lg font-medium text-bark">
                  {e.nombre}
                </h2>

                {e.descripcion && (
                  <p className="text-sm text-bark-600 leading-relaxed mt-2 whitespace-pre-line">
                    {e.descripcion}
                  </p>
                )}

                {e.telefono && (
                  <p className="text-sm text-bark-600 mt-2 flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-sage-600" />
                    {e.telefono}
                  </p>
                )}

                <a
                  href={linkContacto(e)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-sage w-full mt-5 text-[13px] px-4 py-2.5"
                >
                  <MessageCircle className="h-4 w-4" />
                  Consultar disponibilidad
                </a>
              </div>
            ))}
          </div>
        )}

        <div
          className={`mt-14 card flex flex-col sm:flex-row items-start sm:items-center gap-6 p-8 sm:p-10 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="flex-1">
            <h2 className="font-serif text-xl font-medium text-bark flex items-center gap-2">
              <Home className="h-5 w-5 text-sage-600" />
              ¿Tenés un espacio para alquilar?
            </h2>
            <p className="text-bark-600 mt-2 leading-relaxed">
              Publicá tu salón en la Guía de Bienestar y llegá a más personas
              que buscan un espacio como el tuyo.
            </p>
          </div>
          <a
            href={`${WHATSAPP_LINK}?text=${encodeURIComponent(
              "Hola, quiero publicar mi espacio en alquiler en la Guía de Bienestar."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary shrink-0 text-[13px] px-5 py-2.5"
          >
            Publicar mi espacio
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
