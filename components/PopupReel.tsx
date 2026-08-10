"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

const STORAGE_KEY = "popup_reel_visto";

interface Props {
  reelUrl: string;
  titulo?: string;
}

export default function PopupReel({ reelUrl, titulo = "Contenido destacado" }: Props) {
  const [visible, setVisible] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const yaVisto = sessionStorage.getItem(STORAGE_KEY);
    if (yaVisto) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setTimeout(() => {
      setVisible(true);
      sessionStorage.setItem(STORAGE_KEY, "1");
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-bark/80 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      onClick={(e) => { if (e.target === overlayRef.current) setVisible(false); }}
    >
      <div className="bg-cream-50 dark:bg-bark-900 rounded-2xl max-w-sm w-full shadow-2xl border border-cream-200 dark:border-bark-700 relative overflow-hidden">
        <button
          onClick={() => setVisible(false)}
          className="absolute top-3 right-3 z-10 bg-white/90 dark:bg-bark-800 rounded-full p-1.5 shadow-md hover:scale-110 transition"
          aria-label="Cerrar"
        >
          <X className="h-4 w-4 text-bark dark:text-cream-100" />
        </button>

        <div className="p-4 pb-1">
          <h3 className="font-serif text-lg font-medium text-bark dark:text-cream-100 text-center">{titulo}</h3>
        </div>

        <div className="flex justify-center">
          <iframe
            src={reelUrl}
            width="328"
            height="580"
            style={{ border: "none", overflow: "hidden" }}
            scrolling="no"
            allowTransparency
            allow="encrypted-media"
            title="Reel de Instagram"
          />
        </div>
      </div>
    </div>
  );
}
