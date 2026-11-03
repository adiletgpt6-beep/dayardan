import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

/** Плавное увеличение важной области. x,y — доли контейнера (центр увеличения). */
export const ZoomEffect: React.FC<{ x: number; y: number; scale: number; at?: number; children: React.ReactNode }> = ({ x, y, scale, at = 1.5, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const s = interpolate(t, [at, at + 0.9], [1, scale], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  return (
    <div style={{ position: "absolute", inset: 0, transform: `scale(${s})`, transformOrigin: `${x * 100}% ${y * 100}%` }}>{children}</div>
  );
};
