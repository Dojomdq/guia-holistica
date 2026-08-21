"use client";

import { useCallback, type MouseEvent } from "react";

export function useRipple(color: string = "rgba(90, 143, 143, 0.35)") {
  const createRipple = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const ripple = document.createElement("span");
      ripple.className = "ripple-effect";
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.setProperty("--ripple-color", color);

      el.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    },
    [color]
  );

  return createRipple;
}
