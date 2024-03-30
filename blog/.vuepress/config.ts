import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
import { getDirname, path } from "@vuepress/utils";
const __dirname = getDirname(import.meta.url);

export default defineUserConfig({

    alias: {
        "@theme-hope/modules/blog/components/BlogHero": path.resolve(
          __dirname,
          "./components/BlogHero.vue",
        ),
    },

    bundler: viteBundler({
        viteOptions: {},
        vuePluginOptions: {},
    }),
    base: "/",

    lang: "zh-CN",
    title: "FoxNote",
    description: "芝士狐狸",
    port: 8080,

    theme,

    // Enable it with pwa
    // shouldPrefetch: false,
});
