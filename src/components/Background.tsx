import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { theme } from "../theme";

/** Фон: градиент + мягкие «пятна» на radial-gradient (без CSS blur — быстрый CPU-рендер). */
export const Background: React.FC<{ tone?: "accent" | "dark" | "blue" }> = ({ tone = "dark" }) => {
  const f = useCurrentFrame();
  const base = tone === "accent" ? `linear-gradient(160deg, ${theme.colors.accent} 0%, ${theme.colors.accent2} 100%)`
    : tone === "blue" ? `linear-gradient(160deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`
    : `linear-gradient(160deg, ${theme.colors.navy2} 0%, ${theme.colors.navy} 100%)`;
  const drift = (k: number, amp: number) => Math.sin((f / 30) * 0.6 + k) * amp;
  const blob = (color: string, x: number, y: number, r: number, k: number, op = 0.5) => (
    <div style={{ position: "absolute", left: x + drift(k, 40) - r / 2, top: y + drift(k + 2, 60) - r / 2, width: r, height: r, borderRadius: "50%", background: `radial-gradient(circle, ${color} 0%, rgba(0,0,0,0) 70%)`, opacity: op }} />
  );
  const gridOpacity = interpolate(f, [0, 20], [0, 0.07], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: base, overflow: "hidden" }}>
      {blob(tone === "accent" ? "#FFF3B0" : theme.colors.primary, 150, 450, 1300, 0)}
      {blob(tone === "accent" ? "#FF8A3D" : theme.colors.accent, 900, 1500, 1100, 1.5, 0.35)}
      {blob(tone === "dark" ? "#6D28D9" : "#60A5FA", 550, 950, 900, 3, 0.4)}
      <AbsoluteFill style={{ opacity: gridOpacity, backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: "90px 90px" }} />
    </AbsoluteFill>
  );
};
