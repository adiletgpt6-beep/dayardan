import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { theme } from "../theme";

/** Фон в цветах сайта: тёмно-зелёный (dark), зелёный градиент кнопок (blue→"green"), светлый mint (accent). */
export const Background: React.FC<{ tone?: "accent" | "dark" | "blue" }> = ({ tone = "dark" }) => {
  const f = useCurrentFrame();
  const base = tone === "accent" ? `linear-gradient(160deg, ${theme.colors.mintLight} 0%, ${theme.colors.mint} 55%, #BBF7D0 100%)`
    : tone === "blue" ? `linear-gradient(160deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`
    : `linear-gradient(160deg, ${theme.colors.navy2} 0%, ${theme.colors.navy} 100%)`;
  const drift = (k: number, amp: number) => Math.sin((f / 30) * 0.6 + k) * amp;
  const blob = (color: string, x: number, y: number, r: number, k: number, op = 0.5) => (
    <div style={{ position: "absolute", left: x + drift(k, 40) - r / 2, top: y + drift(k + 2, 60) - r / 2, width: r, height: r, borderRadius: "50%", background: `radial-gradient(circle, ${color} 0%, rgba(0,0,0,0) 70%)`, opacity: op }} />
  );
  const gridOpacity = interpolate(f, [0, 20], [0, tone === "accent" ? 0.12 : 0.07], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: base, overflow: "hidden" }}>
      {blob(tone === "accent" ? "#FFFFFF" : theme.colors.primary, 150, 450, 1300, 0, tone === "accent" ? 0.8 : 0.45)}
      {blob(tone === "accent" ? "#86EFAC" : theme.colors.accent, 900, 1500, 1100, 1.5, 0.3)}
      {blob(tone === "dark" ? "#0E7A4A" : "#BBF7D0", 550, 950, 900, 3, 0.35)}
      <AbsoluteFill style={{ opacity: gridOpacity, backgroundImage: `linear-gradient(${tone === "accent" ? "#16A34A" : "#fff"} 1px, transparent 1px), linear-gradient(90deg, ${tone === "accent" ? "#16A34A" : "#fff"} 1px, transparent 1px)`, backgroundSize: "90px 90px" }} />
    </AbsoluteFill>
  );
};
