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

function createEmojiIcon(emoji: string, isSelected: boolean): L.DivIcon {
  const size = isSelected ? 44 : 36;
  const fontSize = isSelected ? "22px" : "18px";
  const shadow = isSelected
    ? "0 4px 16px rgba(0,0,0,0.25), 0 0 0 3px rgba(90,143,143,0.25)"
    : "0 2px 8px rgba(0,0,0,0.12)";

  return new L.DivIcon({
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      background: #fff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: ${fontSize};
      box-shadow: ${shadow};
      border: 2px solid white;
      line-height: 1;
      cursor: pointer;
      transition: all 0.2s ease;
    ">${emoji}</div>`,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2)],
  });
}

function createClusterIcon(count: number, emoji: string): L.DivIcon {
  const size = 40;
  return new L.DivIcon({
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      background: #fff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 19px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.18);
      border: 2px solid white;
      line-height: 1;
      cursor: pointer;
      position: relative;
    ">${emoji}<span style="
      position: absolute;
      top: -6px;
      right: -6px;
      background: #B5654F;
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      font-family: ui-sans-serif, system-ui, sans-serif;
      min-width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #fff;
      padding: 0 3px;
    ">${count}</span></div>`,
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
          const icon = createEmojiIcon(item.emoji, isSelected);
          return (
            <Marker
              key={item.id}
              position={[item.lat, item.lng]}
              icon={icon}
              opacity={dimOthers && selectedId && !isSelected ? 0.35 : 1}
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

        const icon = createClusterIcon(g.items.length, g.items[0].emoji);
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
