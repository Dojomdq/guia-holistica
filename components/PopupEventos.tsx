"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { X, ChevronLeft, ChevronRight, Calendar, MapPin } from "lucide-react";
import { WHATSAPP_LINK } from "@/lib/constants";
import { supabase } from "@/lib/supabase/client";

const STORAGE_KEY = "popup_eventos_visto";

interface EventoSolidario {
  id: string;
  titulo: string;
  descripcion: string | null;
  fecha: string | null;
  imagen_url: string | null;
  link: string | null;
  ciudad: string | null;
}

interface Props {
  onClose: () => void;
  auto?: boolean;
}

export default function PopupEventos({ onClose }: Props) {
  const [slides, setSlides] = useState<EventoSolidario[]>([]);
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase
      .from("eventos")
      .select("id, titulo, descripcion, fecha, imagen_url, link, ciudad")
      .eq("activo", true)
      .eq("solidario", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) setSlides(data as EventoSolidario[]);
      });
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const yaVisto = sessionStorage.getItem(STORAGE_KEY);
    if (yaVisto) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setTimeout(() => {
      setVisible(true);
      sessionStorage.setItem(STORAGE_KEY, "1");
    }, 3000);
    return () => clearTimeout(timer);
  }, [slides]);

  const handleClose = useCallback(() => {
    setVisible(false);
    onClose();
  }, [onClose]);

  const prev = useCallback(() => setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1)), [slides.length]);
  const next = useCallback(() => setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1)), [slides.length]);

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

  if (!visible || slides.length === 0) return null;

  const esVideo = (url: string | null) => /\.(mp4|webm|mov|ogg)(\?|$)/i.test(url || "");

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Próximos eventos solidarios"
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
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                i === current ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              aria-hidden={i !== current}
            >
              {slide.imagen_url && esVideo(slide.imagen_url) ? (
                <video
                  src={slide.imagen_url}
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  aria-label={slide.titulo}
                  className="w-full h-full object-contain"
                />
              ) : slide.imagen_url ? (
                <img
                  src={slide.imagen_url}
                  alt={slide.titulo}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Calendar className="h-16 w-16 text-cream-300" />
                </div>
              )}
            </div>
          ))}

          {slides.length > 1 && (
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

        <div className="px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-terracotta-600 mb-1 flex items-center gap-1.5">
            <Calendar className="h-3 w-3" /> {slides[current]?.fecha || "Próximamente"}
          </p>
          <h3 className="font-serif text-xl font-semibold text-bark leading-tight">
            {slides[current]?.titulo}
          </h3>
          {slides[current]?.descripcion && (
            <p className="text-sm text-bark-600 mt-1">{slides[current]?.descripcion}</p>
          )}
          {slides[current]?.ciudad && (
            <p className="text-xs text-bark-500 mt-1 flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {slides[current]?.ciudad}
            </p>
          )}
        </div>

        <div className="px-5 py-4 flex items-center justify-between bg-white/60 backdrop-blur-sm border-t border-cream-200">
          <a
            href={`${WHATSAPP_LINK}?text=${encodeURIComponent("Vengo del sitio Guía de Bienestar, me gustaría más información sobre el evento solidario")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-sage-600 hover:text-sage-700 transition"
          >
            Quiero participar
          </a>
          <div className="flex gap-1.5">
            {slides.map((_, i) => (
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
