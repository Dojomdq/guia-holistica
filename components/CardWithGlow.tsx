"use client";

import { useRef, type ReactNode } from "react";

interface CardWithGlowProps {
  children: ReactNode;
  className?: string;
}

export default function CardWithGlow({ children, className = "" }: CardWithGlowProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--glow-x", `${x}px`);
    card.style.setProperty("--glow-y", `${y}px`);
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden group ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[1] card-glow-effect" />
      <div className="relative z-[2]">{children}</div>
    </div>
  );
}
