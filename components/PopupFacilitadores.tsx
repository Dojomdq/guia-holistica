"use client";

import { useState, useEffect } from "react";
import { X, MapPin, Sparkles } from "lucide-react";

export default function PopupFacilitadores() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
      <div className="bg-[#F5F0E8] rounded-2xl max-w-md w-full p-8 shadow-2xl border border-sage/30 relative">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 text-warmblack/50 hover:text-warmblack transition"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="bg-clay/15 p-3 rounded-full">
            <MapPin className="h-6 w-6 text-clay" />
          </div>
          <span className="text-xs font-semibold text-clay uppercase tracking-wider">
            Visibilidad
          </span>
        </div>

        <h3 className="text-3xl font-display text-warmblack mb-3 leading-tight font-bold">
          ¿Te gustaría que los usuarios te encuentren en este mapa?
        </h3>

        <p className="text-warmblack/80 text-base mb-6 leading-relaxed">
          Sumá tu perfil y aparecé en el directorio de bienestar de Mar del Plata. Miles de personas buscan tu ayuda.
        </p>

        <a
          href="https://wa.me/5492235742540?text=Hola%20quiero%20sumar%20mi%20perfil%20a%20la%20Guía%20de%20Bienestar"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center bg-clay text-white py-4 rounded-xl hover:bg-clay/90 transition font-medium shadow-md hover:shadow-lg text-base"
        >
          Sumarme ahora <Sparkles className="inline h-4 w-4 ml-2" />
        </a>

        <p className="text-center text-xs text-warmblack/40 mt-4">
          ⚡ 1 minuto
        </p>
      </div>
    </div>
  );
}
