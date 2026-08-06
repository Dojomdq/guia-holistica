"use client";

import { useState, useEffect, useRef } from "react";
import { X, MapPin, Sparkles } from "lucide-react";
import { CITY_NAME } from "@/lib/constants";

const STORAGE_KEY = "popup_visto";

interface Props {
  onClose?: () => void;
}

export default function PopupFacilitadores({ onClose }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const yaVisto = sessionStorage.getItem(STORAGE_KEY);
    if (yaVisto) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setTimeout(() => {
      setIsOpen(true);
      sessionStorage.setItem(STORAGE_KEY, "1");
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const overlay = overlayRef.current;
    if (!overlay) return;

    const closeBtn = overlay.querySelector<HTMLButtonElement>('[aria-label="Cerrar"]');
    closeBtn?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setIsOpen(false); onClose?.(); return; }
      if (e.key !== "Tab") return;
      const focusables = overlay.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    overlay.addEventListener("keydown", onKey);
    return () => overlay.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-facilitadores-titulo"
      className="fixed inset-0 bg-bark/80 backdrop-blur-sm flex items-center justify-center z-50 px-4"
    >
      <div className="bg-cream-50 rounded-2xl max-w-md w-full p-8 shadow-2xl border border-cream-200 relative">
        <button
          onClick={() => { setIsOpen(false); onClose?.(); } }
          aria-label="Cerrar"
          className="absolute top-3 right-3 text-bark-600 hover:text-bark transition"
        >
          <X className="h-6 w-6" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="bg-terracotta-50 p-3 rounded-full">
            <MapPin className="h-6 w-6 text-terracotta-600" aria-hidden="true" />
          </div>
          <span className="text-xs font-semibold text-terracotta-600 uppercase tracking-wider">
            Visibilidad
          </span>
        </div>

        <h3 id="popup-facilitadores-titulo" className="text-3xl font-serif text-bark mb-3 leading-tight font-semibold">
          ¿Te gustaría que los usuarios te encuentren en este mapa?
        </h3>

        <p className="text-bark-700 text-base mb-6 leading-relaxed">
          Sumá tu perfil y aparecé en el directorio de bienestar de {CITY_NAME}. Miles de personas buscan tu ayuda.
        </p>

        <a
          href="https://wa.me/5492235742540?text=Hola%20quiero%20sumar%20mi%20perfil%20a%20la%20Gu%C3%ADa%20de%20Bienestar"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center bg-terracotta-600 text-white py-4 rounded-xl hover:bg-terracotta-700 transition font-semibold shadow-lg hover:shadow-xl text-lg tracking-wide"
        >
          Sumarme ahora <Sparkles className="inline h-5 w-5 ml-2" aria-hidden="true" />
        </a>

        <p className="text-center text-xs text-bark-500 mt-4">
          1 minuto
        </p>
      </div>
    </div>
  );
}
