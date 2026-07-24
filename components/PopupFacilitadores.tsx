"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function PopupFacilitadores() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-lg relative">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 text-warmblack/50 hover:text-warmblack transition"
        >
          <X className="h-6 w-6" />
        </button>
        <h3 className="text-2xl font-display text-warmblack mb-2">
          ¿Te gustaría que los usuarios te encuentren en este mapa?
        </h3>
        <p className="text-warmblack/70 text-sm mb-6">
          Sumá tu perfil gratis y aparecé en el directorio de bienestar de Mar del Plata.
        </p>
        <a
          href="https://wa.me/549tuNumero"
          target="_blank"
          className="block w-full text-center bg-clay text-white py-3 rounded-lg hover:bg-clay/90 transition font-medium"
        >
          Sumarme ahora
        </a>
      </div>
    </div>
  );
}
