import React from "react";
import { theme } from "../theme";

/** Текстовый знак Dayardan (логотип сайта недоступен — используется только название). */
export const Wordmark: React.FC<{ size?: number; color?: string; dot?: string }> = ({ size = 96, color = "#fff", dot = theme.colors.accent }) => (
  <div style={{ fontFamily: theme.fonts.body, fontWeight: 900, fontSize: size, color, letterSpacing: -size * 0.04, lineHeight: 1, display: "flex", alignItems: "baseline" }}>
    Dayardan<span style={{ color: dot }}>.</span>
  </div>
);
