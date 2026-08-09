"use client";

import PopupFacilitadores from "@/components/PopupFacilitadores";
import PopupEventos from "@/components/PopupEventos";

export default function PopupManager() {
  return (
    <>
      <PopupFacilitadores onClose={() => {}} />
      <PopupEventos onClose={() => {}} auto />
    </>
  );
}
