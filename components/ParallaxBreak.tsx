"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";

export default function ParallaxBreak() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      className="relative h-[40vh] sm:h-[50vh] overflow-hidden"
    >
      {/* Background — solid color with grain */}
      <div className="absolute inset-0 bg-warmblack" />
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      {/* Content — big typographic statement */}
      <div className="relative h-full flex items-center">
        <div className="container-page">
          <p
            className={`font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white/90 leading-[1.05] tracking-tight max-w-3xl transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            Sanación holística
            <br />
            <span className="text-sage-400/80">en Mar del Plata.</span>
          </p>
        </div>
      </div>

      {/* Decorative line */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sage-500/20 to-transparent transition-all duration-1000 delay-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      />
    </section>
  );
}
