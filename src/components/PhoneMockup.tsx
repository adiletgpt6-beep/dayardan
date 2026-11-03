import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const PHONE = { w: 640, h: 1320, radius: 76, bezel: 18 };
export const SCREEN = { w: PHONE.w - PHONE.bezel * 2, h: PHONE.h - PHONE.bezel * 2 };

/** Анимированный смартфон: влетает с лёгким 3D-наклоном, внутри — children (экран). */
export const PhoneMockup: React.FC<{ children: React.ReactNode; x?: number; y?: number; scale?: number; tilt?: boolean }> = ({ children, x = (1080 - PHONE.w) / 2, y = 250, scale = 1, tilt = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 16, stiffness: 90, mass: 1 } });
  const rotY = tilt ? interpolate(s, [0, 1], [-28, -6]) + Math.sin(frame / 40) * 2 : 0;
  const ty = interpolate(s, [0, 1], [240, 0]);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: PHONE.w, height: PHONE.h, perspective: 2200, transform: `scale(${scale})`, transformOrigin: "top center" }}>
      <div style={{ width: "100%", height: "100%", transform: `translateY(${ty}px) rotateY(${rotY}deg)`, opacity: s, transformStyle: "preserve-3d" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: PHONE.radius, background: "linear-gradient(145deg,#2a2f3a,#0d1017)", boxShadow: "0 40px 90px rgba(0,0,0,0.55), inset 0 0 0 3px #3a4150" }} />
        <div style={{ position: "absolute", left: PHONE.bezel, top: PHONE.bezel, width: SCREEN.w, height: SCREEN.h, borderRadius: PHONE.radius - PHONE.bezel, overflow: "hidden", background: "#fff" }}>
          {children}
        </div>
        {/* dynamic island */}
        <div style={{ position: "absolute", left: PHONE.w / 2 - 80, top: PHONE.bezel + 16, width: 160, height: 42, borderRadius: 999, background: "#0d1017" }} />
      </div>
    </div>
  );
};
