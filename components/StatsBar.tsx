"use client";

import { useCountUp } from "@/lib/useScrollReveal";

interface StatItem {
  label: string;
  value: number;
  suffix?: string;
}

interface StatsBarProps {
  stats: StatItem[];
}

function StatNumber({ value, suffix }: { value: number; suffix?: string }) {
  const { ref, count } = useCountUp(value, 2000);
  return (
    <span ref={ref} className="text-4xl sm:text-5xl font-serif font-semibold text-bark dark:text-cream-100 tabular-nums">
      {count}{suffix || ""}
    </span>
  );
}

export default function StatsBar({ stats }: StatsBarProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-4xl mx-auto">
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <StatNumber value={stat.value} suffix={stat.suffix} />
          <p className="text-sm text-bark-500 dark:text-cream-400 mt-1.5 font-medium">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
