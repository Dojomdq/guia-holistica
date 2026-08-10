"use client";

import PopupFacilitadores from "@/components/PopupFacilitadores";
import PopupReel from "@/components/PopupReel";

export default function PopupManager() {
  return (
    <>
      <PopupFacilitadores onClose={() => {}} />
      <PopupReel
        reelUrl="https://www.instagram.com/reel/REEMPLAZAR_CON_TU_REEL/embed/"
        titulo="🎥 Conocé nuestro trabajo"
      />
    </>
  );
}
