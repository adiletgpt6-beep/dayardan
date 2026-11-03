import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import type { Pt } from "../types";
import { theme } from "../theme";

/**
 * Анимированный курсор/палец для мобильного интерфейса: плавно перемещается между точками,
 * при «тапе» — кольцо-ripple. Координаты — доли ширины/высоты экрана телефона.
 */
export const AnimatedCursor: React.FC<{ points: Pt[]; width: number; height: number }> = ({ points, width, height }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!points.length) return null;
  const t = frame / fps;
  const times = points.map((p, i) => p.at ?? i * 1.6 + 0.8);
  // позиция
  let x = points[0].x, y = points[0].y;
  for (let i = 0; i < points.length; i++) {
    const t0 = times[i];
    const prev = i === 0 ? { x: points[0].x + 0.25, y: points[0].y + 0.3 } : points[i - 1];
    const start = t0 - 0.7;
    const p = interpolate(t, [start, t0], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
    if (t >= start) { x = prev.x + (points[i].x - prev.x) * p; y = prev.y + (points[i].y - prev.y) * p; }
  }
  const appear = interpolate(t, [times[0] - 0.9, times[0] - 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // ripple
  const ripples = times.map((t0, i) => {
    const r = interpolate(t, [t0, t0 + 0.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    if (t < t0 || r >= 1) return null;
    return <div key={i} style={{ position: "absolute", left: points[i].x * width - 70 * r, top: points[i].y * height - 70 * r, width: 140 * r, height: 140 * r, borderRadius: "50%", border: `4px solid ${theme.colors.accent}`, opacity: 1 - r }} />;
  });
  const pressing = times.some((t0) => t >= t0 && t < t0 + 0.2);
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: appear }}>
      {ripples}
      <div style={{ position: "absolute", left: x * width - 26, top: y * height - 26, width: 52, height: 52, borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: `5px solid ${theme.colors.primary}`, boxShadow: "0 6px 20px rgba(0,0,0,0.35)", transform: `scale(${pressing ? 0.75 : 1})` }} />
    </div>
  );
};
