"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const STORAGE_KEY = "popup_eventos_visto";

const SLIDES = [
  {
    tipo: "imagen" as const,
    fuente: "https://res.cloudinary.com/kmxmqr0t/image/upload/v1785554110/WhatsApp_Image_2026-07-31_at_12.40.42_dcmzog.jpg",
    titulo: "Próximo evento",
    descripcion: "Retiro de yoga y meditación en la costa",
    fecha: "15 de agosto",
  },
  {
    tipo: "video" as const,
    fuente: "https://res.cloudinary.com/kmxmqr0t/video/upload/v1785554212/WhatsApp_Video_2026-07-31_at_12.11.30_vwohj9.mp4",
    titulo: "Taller",
    descripcion: "Ceremonia de cacao y sanación sonora",
    fecha: "22 de agosto",
  },
];

interface Props {
  onClose: () => void;
  auto?: boolean;
}

export default function PopupEventos({ onClose }: Props) {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const yaVisto = sessionStorage.getItem(STORAGE_KEY);
    if (yaVisto) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setTimeout(() => {
      setVisible(true);
      sessionStorage.setItem(STORAGE_KEY, "1");
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
    onClose();
  }, [onClose]);

  const prev = useCallback(() => setCurrent((c) => (c === 0 ? SLIDES.length - 1 : c - 1)), []);
  const next = useCallback(() => setCurrent((c) => (c === SLIDES.length - 1 ? 0 : c + 1)), []);

  useEffect(() => {
    if (!visible) return;
    const overlay = overlayRef.current;
    const closeBtn = overlay?.querySelector<HTMLButtonElement>('[aria-label="Cerrar"]');
    closeBtn?.focus();
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const overlay = overlayRef.current;
    if (!overlay) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { handleClose(); return; }
      if (e.key === "ArrowLeft") { prev(); return; }
      if (e.key === "ArrowRight") { next(); return; }
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
  }, [visible, handleClose, prev, next]);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Próximos eventos de la Guía de Bienestar"
      className="fixed inset-0 bg-bark/80 backdrop-blur-sm flex items-center justify-center z-50 px-4"
    >
      <div className="bg-cream-50 rounded-2xl max-w-md w-full shadow-2xl border border-cream-200 relative overflow-hidden">
        <button
          onClick={handleClose}
          aria-label="Cerrar"
          className="absolute top-3 right-3 z-20 bg-bark/60 hover:bg-bark/80 text-white rounded-full p-1.5 transition"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="relative overflow-hidden bg-bark/5 flex items-center justify-center" style={{ height: "50vh", minHeight: "320px", maxHeight: "70vh" }}>
          {SLIDES.map((slide, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-500 ${
                i === current ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              aria-hidden={i !== current}
            >
              {slide.tipo === "video" ? (
                <video
                  src={slide.fuente}
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  aria-label={slide.titulo}
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={slide.fuente}
                  alt={slide.titulo}
                  className="w-full h-full object-contain"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-bark/60 via-transparent to-transparent pointer-events-none" aria-hidden="true" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <p className="text-xs font-semibold uppercase tracking-wider text-sand-300 mb-1">
                  {slide.fecha}
                </p>
                <h3 className="font-serif text-xl font-semibold leading-tight">
                  {slide.titulo}
                </h3>
                <p className="text-sm text-cream-100 mt-1">
                  {slide.descripcion}
                </p>
              </div>
            </div>
          ))}

          {SLIDES.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Anterior"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white rounded-full p-1.5 backdrop-blur-sm transition"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                onClick={next}
                aria-label="Siguiente"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white rounded-full p-1.5 backdrop-blur-sm transition"
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </>
          )}
        </div>

        <div className="px-5 py-4 flex items-center justify-between bg-white/60 backdrop-blur-sm border-t border-cream-200">
          <a
            href="https://wa.me/5492235742540?text=Vengo%20del%20sitio%20Guiadebienestar%2C%20me%20gustaria%20mas%20informacion%20porque%20tengo%20interes%20en%20participar%20en%20el%20evento"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-sage-600 hover:text-sage-700 transition"
          >
            Quiero participar
          </a>
          <div className="flex gap-1.5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Ir al evento ${i + 1}`}
                aria-current={i === current ? "true" : undefined}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === current ? "bg-sage-600 scale-110" : "bg-cream-300"
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleClose}
            className="text-xs text-bark-600 hover:text-bark-700 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
