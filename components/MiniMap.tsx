"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

const defaultPosition: [number, number] = [-38.0055, -57.5426];

function createIcon(): L.DivIcon {
  return new L.DivIcon({
    html: `<div style="background:#15803d;width:24px;height:24px;border-radius:50%;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3)"></div>`,
    className: "",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

export default function MiniMap() {
  const [facilitadores, setFacilitadores] = useState<
    { id: string; nombre: string; lat: number; lng: number; actividad: string }[]
  >([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("facilitadores")
        .select("id, nombre, latitud, longitud, facilitador_actividades(actividades(nombre))")
        .eq("activo", true)
        .limit(8);

      if (data) {
        setFacilitadores(
          data.map((f: any) => ({
            id: f.id,
            nombre: f.nombre,
            lat: f.latitud,
            lng: f.longitud,
            actividad: f.facilitador_actividades?.[0]?.actividades?.nombre || "Holística",
          }))
        );
      }
    }
    load();
  }, []);

  const icon = createIcon();

  return (
    <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200">
      <MapContainer
        center={defaultPosition}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "256px", width: "100%" }}
        dragging={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {facilitadores.map((f) => (
          <Marker key={f.id} position={[f.lat, f.lng]} icon={icon}>
            <Popup>
              <div className="text-center p-1">
                <p className="font-semibold text-sm">{f.nombre}</p>
                <p className="text-xs text-gray-500">{f.actividad}</p>
                <Link href={`/facilitadores/${f.id}`} className="text-xs text-gray-700 hover:underline mt-1 inline-block font-medium">
                  Ver perfil →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
