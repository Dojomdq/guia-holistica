"use client";

import { useState, useEffect } from "react";

const frases = [
  "El bienestar no es un destino, es un camino.",
  "Cada respiración es una nueva oportunidad.",
  "Sanar es recordar que ya estamos completos.",
  "El cuerpo sabe lo que necesita, solo hay que escucharlo.",
  "La paz interior comienza con una sola respiración.",
];

export default function FrasesRotativas() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % frases.length);
        setVisible(true);
      }, 400);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 sm:py-16 relative overflow-hidden">
      <div className="container-page text-center">
        <p
          className={`font-serif text-xl sm:text-2xl text-bark/30 italic transition-all duration-400 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          &ldquo;{frases[index]}&rdquo;
        </p>
      </div>
    </section>
  );
}
