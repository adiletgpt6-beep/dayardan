import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import type { WordTiming } from "../types";
import { chunkWords } from "../lib/subtitles";
import { theme } from "../theme";

/** Караоке-субтитры: активное слово подсвечивается, строки совпадают с речью диктора. */
export const DynamicSubtitles: React.FC<{ words: WordTiming[]; y?: number; light?: boolean }> = ({ words, y = theme.layout.subtitleY, light = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const chunks = useMemo(() => chunkWords(words), [words]);
  const chunk = chunks.find((c) => t >= c.start && t < c.end);
  if (!chunk) return null;
  const inOp = interpolate(t, [chunk.start, chunk.start + 0.12], [0, 1], { extrapolateRight: "clamp" });
  const pop = interpolate(t, [chunk.start, chunk.start + 0.15], [0.94, 1], { extrapolateRight: "clamp" });
  const longest = chunk.words.reduce((a, b) => Math.max(a, b.w.length), 0);
  const fs = Math.min(66, Math.max(44, 940 / Math.max(longest, 8) / 0.62));
  return (
    <div style={{ position: "absolute", top: y, left: 60, right: 60, display: "flex", justifyContent: "center", opacity: inOp, transform: `scale(${pop})` }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: `0 ${fs * 0.28}px`, padding: "22px 40px", borderRadius: 32, background: light ? "rgba(255,255,255,0.92)" : "rgba(5,10,35,0.78)", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: fs, lineHeight: 1.25, color: light ? theme.colors.screenText : "#fff", textAlign: "center", maxWidth: 980 }}>
        {chunk.words.map((w, i) => {
          const active = t >= w.s && t < Math.max(w.e, w.s + 0.18);
          const done = t >= w.e;
          return (
            <span key={i} style={{ color: active ? theme.colors.accent : done ? (light ? theme.colors.primary : "#fff") : (light ? "#64748B" : "rgba(255,255,255,0.6)"), transform: `scale(${active ? 1.08 : 1})`, display: "inline-block", transition: "none" }}>{w.w}</span>
          );
        })}
      </div>
    </div>
  );
};
