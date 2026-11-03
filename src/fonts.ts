import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

const weights = [400, 600, 700, 800, 900] as const;
const subsets = ["latin", "cyrillic", "cyrillic-ext"] as const;

let loaded: Promise<void> | null = null;
export const ensureFonts = () => {
  if (!loaded) {
    loaded = Promise.all(
      weights.flatMap((w) =>
        subsets.map((s) =>
          loadFont({ family: "Inter", url: staticFile(`fonts/inter-${s}-${w}-normal.woff2`), weight: String(w), format: "woff2" })
        )
      )
    ).then(() => undefined);
  }
  return loaded;
};
