import { sidebar } from "vuepress-theme-hope";

export default sidebar({
    "/": [
        {
            text: "C++学习笔记",
            icon: "/icon/cpp.svg",
            link: "/cpp/",
            prefix: "cpp/",
            children: "structure",
        },
        {
            text: "Linux操作系统",
            icon: "/icon/shell.svg",
            link: "/linux/",
            prefix: "linux/",
            children: "structure",
        },
        {
            text: "数据持久化",
            icon: "/icon/db.svg",
            link: "/db/",
            prefix: "db/",
            children: "structure",
        },
        {
            text: "小狐狸的随笔",
            icon: "/icon/pen.svg",
            link: "/note/",
            prefix: "note/",
            children: "structure",
        },
    ],
});
