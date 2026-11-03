import React from "react";
import { Img, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import type { CaptureManifest } from "../types";
import { theme } from "../theme";
import { Icon } from "./Icon";
import captures from "../generated/captures.json";

const manifest = captures as CaptureManifest;

/**
 * Содержимое экрана телефона.
 * Если в recordings/manifest.json есть реальный захват сайта (screenshot/запись) — показывается он.
 * Иначе — нейтральная моушн-карточка (адрес сайта + название шага), НЕ имитация интерфейса.
 */
export const ScreenRecording: React.FC<{ screen: string; title: string; lines?: string[]; button?: string; width: number; height: number }> = ({ screen, title, lines = [], button, width, height }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entry = manifest[screen];
  if (entry) {
    const src = staticFile(`captures/${entry.file.replace(/^(screenshots|recordings)\//, "")}`);
    const drift = interpolate(frame, [0, fps * 6], [0, -0.12], { extrapolateRight: "clamp" });
    return (
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#fff" }}>
        {entry.type === "video" ? (
          <OffthreadVideo src={src} style={{ width, height, objectFit: "cover" }} muted />
        ) : (
          <Img src={src} style={{ width, position: "absolute", top: 0, transform: `translateY(${drift * height}px)` }} />
        )}
      </div>
    );
  }
  // --- fallback: motion-card ---
  const s = (i: number) => spring({ frame: frame - 6 - i * 5, fps, config: { damping: 15, stiffness: 140 } });
  return (
    <div style={{ position: "absolute", inset: 0, background: theme.colors.screenBg, fontFamily: theme.fonts.body, overflow: "hidden" }}>
      {/* адресная строка */}
      <div style={{ position: "absolute", top: height * 0.045, left: width * 0.06, right: width * 0.06, height: height * 0.045, borderRadius: 999, background: "#fff", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontSize: width * 0.04, color: theme.colors.screenText, fontWeight: 600 }}>
        <Icon name="globe" size={width * 0.045} color={theme.colors.primary} stroke={5} /> {theme.brand.url}
      </div>
      <div style={{ position: "absolute", top: height * 0.12, left: width * 0.07, right: width * 0.07 }}>
        <div style={{ fontWeight: 900, fontSize: width * 0.085, color: theme.colors.primary, lineHeight: 1.05, transform: `translateY(${(1 - s(0)) * 30}px)`, opacity: s(0) }}>{theme.brand.name}<span style={{ color: theme.colors.accent2 }}>.</span></div>
        <div style={{ marginTop: height * 0.03, fontWeight: 800, fontSize: width * 0.072, color: theme.colors.screenText, lineHeight: 1.12, transform: `translateY(${(1 - s(1)) * 30}px)`, opacity: s(1) }}>{title}</div>
        <div style={{ marginTop: height * 0.025, display: "flex", flexDirection: "column", gap: height * 0.012 }}>
          {lines.map((l, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 18, padding: `${height * 0.016}px ${width * 0.05}px`, fontSize: width * 0.05, fontWeight: 600, color: theme.colors.screenText, boxShadow: "0 2px 12px rgba(37,99,235,0.08)", display: "flex", alignItems: "center", gap: 14, transform: `translateX(${(1 - s(2 + i)) * -40}px)`, opacity: s(2 + i) }}>
              <span style={{ width: width * 0.045, height: width * 0.045, borderRadius: "50%", background: theme.colors.primary, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="check" size={width * 0.03} stroke={7} /></span>{l}
            </div>
          ))}
        </div>
      </div>
      {button && (
        <div style={{ position: "absolute", left: width * 0.08, right: width * 0.08, top: height * 0.80, height: height * 0.07, borderRadius: 999, background: theme.colors.primary, color: "#fff", fontWeight: 800, fontSize: width * 0.055, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 30px rgba(37,99,235,0.35)", transform: `scale(${0.9 + 0.1 * s(3)})`, opacity: s(3) }}>{button}</div>
      )}
    </div>
  );
};
