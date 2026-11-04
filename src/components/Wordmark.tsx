import React from "react";
import { Img, staticFile } from "remotion";
import { theme } from "../theme";

/** Знак Dayardan: реальный логотип сайта (public/brand/logo.png) + надпись DAYARDAN в стиле сайта. */
export const Wordmark: React.FC<{ size?: number; color?: string; dot?: string }> = ({ size = 96, color = "#fff" }) => (
  <div style={{ display: "flex", alignItems: "center", gap: size * 0.22, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: size, color, letterSpacing: size * 0.01, lineHeight: 1 }}>
    <Img src={staticFile(theme.brand.logo)} style={{ width: size * 1.15, height: size * 1.15, objectFit: "contain" }} />
    <span>{theme.brand.name}</span>
  </div>
);
