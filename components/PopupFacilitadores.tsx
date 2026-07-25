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
    <div className="fixed inset-0 bg-bark/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-cream-50 rounded-2xl max-w-md w-full p-8 shadow-2xl border border-cream-200 relative">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 text-bark/40 hover:text-bark transition"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="bg-terracotta-50 p-3 rounded-full">
            <MapPin className="h-6 w-6 text-terracotta-600" />
          </div>
          <span className="text-xs font-semibold text-terracotta-600 uppercase tracking-wider">
            Visibilidad
          </span>
        </div>

        <h3 className="text-3xl font-serif text-bark mb-3 leading-tight font-semibold">
          ¿Te gustaría que los usuarios te encuentren en este mapa?
        </h3>

        <p className="text-bark/60 text-base mb-6 leading-relaxed">
          Sumá tu perfil y aparecé en el directorio de bienestar de Mar del Plata. Miles de personas buscan tu ayuda.
        </p>

        <a
          href="https://wa.me/5492235742540?text=Hola%20quiero%20sumar%20mi%20perfil%20a%20la%20Gu%C3%ADa%20de%20Bienestar"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center bg-terracotta-600 text-white py-4 rounded-xl hover:bg-terracotta-700 transition font-semibold shadow-lg hover:shadow-xl text-lg tracking-wide"
        >
          Sumarme ahora <Sparkles className="inline h-5 w-5 ml-2" />
        </a>

        <p className="text-center text-xs text-bark/35 mt-4">
          1 minuto
        </p>
      </div>
    </div>
  );
}
