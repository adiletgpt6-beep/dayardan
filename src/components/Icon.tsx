import React from "react";
import type { IconName } from "../types";

const paths: Record<IconName, React.ReactNode> = {
  phone: <><rect x="14" y="4" width="36" height="56" rx="7" /><line x1="26" y1="52" x2="38" y2="52" /></>,
  check: <polyline points="12,34 26,48 52,18" />,
  chart: <><line x1="10" y1="54" x2="54" y2="54" /><rect x="16" y="32" width="8" height="18" /><rect x="30" y="20" width="8" height="30" /><rect x="44" y="10" width="8" height="40" /></>,
  book: <><path d="M10 12h18a6 6 0 0 1 6 6v36a6 6 0 0 0-6-6H10z" /><path d="M54 12H36a6 6 0 0 0-6 6v36a6 6 0 0 1 6-6h18z" /></>,
  target: <><circle cx="32" cy="32" r="24" /><circle cx="32" cy="32" r="14" /><circle cx="32" cy="32" r="4" /></>,
  list: <><line x1="22" y1="16" x2="54" y2="16" /><line x1="22" y1="32" x2="54" y2="32" /><line x1="22" y1="48" x2="54" y2="48" /><circle cx="12" cy="16" r="3" /><circle cx="12" cy="32" r="3" /><circle cx="12" cy="48" r="3" /></>,
  play: <polygon points="18,10 54,32 18,54" />,
  star: <polygon points="32,6 40,24 60,26 45,39 49,58 32,48 15,58 19,39 4,26 24,24" />,
  bolt: <polygon points="36,4 12,36 30,36 26,60 52,26 34,26" />,
  trophy: <><path d="M18 8h28v14a14 14 0 0 1-28 0z" /><path d="M18 14H8a10 10 0 0 0 10 12" /><path d="M46 14h10a10 10 0 0 1-10 12" /><line x1="32" y1="36" x2="32" y2="48" /><line x1="20" y1="56" x2="44" y2="56" /></>,
  search: <><circle cx="28" cy="28" r="16" /><line x1="40" y1="40" x2="56" y2="56" /></>,
  eye: <><path d="M4 32s10-18 28-18 28 18 28 18-10 18-28 18S4 32 4 32z" /><circle cx="32" cy="32" r="8" /></>,
  flag: <><line x1="14" y1="8" x2="14" y2="58" /><path d="M14 10h36l-8 12 8 12H14z" /></>,
  refresh: <><path d="M52 28a20 20 0 0 0-36-10" /><polyline points="14,8 16,20 28,18" /><path d="M12 36a20 20 0 0 0 36 10" /><polyline points="50,56 48,44 36,46" /></>,
  clock: <><circle cx="32" cy="32" r="24" /><polyline points="32,16 32,32 44,40" /></>,
  globe: <><circle cx="32" cy="32" r="24" /><ellipse cx="32" cy="32" rx="10" ry="24" /><line x1="8" y1="32" x2="56" y2="32" /></>,
  arrow: <><line x1="8" y1="32" x2="52" y2="32" /><polyline points="36,16 52,32 36,48" /></>,
  x: <><line x1="14" y1="14" x2="50" y2="50" /><line x1="50" y1="14" x2="14" y2="50" /></>,
  heart: <path d="M32 56S6 40 6 22a13 13 0 0 1 26-4 13 13 0 0 1 26 4c0 18-26 34-26 34z" />,
  user: <><circle cx="32" cy="22" r="12" /><path d="M8 58a24 24 0 0 1 48 0" /></>,
};

export const Icon: React.FC<{ name: IconName; size?: number; color?: string; stroke?: number }> = ({ name, size = 64, color = "#fff", stroke = 4 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    {paths[name]}
  </svg>
);
