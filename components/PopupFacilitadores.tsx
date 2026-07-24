"use client";

import { useState, useEffect } from "react";
import { X, MapPin } from "lucide-react";

export default function PopupFacilitadores() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 animate-in fade-in duration-300">
      <div className="bg-gradient-to-br from-cream to-sage/20 rounded-2xl max-w-md w-full p-8 shadow-2xl relative border border-sage/30">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 text-warmblack/40 hover:text-warmblack transition"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="bg-clay/10 p-3 rounded-full">
            <MapPin className="h-6 w-6 text-clay" />
          </div>
          <span className="text-xs font-medium text-clay/80 uppercase tracking-wider">
            Visibilidad
          </span>
        </div>

        <h3 className="text-2xl font-display text-warmblack mb-3 leading-tight">
          ¿Te gustaría que los usuarios te encuentren en este mapa?
        </h3>

        <p className="text-warmblack/70 text-sm mb-6 leading-relaxed">
          Sumá tu perfil gratis y aparecé en el directorio de bienestar de Mar del Plata. Miles de personas buscan tu ayuda.
        </p>

        <a
          href="https://wa.me/5492235742540?text=Hola%20quiero%20sumar%20mi%20perfil%20a%20la%20Guía%20de%20Bienestar"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center bg-clay text-white py-3.5 rounded-xl hover:bg-clay/80 transition font-medium shadow-md hover:shadow-lg"
        >
          Sumarme ahora
        </a>

        <p className="text-center text-xs text-warmblack/40 mt-4">
          ⚡ Sin costo • 1 minuto
        </p>
      </div>
    </div>
  );
}
