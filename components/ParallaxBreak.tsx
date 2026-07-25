"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";

export default function ParallaxBreak() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      className="relative py-16 sm:py-20 lg:py-28 overflow-hidden"
    >
      {/* Background — Mar del Plata coast, different crop */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-QeQbK4J3P4A?w=1920&h=800&fit=crop&crop=center"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        {/* Dark overlay for text contrast */}
        <div className="absolute inset-0 bg-bark/55" />
        {/* Warm tint */}
        <div className="absolute inset-0 bg-terracotta-900/10 mix-blend-multiply" />
        {/* Subtle grain */}
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay noise-overlay" />
      </div>

      {/* Content */}
      <div className="relative container-page">
        <p
          className={`font-serif text-[clamp(2.25rem,5.5vw,4rem)] leading-[1.05] tracking-[-0.03em] text-white max-w-3xl transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          Bienestar corporal
          <br />
          <span className="text-sand-300/80">en Mar del Plata.</span>
        </p>
      </div>

      {/* Bottom line */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sand-400/20 to-transparent transition-all duration-1000 delay-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      />
    </section>
  );
}
