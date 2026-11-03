import React from "react";
import { AbsoluteFill, Sequence, Audio, staticFile, useCurrentFrame, useVideoConfig, interpolate, continueRender, delayRender } from "remotion";
import type { VideoConfig, Timing } from "../types";
import { SceneRenderer } from "../scenes/SceneRenderer";
import { DynamicSubtitles } from "../components/DynamicSubtitles";
import { ensureFonts } from "../fonts";

const XFADE = 10; // кадров перекрытия между сценами

const SceneWrap: React.FC<{ from: number; dur: number; children: React.ReactNode; hasSfx: boolean }> = ({ from, dur, children, hasSfx }) => {
  const frame = useCurrentFrame();
  const local = frame - from;
  const op = interpolate(local, [0, XFADE], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(local, [0, XFADE], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Sequence from={from} durationInFrames={dur} layout="none">
      <AbsoluteFill style={{ opacity: op, transform: `translateY(${y}px)` }}>{children}</AbsoluteFill>
      {hasSfx && <Audio src={staticFile("sfx/whoosh.wav")} volume={0.22} />}
    </Sequence>
  );
};

export const DayardanVideo: React.FC<{ config: VideoConfig; timing: Timing | null }> = ({ config, timing }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const [handle] = React.useState(() => delayRender("fonts"));
  React.useEffect(() => { ensureFonts().then(() => continueRender(handle)); }, [handle]);

  // Если тайминг ещё не создан (нет озвучки) — делим длительность поровну.
  const n = config.scenes.length;
  const bounds = config.scenes.map((_, i) => {
    if (timing) {
      const s = timing.scenes[i];
      return { from: Math.round(s.start * fps), to: i === n - 1 ? durationInFrames : Math.round(timing.scenes[i + 1].start * fps) };
    }
    return { from: Math.round((i * durationInFrames) / n), to: Math.round(((i + 1) * durationInFrames) / n) };
  });

  return (
    <AbsoluteFill style={{ background: "#0B1437" }}>
      {config.scenes.map((scene, i) => (
        <SceneWrap key={i} from={bounds[i].from} dur={bounds[i].to - bounds[i].from + (i < n - 1 ? XFADE : 0)} hasSfx={i > 0 && scene.type !== "cta"}>
          <SceneRenderer scene={scene} />
        </SceneWrap>
      ))}
      {timing && (
        <>
          <Sequence from={Math.round(timing.leadSec * fps)} layout="none">
            <Audio src={staticFile(timing.audio)} />
          </Sequence>
          <Sequence from={bounds[n - 1].from} layout="none">
            <Audio src={staticFile("sfx/success.wav")} volume={0.25} />
          </Sequence>
          <DynamicSubtitles words={timing.words} />
        </>
      )}
    </AbsoluteFill>
  );
};
