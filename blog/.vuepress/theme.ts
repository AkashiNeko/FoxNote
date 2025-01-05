import { hopeTheme } from "vuepress-theme-hope";
import navbar from "./navbar.js";
import sidebar from "./sidebar.js";

export default hopeTheme({
    hostname: "https://akashi.top/",

    author: {
        name: "AkashiNeko",
        url: "https://akashi.top",
        email: "akashineko@foxmail.com",
    },

    favicon: "/favicon.ico",

    iconAssets: "fontawesome-with-brands",

    logo: "/logo/akashi.jpg",

    repo: "AkashiNeko/FoxNote",

    docsDir: "blog",

    // navbar
    navbar,

    // sidebar
    sidebar,

    footer: "FoxNote | 芝士狐狸",

    copyright: 'Copyright © 2023 <a href="https://github.com/AkashiNeko">AkashiNeko</a> | Licensed under <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0<img style="height:16px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"><img style="height:16px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"><img style="height:16px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1"><img style="height:16px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/sa.svg?ref=chooser-v1"></a>',

    displayFooter: true,

    // backToTop: true,

    blog: {
        name: "AkashiNeko",

        description: "akashineko@foxmail.com",
        timeline: "qwq",
        roundAvatar: true,
        medias: {
            GitHub: ["https://github.com/AkashiNeko", "./blog/.vuepress/intro_icon/github.svg"],
            // LeetCode: ["https://leetcode.cn/u/akashineko/", "./blog/.vuepress/intro_icon/leetcode.svg"],
            // QQ: ["https://wpa.qq.com/msgrd?v=3&uin=1006554341&site=qq&menu=yes&jumpflag=1", "./blog/.vuepress/intro_icon/qq.svg"],
            // BiliBili: ["https://space.bilibili.com/107816649", "./blog/.vuepress/intro_icon/bilibili.svg"],
            // Qzone: ["https://user.qzone.qq.com/1006554341/main", "./blog/.vuepress/intro_icon/qzone.svg"],
            // CSDN: ["https://blog.csdn.net/qq_45412824", "./blog/.vuepress/intro_icon/csdn.svg"],
        },
    },

    navTitle: "FoxNote",

    // page meta
    lastUpdated: false,

    pageInfo: ["Author", "Original", "Date", "Category", "Tag"],

    metaLocales: {
        // editLink: "编辑此页",
    },

    home: "/",

    plugins: {

        prismjs: {
            light: "vs",
            dark: "vsc-dark-plus",
        },
        // prismjs: false,

        blog: {
            excerptLength: 0,
        },

        // install @waline/client before enabling it
        // WARNING: This is a test server for demo only.
        // You should create and use your own comment service in production.
        // comment: {
        //   provider: "Waline",
        //   serverURL: "https://waline-comment.vuejs.press",
        // },

        // all features are enabled for demo, only preserve features you need here
        mdEnhance: {
            align: true,
            attrs: true,

            // install chart.js before enabling it
            // chart: true,

            codetabs: true,

            // insert component easily
            // component: true,

            demo: true,

            // install echarts before enabling it
            echarts: true,

            figure: true,

            // install flowchart.ts before enabling it
            // flowchart: true,

            // gfm requires mathjax-full to provide tex support
            // gfm: true,

            imgLazyload: true,
            imgSize: true,
            include: true,

            // install katex before enabling it
            katex: true,

            // install mathjax-full before enabling it
            mathjax: true,

            mark: true,

            // install mermaid before enabling it
            mermaid: true,

            playground: {
                presets: ["ts", "vue"],
            },

            // install reveal.js before enabling it
            // revealJs: {
            //   plugins: ["highlight", "math", "search", "notes", "zoom"],
            // },

            stylize: [
                {
                    matcher: "Recommended",
                    replacer: ({ tag }) => {
                        if (tag === "em")
                            return {
                                tag: "Badge",
                                attrs: { type: "tip" },
                                content: "Recommended",
                            };
                    },
                },
            ],
            sub: true,
            sup: true,
            tabs: true,
            vPre: true,

            // install @vue/repl before enabling it
            // vuePlayground: true,
        },
    },
}, {custom: true});
