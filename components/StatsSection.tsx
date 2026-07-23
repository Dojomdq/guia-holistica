"use client";

import { useScrollReveal, useCountUp } from "@/lib/useScrollReveal";

const stats = [
  { label: "Facilitadores", value: 22, suffix: "+" },
  { label: "Actividades", value: 20, suffix: "" },
  { label: "Categorías", value: 18, suffix: "" },
  { label: "Años de experiencia", value: 10, suffix: "+" },
];

export default function StatsSection() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container-page">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat) => (
            <StatItem key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatItem({
  label,
  value,
  suffix,
}: {
  label: string;
  value: number;
  suffix: string;
}) {
  const { ref, count } = useCountUp(value, 2000);

  return (
    <div ref={ref} className="text-center">
      <div className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-warmblack tracking-tight">
        {count}
        {suffix}
      </div>
      <div className="text-small mt-2">{label}</div>
    </div>
  );
}
