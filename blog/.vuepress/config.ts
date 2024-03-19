import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
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
