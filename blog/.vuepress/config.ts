import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
    base: "/",

    lang: "zh-CN",
    title: "FoxNote",
    description: "芝士狐狸",
    port: 8080,

    theme,

    // Enable it with pwa
    // shouldPrefetch: false,
});
