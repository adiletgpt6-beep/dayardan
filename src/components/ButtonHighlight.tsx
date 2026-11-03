import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../theme";

/** Пульсирующая подсветка области (кнопки) на экране телефона. Координаты — доли экрана. */
export const ButtonHighlight: React.FC<{ x: number; y: number; w: number; h: number; at?: number; width: number; height: number }> = ({ x, y, w, h, at = 0.5, width, height }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps - at;
  if (t < 0) return null;
  const pulse = 0.5 + 0.5 * Math.sin(t * 6);
  const op = interpolate(t, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: x * width - 8, top: y * height - 8, width: w * width + 16, height: h * height + 16, borderRadius: 22, border: `6px solid ${theme.colors.accent}`, boxShadow: `0 0 ${20 + 25 * pulse}px ${theme.colors.accent}`, opacity: op, pointerEvents: "none" }} />
  );
};
