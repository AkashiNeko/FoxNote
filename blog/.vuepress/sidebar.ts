import { sidebar } from "vuepress-theme-hope";

export default sidebar({
    "/": [
        {
            text: "C++学习笔记",
            icon: "book",
            prefix: "posts/cpp/",
            children: [
                "classes-and-objects",
                "class-default-functions",
            ],
        },
        {
            text: "Linux操作系统",
            icon: "book",
            prefix: "posts/linux/",
            children: [
                "io-models",
                "io-select",
                "io-poll",
                "io-epoll",
            ],
        },
        {
            text: "Shell相关",
            icon: "book",
            prefix: "posts/shell/",
            children: [
                "csi-chars",
            ],
        },
    ],
});
