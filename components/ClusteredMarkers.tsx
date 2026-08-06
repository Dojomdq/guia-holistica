"use client";

import { Marker, Popup } from "react-leaflet";
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

interface Props {
  items: ClusterMarkerItem[];
  threshold?: number;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  renderPopup?: (item: ClusterMarkerItem) => React.ReactNode;
  dimOthers?: boolean;
}

function createDotIcon(color: string, isSelected: boolean): L.DivIcon {
  const size = isSelected ? 22 : 16;
  const shadow = isSelected
    ? "0 2px 10px rgba(0,0,0,0.30), 0 0 0 3px rgba(255,255,255,0.90)"
    : "0 1px 5px rgba(0,0,0,0.18), 0 0 0 2px rgba(255,255,255,0.80)";

  return new L.DivIcon({
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: 50%;
      box-shadow: ${shadow};
      cursor: pointer;
    "></div>`,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2)],
  });
}

export default function ClusteredMarkers({
  items,
  selectedId,
  onSelect,
  renderPopup,
  dimOthers,
}: Props) {
  return (
    <>
      {items.map((item) => {
        const isSelected = selectedId === item.id;
        const icon = createDotIcon(item.color, isSelected);
        return (
          <Marker
            key={`${item.id}|${item.lat}|${item.lng}`}
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
      })}
    </>
  );
}
