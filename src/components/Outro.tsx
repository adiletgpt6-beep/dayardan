import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { Background } from "./Background";
import { Wordmark } from "./Wordmark";
import { CallToAction } from "./CallToAction";
import { theme } from "../theme";
import { fitFontSize } from "../lib/text";

/** Финальный экран: знак, слоган/заголовок, кнопка CTA, адрес. */
export const Outro: React.FC<{ title: string; sub?: string; button: string }> = ({ title, sub, button }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s1 = spring({ frame, fps, config: { damping: 14, stiffness: 110 } });
  const s2 = spring({ frame: frame - 10, fps, config: { damping: 14, stiffness: 110 } });
  const ring = interpolate(frame, [0, 50], [0, 1.6], { extrapolateRight: "clamp" });
  const fs = fitFontSize(title, 920, 100);
  return (
    <AbsoluteFill>
      <Background tone="blue" />
      <div style={{ position: "absolute", left: 540 - 400 * ring, top: 700 - 400 * ring, width: 800 * ring, height: 800 * ring, borderRadius: "50%", border: "6px solid rgba(255,255,255,0.15)", opacity: 1 - ring / 1.7 }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 60, padding: 80, fontFamily: theme.fonts.body }}>
        <div style={{ transform: `scale(${0.5 + 0.5 * s1})`, opacity: s1 }}><Wordmark size={130} /></div>
        <div style={{ opacity: s2, transform: `translateY(${(1 - s2) * 50}px)`, fontSize: fs, fontWeight: 900, color: "#fff", textAlign: "center", lineHeight: 1.1, maxWidth: 940 }}>{title}</div>
        {sub && <div style={{ opacity: s2, fontSize: 48, fontWeight: 600, color: theme.colors.offWhite, textAlign: "center", maxWidth: 900, lineHeight: 1.3 }}>{sub}</div>}
        <CallToAction label={button} delay={18} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
