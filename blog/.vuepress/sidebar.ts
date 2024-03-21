import { sidebar } from "vuepress-theme-hope";

export default sidebar({
    "/": [
        {
            text: "C++学习笔记",
            icon: "/icon/cpp/cpp.svg",
            link: "/cpp/",
            prefix: "cpp/",
            children: "structure",
        },
        {
            text: "Linux操作系统",
            icon: "/icon/linux/linux.svg",
            link: "/linux/",
            prefix: "linux/",
            children: "structure",
        },
        {
            text: "数据库技术",
            icon: "/icon/db/db.svg",
            link: "/db/",
            prefix: "db/",
            children: "structure",
        },
        {
            text: "小狐狸的随笔",
            icon: "/icon/note.svg",
            link: "/note/",
            prefix: "note/",
            children: "structure",
        },
        {
            text: "项目",
            icon: "/icon/project.svg",
            link: "/proj/",
            prefix: "proj/",
            children: "structure",
        }
    ],
    "/proj/nanonet": [],
});
