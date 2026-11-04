import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { theme } from "../theme";
import { Icon } from "./Icon";

/** Кнопка-призыв в стиле кнопок сайта (#16A34A, белый текст, скругление) + бейдж с адресом. */
export const CallToAction: React.FC<{ label: string; delay?: number; url?: boolean }> = ({ label, delay = 0, url = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 150 } });
  const pulse = 1 + 0.03 * Math.sin((frame - delay) / 6);
  const shine = interpolate((frame - delay) % 60, [0, 60], [-300, 900]);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34, fontFamily: theme.fonts.body }}>
      <div style={{ position: "relative", overflow: "hidden", transform: `scale(${s * pulse})`, opacity: s, background: theme.colors.primary, color: "#fff", fontWeight: 800, fontSize: 60, padding: "34px 80px", borderRadius: 36, boxShadow: `0 20px 60px rgba(22,163,74,0.45)`, display: "flex", alignItems: "center", gap: 24 }}>
        {label} <Icon name="arrow" size={56} color="#fff" stroke={6} />
        <div style={{ position: "absolute", top: 0, bottom: 0, left: shine, width: 120, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)", transform: "skewX(-20deg)" }} />
      </div>
      {url && (
        <div style={{ opacity: s, fontSize: 54, fontWeight: 800, color: "#fff", display: "flex", alignItems: "center", gap: 18, background: "rgba(255,255,255,0.14)", padding: "18px 44px", borderRadius: 999 }}>
          <Icon name="globe" size={52} /> {theme.brand.url}
        </div>
      )}
    </div>
  );
};
