import { useCallback, useMemo } from "react";
import type React from "react";

function updateLiquidSurface(
  target: EventTarget & HTMLElement,
  clientX: number,
  clientY: number
) {
  const rect = target.getBoundingClientRect();
  target.style.setProperty("--mx", `${clientX - rect.left}px`);
  target.style.setProperty("--my", `${clientY - rect.top}px`);
  target.style.setProperty("--liquid-active", "1");
}

export function useLiquidSurface() {
  const onMouseEnter = useCallback((event: React.MouseEvent<HTMLElement>) => {
      updateLiquidSurface(event.currentTarget, event.clientX, event.clientY);
    }, []);
  const onMouseMove = useCallback((event: React.MouseEvent<HTMLElement>) => {
      updateLiquidSurface(event.currentTarget, event.clientX, event.clientY);
    }, []);
  const onMouseLeave = useCallback((event: React.MouseEvent<HTMLElement>) => {
      event.currentTarget.style.setProperty("--liquid-active", "0");
    }, []);

  return useMemo(
    () => ({
      onMouseEnter,
      onMouseMove,
      onMouseLeave,
    }),
    [onMouseEnter, onMouseMove, onMouseLeave]
  );
}
