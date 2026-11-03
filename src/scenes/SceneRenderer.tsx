import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import type { Scene } from "../types";
import { theme } from "../theme";
import { Background } from "../components/Background";
import { KineticText } from "../components/KineticText";
import { Icon } from "../components/Icon";
import { PhoneMockup, SCREEN } from "../components/PhoneMockup";
import { ScreenRecording } from "../components/ScreenRecording";
import { AnimatedCursor } from "../components/AnimatedCursor";
import { ButtonHighlight } from "../components/ButtonHighlight";
import { ZoomEffect } from "../components/ZoomEffect";
import { Intro } from "../components/Intro";
import { Outro } from "../components/Outro";
import { Wordmark } from "../components/Wordmark";
import { fitFontSize } from "../lib/text";

const TopBrand: React.FC<{ dark?: boolean }> = ({ dark }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 20, stiffness: 120 } });
  return (
    <div style={{ position: "absolute", top: theme.layout.safeTop - 40, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: s }}>
      <Wordmark size={54} color={dark ? theme.colors.navy : "#fff"} dot={dark ? theme.colors.primary : theme.colors.accent} />
    </div>
  );
};

const Hook: React.FC<Extract<Scene, { type: "hook" }>> = ({ title, sub, tone = "accent" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dark = tone === "accent";
  const s = spring({ frame: frame - 14, fps, config: { damping: 14, stiffness: 120 } });
  const flash = interpolate(frame, [0, 6, 14], [1, 0.6, 0], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Background tone={tone} />
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
      <TopBrand dark={dark} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 70, gap: 50 }}>
        <KineticText text={title} size={128} color={dark ? theme.colors.navy : "#fff"} stagger={4} />
        {sub && <div style={{ opacity: s, transform: `translateY(${(1 - s) * 30}px)`, fontFamily: theme.fonts.body, fontWeight: 700, fontSize: fitFontSize(sub, 900, 56), color: dark ? theme.colors.navy : theme.colors.accent, textAlign: "center", maxWidth: 900, lineHeight: 1.25 }}>{sub}</div>}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Statement: React.FC<Extract<Scene, { type: "statement" }>> = ({ lines, icon, tone = "dark" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dark = tone === "accent";
  const si = spring({ frame, fps, config: { damping: 10, stiffness: 150 } });
  return (
    <AbsoluteFill>
      <Background tone={tone} />
      <TopBrand dark={dark} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 80, gap: 60 }}>
        {icon && (
          <div style={{ width: 230, height: 230, borderRadius: 60, background: dark ? theme.colors.navy : "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${si}) rotate(${(1 - si) * -20}deg)`, boxShadow: "0 30px 60px rgba(0,0,0,0.3)" }}>
            <Icon name={icon} size={140} color={theme.colors.accent} stroke={4} />
          </div>
        )}
        {lines.map((l, i) => (
          <KineticText key={i} text={l} size={i === 0 ? 104 : 72} weight={i === 0 ? 900 : 700} color={i === 0 ? (dark ? theme.colors.navy : "#fff") : (dark ? theme.colors.navy : theme.colors.offWhite)} delay={i * 10 + 4} stagger={3} />
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Phone: React.FC<Extract<Scene, { type: "phone" }>> = (p) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dark = p.tone === "accent";
  const cap = spring({ frame: frame - 12, fps, config: { damping: 16, stiffness: 120 } });
  const inner = (
    <>
      <ScreenRecording screen={p.screen} title={p.screenTitle} lines={p.screenLines} button={p.button} width={SCREEN.w} height={SCREEN.h} />
      {p.highlight && <ButtonHighlight {...p.highlight} width={SCREEN.w} height={SCREEN.h} />}
      {p.cursor && <AnimatedCursor points={p.cursor} width={SCREEN.w} height={SCREEN.h} />}
    </>
  );
  return (
    <AbsoluteFill>
      <Background tone={p.tone ?? "dark"} />
      <TopBrand dark={dark} />
      <PhoneMockup y={230} scale={0.9}>
        {p.zoom ? <ZoomEffect {...p.zoom}>{inner}</ZoomEffect> : inner}
      </PhoneMockup>
      {p.caption && (
        <div style={{ position: "absolute", top: 1300, left: 70, right: 70, display: "flex", justifyContent: "center", opacity: cap, transform: `translateY(${(1 - cap) * 40}px)` }}>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: fitFontSize(p.caption, 900, 58), color: dark ? theme.colors.navy : "#fff", background: dark ? "rgba(255,255,255,0.7)" : theme.colors.primary, padding: "22px 44px", borderRadius: 28, textAlign: "center", lineHeight: 1.2, boxShadow: "0 16px 40px rgba(0,0,0,0.25)" }}>{p.caption}</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

const Steps: React.FC<Extract<Scene, { type: "steps" }>> = ({ title, items }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <Background tone="dark" />
      <TopBrand />
      <AbsoluteFill style={{ padding: "0 80px", justifyContent: "center", gap: 36, fontFamily: theme.fonts.body }}>
        {title && <div style={{ marginBottom: 20 }}><KineticText text={title} size={92} /></div>}
        {items.map((it, i) => {
          const s = spring({ frame: frame - 10 - i * 12, fps, config: { damping: 14, stiffness: 130 } });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 36, background: "rgba(255,255,255,0.08)", border: "2px solid rgba(255,255,255,0.12)", borderRadius: 36, padding: "30px 40px", transform: `translateX(${(1 - s) * 120}px)`, opacity: s }}>
              <div style={{ width: 110, height: 110, borderRadius: 32, background: theme.colors.accent, color: theme.colors.navy, fontWeight: 900, fontSize: 64, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
              <div style={{ fontWeight: 800, fontSize: fitFontSize(it, 720, 60, 40), color: "#fff", lineHeight: 1.2 }}>{it}</div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Features: React.FC<Extract<Scene, { type: "features" }>> = ({ title, items }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <Background tone="blue" />
      <TopBrand />
      <AbsoluteFill style={{ padding: "0 70px", justifyContent: "center", gap: 40, fontFamily: theme.fonts.body }}>
        {title && <div style={{ marginBottom: 10 }}><KineticText text={title} size={92} /></div>}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 }}>
          {items.map((it, i) => {
            const s = spring({ frame: frame - 8 - i * 7, fps, config: { damping: 12, stiffness: 140 } });
            return (
              <div key={i} style={{ background: "rgba(255,255,255,0.1)", borderRadius: 40, padding: 36, display: "flex", flexDirection: "column", alignItems: "center", gap: 24, transform: `scale(${s})`, opacity: s, minHeight: 300, justifyContent: "center" }}>
                <Icon name={it.icon} size={120} color={theme.colors.accent} />
                <div style={{ fontWeight: 800, fontSize: fitFontSize(it.label, 380, 46, 34), color: "#fff", textAlign: "center", lineHeight: 1.2 }}>{it.label}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const SceneRenderer: React.FC<{ scene: Scene }> = ({ scene }) => {
  switch (scene.type) {
    case "hook": return <Hook {...scene} />;
    case "statement": return <Statement {...scene} />;
    case "title": return <Intro kicker={scene.kicker} title={scene.title} />;
    case "phone": return <Phone {...scene} />;
    case "steps": return <Steps {...scene} />;
    case "features": return <Features {...scene} />;
    case "cta": return <Outro title={scene.title} sub={scene.sub} button={scene.button} />;
    default: return null;
  }
};
