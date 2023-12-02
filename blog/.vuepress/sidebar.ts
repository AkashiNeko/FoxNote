import { sidebar } from "vuepress-theme-hope";

export default sidebar({
    "/": [
        {
            text: "C++",
            icon: "book",
            prefix: "posts/cpp/",
            children: "structure",
        },
        {
            text: "Linux",
            icon: "book",
            prefix: "posts/linux/",
            children: "structure",
        },
    ],
});
