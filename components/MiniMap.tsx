"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { getCategoryIcon, CATEGORY_MARKER_COLORS } from "@/lib/categories";

const defaultPosition: [number, number] = [-38.0055, -57.5426];

function createIcon(color: string): L.DivIcon {
  return new L.DivIcon({
    html: `<div style="background:${color};width:20px;height:20px;border-radius:50%;border:2.5px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.15)"></div>`,
    className: "",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

export default function MiniMap() {
  const [facilitadores, setFacilitadores] = useState<
    {
      id: string;
      nombre: string;
      lat: number;
      lng: number;
      actividad: string;
      slug: string;
    }[]
  >([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("facilitadores")
        .select(
          "id, nombre, latitud, longitud, facilitador_actividades(actividades(nombre, slug))"
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
              f.facilitador_actividades?.[0]?.actividades?.nombre || "Holística",
            slug: f.facilitador_actividades?.[0]?.actividades?.slug || "",
          }))
        );
      }
    }
    load();
  }, []);

  return (
    <div className="rounded-3xl overflow-hidden shadow-medium border border-cream-300/40">
      <MapContainer
        center={defaultPosition}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "280px", width: "100%" }}
        dragging={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {facilitadores.map((f) => {
          const color = CATEGORY_MARKER_COLORS[f.slug] || "#5d8a6e";
          return (
            <Marker
              key={f.id}
              position={[f.lat, f.lng]}
              icon={createIcon(color)}
            >
              <Popup>
                <div className="text-center p-1">
                  <p className="font-serif font-medium text-warmblack text-sm">
                    {f.nombre}
                  </p>
                  <p className="text-xs text-warmblack/40 mt-0.5">
                    {f.actividad}
                  </p>
                  <Link
                    href={`/facilitadores/${f.id}`}
                    className="text-xs text-sage-600 hover:text-sage-700 mt-1.5 inline-block font-medium"
                  >
                    Ver perfil
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
