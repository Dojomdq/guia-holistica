"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";

export default function ParallaxBreak() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      className="relative py-24 sm:py-32 lg:py-40 overflow-hidden"
    >
      {/* Background — warm gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-sage-800 via-sage-900 to-warmblack" />
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "256px 256px",
        }}
      />
      {/* Warm orb */}
      <div className="absolute top-1/2 right-[20%] -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-sand-500/[0.06] blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative container-page">
        <p
          className={`font-serif text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] tracking-[-0.025em] text-white/90 max-w-3xl transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          Sanación holística
          <br />
          <span className="text-sand-300/70">en Mar del Plata.</span>
        </p>
      </div>

      {/* Bottom line */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sand-400/15 to-transparent transition-all duration-1000 delay-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      />
    </section>
  );
}
