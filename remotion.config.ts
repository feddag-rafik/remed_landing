import { Config } from "@remotion/cli/config";
import { resolve } from "node:path";

Config.setPublicDir("public");
Config.overrideWebpackConfig(config => ({
  ...config,
  resolve: {
    ...config.resolve,
    // The shared Remed stylesheet uses the website's absolute public font URL.
    alias: { ...config.resolve?.alias, "/landing/fonts": resolve(process.cwd(), "public/landing/fonts") },
  },
}));
