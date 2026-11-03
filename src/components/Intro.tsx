import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { Background } from "./Background";
import { Wordmark } from "./Wordmark";
import { theme } from "../theme";
import { fitFontSize } from "../lib/text";

/** Заставка обучающего ролика: номер урока + название. */
export const Intro: React.FC<{ kicker: string; title: string }> = ({ kicker, title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s1 = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const s2 = spring({ frame: frame - 8, fps, config: { damping: 14, stiffness: 120 } });
  const s3 = spring({ frame: frame - 16, fps, config: { damping: 14, stiffness: 120 } });
  const line = interpolate(s2, [0, 1], [0, 420]);
  const fs = fitFontSize(title, 900, 108);
  return (
    <AbsoluteFill>
      <Background tone="blue" />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.body, padding: 80 }}>
        <div style={{ transform: `scale(${0.6 + 0.4 * s1})`, opacity: s1 }}><Wordmark size={110} /></div>
        <div style={{ width: line, height: 10, borderRadius: 5, background: theme.colors.accent, margin: "50px 0" }} />
        <div style={{ opacity: s2, transform: `translateY(${(1 - s2) * 40}px)`, fontSize: 44, fontWeight: 700, color: theme.colors.accent, letterSpacing: 4, textTransform: "uppercase" }}>{kicker}</div>
        <div style={{ opacity: s3, transform: `translateY(${(1 - s3) * 40}px)`, marginTop: 30, fontSize: fs, fontWeight: 900, color: "#fff", textAlign: "center", lineHeight: 1.1, maxWidth: 940 }}>{title}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
