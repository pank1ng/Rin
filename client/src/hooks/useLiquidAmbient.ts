import { useEffect } from "react";

const DEFAULT_X = "50%";
const DEFAULT_Y = "18%";

export function useLiquidAmbient() {
  useEffect(() => {
    const root = document.documentElement;

    const updateAmbient = (clientX: number, clientY: number) => {
      const x = (clientX / window.innerWidth) * 100;
      const y = (clientY / window.innerHeight) * 100;
      root.style.setProperty("--ambient-x", `${x}%`);
      root.style.setProperty("--ambient-y", `${y}%`);
    };

    const handleMove = (event: PointerEvent) => {
      updateAmbient(event.clientX, event.clientY);
    };

    const handleLeave = () => {
      root.style.setProperty("--ambient-x", DEFAULT_X);
      root.style.setProperty("--ambient-y", DEFAULT_Y);
    };

    handleLeave();
    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerleave", handleLeave);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerleave", handleLeave);
      handleLeave();
    };
  }, []);
}
