"use client";

import { useState } from "react";
import PopupFacilitadores from "@/components/PopupFacilitadores";
import PopupEventos from "@/components/PopupEventos";

export default function PopupManager() {
  const [showEventos, setShowEventos] = useState(false);

  return (
    <>
      <PopupFacilitadores onClose={() => setShowEventos(true)} />
      {showEventos && <PopupEventos onClose={() => setShowEventos(false)} />}
    </>
  );
}
