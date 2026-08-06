"use client";

import { useEffect, useMemo, useState } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

export interface ClusterMarkerItem {
  id: string;
  lat: number;
  lng: number;
  emoji: string;
  nombre: string;
  color: string;
  data?: unknown;
}

interface ClusterGroup {
  items: ClusterMarkerItem[];
  centroid: { lat: number; lng: number };
}

interface Props {
  items: ClusterMarkerItem[];
  threshold?: number;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  renderPopup?: (item: ClusterMarkerItem) => React.ReactNode;
  dimOthers?: boolean;
}

function createDotIcon(color: string, isSelected: boolean): L.DivIcon {
  const size = isSelected ? 28 : 20;
  const borderWidth = isSelected ? 3 : 2;
  const shadow = isSelected
    ? "0 3px 12px rgba(0,0,0,0.30), 0 0 0 4px rgba(255,255,255,0.90)"
    : "0 1.5px 6px rgba(0,0,0,0.20), 0 0 0 2.5px rgba(255,255,255,0.85)";

  return new L.DivIcon({
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: 50%;
      box-shadow: ${shadow};
      cursor: pointer;
      transition: all 0.2s ease;
      box-sizing: border-box;
    "></div>`,
    className: "",
    iconSize: [size + borderWidth * 2, size + borderWidth * 2],
    iconAnchor: [size / 2 + borderWidth, size / 2 + borderWidth],
    popupAnchor: [0, -(size / 2 + borderWidth)],
  });
}

function createClusterIcon(color: string): L.DivIcon {
  const size = 32;
  return new L.DivIcon({
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.28), 0 0 0 3px rgba(255,255,255,0.85);
      cursor: pointer;
    "></div>`,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function clusterItems(
  items: ClusterMarkerItem[],
  map: L.Map,
  threshold: number
): ClusterGroup[] {
  const pts = items.map((it) => {
    const pt = map.latLngToLayerPoint([it.lat, it.lng]);
    return { it, x: pt.x, y: pt.y };
  });

  const groups: {
    items: ClusterMarkerItem[];
    cx: number;
    cy: number;
  }[] = [];

  for (const p of pts) {
    let best: (typeof groups)[number] | null = null;
    let bestDist = Infinity;
    for (const g of groups) {
      const d = Math.hypot(p.x - g.cx, p.y - g.cy);
      if (d < bestDist) {
        bestDist = d;
        best = g;
      }
    }
    if (best && bestDist < threshold) {
      best.items.push(p.it);
      const n = best.items.length;
      best.cx = (best.cx * (n - 1) + p.x) / n;
      best.cy = (best.cy * (n - 1) + p.y) / n;
    } else {
      groups.push({ items: [p.it], cx: p.x, cy: p.y });
    }
  }

  return groups.map((g) => {
    const center = map.layerPointToLatLng(L.point(g.cx, g.cy));
    return {
      items: g.items,
      centroid: { lat: center.lat, lng: center.lng },
    };
  });
}

export default function ClusteredMarkers({
  items,
  threshold = 42,
  selectedId,
  onSelect,
  renderPopup,
  dimOthers,
}: Props) {
  const map = useMap();
  const [zoom, setZoom] = useState(() => map.getZoom());

  useEffect(() => {
    const update = () => setZoom(map.getZoom());
    map.on("zoomend", update);
    map.on("moveend", update);
    return () => {
      map.off("zoomend", update);
      map.off("moveend", update);
    };
  }, [map]);

  const groups = useMemo(
    () => clusterItems(items, map, threshold),
    [items, map, threshold, zoom]
  );

  return (
    <>
      {groups.map((g) => {
        if (g.items.length === 1) {
          const item = g.items[0];
          const isSelected = selectedId === item.id;
          const icon = createDotIcon(item.color, isSelected);
          return (
            <Marker
              key={item.id}
              position={[item.lat, item.lng]}
              icon={icon}
              opacity={dimOthers && selectedId && !isSelected ? 0.3 : 1}
              eventHandlers={{ click: () => onSelect?.(item.id) }}
            >
              {renderPopup && (
                <Popup closeButton autoPan={false}>
                  {renderPopup(item)}
                </Popup>
              )}
            </Marker>
          );
        }

        const icon = createClusterIcon(g.items[0].color);
        return (
          <Marker
            key={g.items.map((i) => i.id).join("|")}
            position={[g.centroid.lat, g.centroid.lng]}
            icon={icon}
            eventHandlers={{
              click: () =>
                map.flyTo(
                  [g.centroid.lat, g.centroid.lng],
                  Math.min(map.getZoom() + 1, 18)
                ),
            }}
          />
        );
      })}
    </>
  );
}
