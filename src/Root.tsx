import React from "react";
import { Composition } from "remotion";
import { DayardanVideo } from "./compositions/DayardanVideo";
import videos from "./generated/videos.json";
import type { GeneratedVideo } from "./types";

const FPS = 30;
const list = videos as unknown as GeneratedVideo[];

export const RemotionRoot: React.FC = () => (
  <>
    {list.map(({ config, timing }) => (
      <Composition
        key={config.id}
        id={config.id}
        component={DayardanVideo}
        durationInFrames={timing ? timing.totalFrames : 57 * FPS}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ config, timing }}
      />
    ))}
  </>
);
