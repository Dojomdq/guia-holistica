"use client";

import { useScrollReveal, useCountUp } from "@/lib/useScrollReveal";

const STATS = [
  { value: 22, suffix: "", label: "Facilitadores activos", sublabel: "perfiles verificados" },
  { value: 19, suffix: "", label: "Categorías", sublabel: "de bienestar" },
  { value: 100, suffix: "%", label: "Gratuito", sublabel: "para la comunidad" },
];

export default function StatsSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-20 sm:py-24 bg-cream-50 relative">
      <div className="container-wide">
        <div
          className={`max-w-4xl mx-auto transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-0 sm:divide-x sm:divide-cream-300/60">
            {STATS.map((stat, i) => (
              <StatItem key={stat.label} stat={stat} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatItem({
  stat,
  index,
}: {
  stat: { value: number; suffix: string; label: string; sublabel: string };
  index: number;
}) {
  const { ref, count } = useCountUp(stat.value, 1500);

  return (
    <div
      ref={ref}
      className="text-center px-8 py-4"
    >
      <div className="font-serif text-[clamp(2.5rem,5vw,3.5rem)] leading-none tracking-[-0.03em] text-bark">
        {count}
        <span className="text-sage-500">{stat.suffix}</span>
      </div>
      <p className="text-[15px] font-medium text-bark-700 mt-2">{stat.label}</p>
      <p className="text-[13px] text-bark-500 mt-0.5">{stat.sublabel}</p>
    </div>
  );
}
