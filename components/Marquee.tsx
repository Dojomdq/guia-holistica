"use client";

interface MarqueeProps {
  items: string[];
  speed?: number;
  reverse?: boolean;
  className?: string;
}

export default function Marquee({ items, speed = 30, reverse = false, className = "" }: MarqueeProps) {
  const duplicated = [...items, ...items, ...items];

  return (
    <div className={`overflow-hidden py-5 ${className}`}>
      <div
        className="flex whitespace-nowrap"
        style={{
          animation: `marquee ${speed}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {duplicated.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-4 mx-6">
            <span className="text-[clamp(1.5rem,3vw,2.5rem)] font-serif font-semibold text-bark/15 tracking-tight">
              {item}
            </span>
            <span className="w-2 h-2 rounded-full bg-sage-300/40 shrink-0" />
          </span>
        ))}
      </div>
    </div>
  );
}
