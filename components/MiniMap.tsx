"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { getEmoji, getMarkerColor } from "@/lib/categories";
import { CITY_COORDS, CITY_NAME } from "@/lib/constants";
import ClusteredMarkers from "@/components/ClusteredMarkers";

const defaultPosition: [number, number] = CITY_COORDS[CITY_NAME] ?? [-38, -57];

export default function MiniMap() {
  const [facilitadores, setFacilitadores] = useState<
    {
      id: string;
      nombre: string;
      lat: number;
      lng: number;
      actividad: string;
      slug: string;
      logo_url: string | null;
    }[]
  >([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("facilitadores")
        .select(
          "id, nombre, latitud, longitud, logo_url, facilitador_actividades(actividades(nombre, slug))"
        )
        .eq("activo", true)
        .limit(8);

      if (data) {
        setFacilitadores(
          data.map((f: any) => ({
            id: f.id,
            nombre: f.nombre,
            lat: f.latitud,
            lng: f.longitud,
            actividad:
              f.facilitador_actividades?.[0]?.actividades?.nombre || "Profesional",
            slug: f.facilitador_actividades?.[0]?.actividades?.slug || "",
            logo_url: f.logo_url || null,
          }))
        );
      }
    }
    load();
  }, []);

  return (
    <div className="rounded-3xl overflow-hidden shadow-medium border border-cream-300/40 h-full">
      <MapContainer
        center={defaultPosition}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        dragging={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClusteredMarkers
          items={facilitadores.map((f) => ({
            id: f.id,
            lat: f.lat,
            lng: f.lng,
            emoji: getEmoji(f.slug),
            nombre: f.nombre,
            color: getMarkerColor(f.slug),
            data: { facilitador: { id: f.id, logo_url: f.logo_url } },
          }))}
          renderPopup={(item) => {
            const f = facilitadores.find((x) => x.id === item.id);
            if (!f) return null;
            return (
              <div className="text-center p-1">
                <p className="font-serif font-medium text-bark text-sm">
                  {f.nombre}
                </p>
                <p className="text-xs text-bark-600 mt-0.5">
                  {f.actividad}
                </p>
                <Link
                  href={`/facilitadores/${f.id}`}
                  className="text-xs text-sage-600 hover:text-sage-700 mt-1.5 inline-block font-medium"
                >
                  Ver perfil
                </Link>
              </div>
            );
          }}
        />
      </MapContainer>
    </div>
  );
}
