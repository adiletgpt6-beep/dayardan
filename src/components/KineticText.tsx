import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { theme } from "../theme";
import { fitFontSize } from "../lib/text";

/** Динамическая типографика: слова вылетают по очереди. */
export const KineticText: React.FC<{ text: string; size?: number; color?: string; maxWidth?: number; delay?: number; align?: "center" | "left"; weight?: number; stagger?: number; highlight?: string }> =
  ({ text, size = 120, color = "#fff", maxWidth = 940, delay = 0, align = "center", weight = 900, stagger = 3, highlight }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const fs = fitFontSize(text, maxWidth, size);
    const words = text.split(" ");
    return (
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: align === "center" ? "center" : "flex-start", gap: `${fs * 0.08}px ${fs * 0.25}px`, maxWidth, fontFamily: theme.fonts.body, fontWeight: weight, fontSize: fs, lineHeight: 1.08, color, textAlign: align, letterSpacing: -fs * 0.02 }}>
        {words.map((w, i) => {
          const s = spring({ frame: frame - delay - i * stagger, fps, config: { damping: 14, stiffness: 160, mass: 0.7 } });
          const y = interpolate(s, [0, 1], [60, 0]);
          const isHl = highlight && w.replace(/[^\p{L}\p{N}]/gu, "").toLowerCase() === highlight.toLowerCase();
          return (
            <span key={i} style={{ display: "inline-block", transform: `translateY(${y}px) scale(${0.8 + 0.2 * s})`, opacity: s, color: isHl ? theme.colors.accent : color }}>{w}</span>
          );
        })}
      </div>
    );
  };
