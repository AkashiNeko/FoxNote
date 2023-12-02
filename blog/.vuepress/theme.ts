import { hopeTheme } from "vuepress-theme-hope";
import navbar from "./navbar.js";
import sidebar from "./sidebar.js";

export default hopeTheme({
    hostname: "https://mister-hope.github.io",

    author: {
        name: "AkashiNeko",
        url: "http://akashi.top:1080",
        email: "akashineko@qq.com",
    },

    iconAssets: "fontawesome-with-brands",

    logo: "/logo/akashi.jpg",

    repo: "AkashiNeko/foxnote",

    docsDir: "blog",

    // navbar
    navbar,

    // sidebar
    sidebar,

    footer: "qwq",

    displayFooter: true,

    blog: {
        description: "qwq",
        // intro: "/.html",
        roundAvatar: true,
        medias: {
            GitHub: "https://github.com/AkashiNeko",
            BiliBili: "https://space.bilibili.com/107816649",
            Email: "mailto:akashineko@qq.com",
            Gmail: "mailto:akashinekof@gmail.com",
            QQ: "https://qm.qq.com/q/nd2UQjxTFe",
            Qzone: "https://user.qzone.qq.com/1006554341/main",
        },
    },

    // encrypt: {
    //     config: {
    //         "/demo/encrypt.html": ["1234"],
    //     },
    // },

    // page meta
    metaLocales: {
        editLink: "编辑此页",
    },

    plugins: {
        blog: true,

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
            // echarts: true,

            figure: true,

            // install flowchart.ts before enabling it
            // flowchart: true,

            // gfm requires mathjax-full to provide tex support
            // gfm: true,

            imgLazyload: true,
            imgSize: true,
            include: true,

            // install katex before enabling it
            // katex: true,

            // install mathjax-full before enabling it
            // mathjax: true,

            mark: true,

            // install mermaid before enabling it
            // mermaid: true,

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
});
