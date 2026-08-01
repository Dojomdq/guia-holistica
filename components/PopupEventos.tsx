"use client";

import { useState, useEffect, useCallback } from "react";
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

  useEffect(() => {
    const yaVisto = sessionStorage.getItem(STORAGE_KEY);
    if (yaVisto) return;
    const timer = setTimeout(() => {
      setVisible(true);
      sessionStorage.setItem(STORAGE_KEY, "1");
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, current]);

  const handleClose = useCallback(() => {
    setVisible(false);
    onClose();
  }, [onClose]);

  const prev = () => setCurrent((c) => (c === 0 ? SLIDES.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === SLIDES.length - 1 ? 0 : c + 1));

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-bark/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-cream-50 rounded-2xl max-w-md w-full shadow-2xl border border-cream-200 relative overflow-hidden">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 bg-bark/60 hover:bg-bark/80 text-white rounded-full p-1.5 transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative overflow-hidden bg-bark/5 flex items-center justify-center" style={{ height: "50vh", minHeight: "320px", maxHeight: "70vh" }}>
          {SLIDES.map((slide, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-500 ${
                i === current ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              {slide.tipo === "video" ? (
                <video
                  src={slide.fuente}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={slide.fuente}
                  alt={slide.titulo}
                  className="w-full h-full object-contain"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-bark/60 via-transparent to-transparent pointer-events-none" />
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
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white rounded-full p-1.5 backdrop-blur-sm transition"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white rounded-full p-1.5 backdrop-blur-sm transition"
              >
                <ChevronRight className="h-5 w-5" />
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
                className={`w-2 h-2 rounded-full transition-all ${
                  i === current ? "bg-sage-600 scale-110" : "bg-cream-300"
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleClose}
            className="text-xs text-bark-500 hover:text-bark-700 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
