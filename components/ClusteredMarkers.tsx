"use client";

import { useMemo } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

export interface ClusterMarkerItem {
  id: string;
  lat: number;
  lng: number;
  emoji: string;
  nombre: string;
  color: string;
  iconSvg: string;
  data?: unknown;
}

interface Props {
  items: ClusterMarkerItem[];
  selectedId?: string | null;
  selectedFacilitadorId?: string | null;
  onSelect?: (id: string) => void;
  renderPopup?: (item: ClusterMarkerItem) => React.ReactNode;
  dimOthers?: boolean;
}

function createActivityIcon(
  color: string,
  iconSvg: string,
  isSelected: boolean
): L.DivIcon {
  const size = isSelected ? 44 : 36;
  const shadow = isSelected
    ? `0 4px 14px rgba(0,0,0,0.30), 0 0 0 3px rgba(255,255,255,0.95)`
    : `0 2px 8px rgba(0,0,0,0.18), 0 0 0 2px rgba(255,255,255,0.85)`;
  const iconSize = isSelected ? 18 : 14;

  return new L.DivIcon({
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: 50%;
      box-shadow: ${shadow};
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      transform: ${isSelected ? "scale(1.1)" : "scale(1)"};
    "><svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="pointer-events:none;">${iconSvg}</svg></div>`,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 2)],
  });
}

function createLogoIcon(isSelected: boolean, logoUrl: string): L.DivIcon {
  const size = isSelected ? 44 : 36;

  return new L.DivIcon({
    html: `<img src="${logoUrl}" style="
      width: ${size}px;
      height: ${size}px;
      object-fit: contain;
      pointer-events: none;
      cursor: pointer;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
      transition: transform 0.2s ease;
      transform: ${isSelected ? "scale(1.1)" : "scale(1)"};
    " />`,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 2)],
  });
}

function spreadCoords(items: ClusterMarkerItem[]): ClusterMarkerItem[] {
  const groups = new Map<string, ClusterMarkerItem[]>();
  for (const item of items) {
    const key = `${item.lat.toFixed(5)},${item.lng.toFixed(5)}`;
    const group = groups.get(key);
    if (group) group.push(item);
    else groups.set(key, [item]);
  }

  const spread: ClusterMarkerItem[] = [];
  const R = 0.00006;
  for (const group of groups.values()) {
    if (group.length === 1) {
      spread.push(group[0]);
    } else {
      group.forEach((item, i) => {
        const angle = (2 * Math.PI * i) / group.length;
        spread.push({
          ...item,
          lat: item.lat + R * Math.cos(angle),
          lng: item.lng + R * Math.sin(angle),
        });
      });
    }
  }
  return spread;
}

export default function ClusteredMarkers({
  items,
  selectedId,
  selectedFacilitadorId,
  onSelect,
  renderPopup,
  dimOthers,
}: Props) {
  const spreadItems = useMemo(() => spreadCoords(items), [items]);

  return (
    <>
      {spreadItems.map((item) => {
        const isSelected = selectedId === item.id;
        const isSameFacilitador = selectedFacilitadorId
          ? (item.data as any)?.facilitador?.id === selectedFacilitadorId
          : false;
        const logoUrl = (item.data as any)?.facilitador?.logo_url as string | null | undefined;
        const icon = logoUrl
          ? createLogoIcon(isSelected, logoUrl)
          : createActivityIcon(item.color, item.iconSvg, isSelected);
        return (
          <Marker
            key={`${item.id}|${item.lat.toFixed(6)}|${item.lng.toFixed(6)}`}
            position={[item.lat, item.lng]}
            icon={icon}
            opacity={dimOthers && selectedFacilitadorId && !isSameFacilitador ? 0.35 : 1}
            eventHandlers={{ click: () => onSelect?.(item.id) }}
          >
            {renderPopup && (
              <Popup closeButton autoPan={false} maxWidth={320}>
                {renderPopup(item)}
              </Popup>
            )}
          </Marker>
        );
      })}
    </>
  );
}
