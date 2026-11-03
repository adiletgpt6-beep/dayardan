import { Config } from "@remotion/cli/config";

// Use the pre-installed Chromium instead of downloading Chrome Headless Shell.
Config.setBrowserExecutable(
  process.env.REMOTION_BROWSER_EXECUTABLE || "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell"
);
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(90);
Config.setConcurrency(4);
Config.setOverwriteOutput(true);
Config.setChromiumOpenGlRenderer("swangle");
Config.setPublicDir("./public");
