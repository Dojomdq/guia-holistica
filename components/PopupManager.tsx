"use client";

import PopupFacilitadores from "@/components/PopupFacilitadores";
import PopupReel from "@/components/PopupReel";

export default function PopupManager() {
  return (
    <>
      <PopupFacilitadores onClose={() => {}} />
      <PopupReel
        reelUrl="https://www.instagram.com/reel/DaxfX2MK3Ih/embed/"
        titulo="🎥 Conocé nuestro trabajo"
      />
    </>
  );
}
