export type IconName =
  | "phone" | "check" | "chart" | "book" | "target" | "list" | "play" | "star" | "bolt"
  | "trophy" | "search" | "eye" | "flag" | "refresh" | "clock" | "globe" | "arrow" | "x" | "heart" | "user";

export type Pt = { x?: number; y?: number; box?: string; at?: number }; // x,y — доли экрана (0..1) ИЛИ box — имя элемента из manifest.boxes; at — сек от начала сцены

interface SceneBase {
  /** Текст, который диктор произносит в этой сцене (используется для TTS и тайминга). */
  say: string;
  type: string;
}
export interface HookScene extends SceneBase { type: "hook"; title: string; sub?: string; tone?: "accent" | "dark" | "blue"; }
export interface StatementScene extends SceneBase { type: "statement"; lines: string[]; icon?: IconName; tone?: "accent" | "dark" | "blue"; }
export interface TitleScene extends SceneBase { type: "title"; kicker: string; title: string; }
export interface PhoneScene extends SceneBase {
  type: "phone";
  /** ключ в recordings/manifest.json (home, how-it-works, ...) */
  screen: string;
  screenTitle: string;
  screenLines?: string[];
  button?: string;
  caption?: string;
  cursor?: Pt[];
  highlight?: { x?: number; y?: number; w?: number; h?: number; box?: string; at?: number };
  zoom?: { x?: number; y?: number; box?: string; scale: number; at?: number };
  /** секунда записи, с которой начать видео-захват */
  startFrom?: number;
  tone?: "accent" | "dark" | "blue";
}
export interface StepsScene extends SceneBase { type: "steps"; title?: string; items: string[]; }
export interface FeaturesScene extends SceneBase { type: "features"; title?: string; items: { icon: IconName; label: string }[]; }
export interface CtaScene extends SceneBase { type: "cta"; title: string; sub?: string; button: string; }

export type Scene = HookScene | StatementScene | TitleScene | PhoneScene | StepsScene | FeaturesScene | CtaScene;

export interface VideoConfig {
  id: string;
  title: string;
  kind: "ad" | "tutorial";
  voice: string; // ElevenLabs voice id
  description?: string;
  scenes: Scene[];
}

export interface WordTiming { w: string; s: number; e: number; }
export interface Timing {
  audio: string; // путь относительно public/
  fps: number;
  leadSec: number;
  speechEndSec: number;
  totalSec: number;
  totalFrames: number;
  tempo: number;
  words: WordTiming[];
  scenes: { start: number; end: number }[]; // секунды (с учётом leadSec)
}

export interface CaptureBox { x: number; y: number; w: number; h: number; }
export interface CaptureEntry { type: "image" | "video"; file: string; url: string; capturedAt: string; note?: string; boxes?: Record<string, CaptureBox>; durationSec?: number; }
export type CaptureManifest = Record<string, CaptureEntry>;

export interface GeneratedVideo { config: VideoConfig; timing: Timing | null; }
