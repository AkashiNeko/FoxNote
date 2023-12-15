import { sidebar } from "vuepress-theme-hope";

export default sidebar({
    "/": [
        {
            text: "C++学习笔记",
            icon: "/icon/cpp.svg",
            prefix: "posts/cpp/",
            children: [
                {
                    text: "类和对象入门",
                    icon: "/icon/brackets.svg",
                    link: "classes-and-objects.html",
                },
                {
                    text: "默认成员函数",
                    icon: "/icon/brackets.svg",
                    link: "class-functions.html",
                }
            ],
        },
        {
            text: "Linux操作系统",
            icon: "/icon/linux.svg",
            prefix: "posts/linux/",
            // children: "structure",
            children: [
                {
                    text: "Linux进程概念",
                    icon: "/icon/task.svg",
                    link: "process-concept.html",
                },
                {
                    text: "进程的状态转换",
                    icon: "/icon/transform.svg",
                    link: "process-status.html",
                },
                {
                    text: "进程控制",
                    icon: "/icon/tree.svg",
                    link: "process-control.html",
                },
                {
                    text: "五种IO模型",
                    icon: "/icon/io.svg",
                    link: "io-models.html",
                },
                {
                    text: "IO多路转接之select",
                    icon: "/icon/io.svg",
                    link: "io-select.html",
                },
                {
                    text: "IO多路转接之poll",
                    icon: "/icon/io.svg",
                    link: "io-poll.html",
                },
                {
                    text: "IO多路转接之epoll",
                    icon: "/icon/io.svg",
                    link: "io-epoll.html",
                },
                {
                    text: "epoll的LT模式和ET模式",
                    icon: "/icon/io.svg",
                    link: "epoll-lt-et.html",
                },
            ],
        },
        {
            text: "Shell命令相关",
            icon: "/icon/shell.svg",
            prefix: "posts/shell/",
            children: [
                {
                    text: "CSI控制字符",
                    icon: "/icon/ctrl.svg",
                    link: "csi-chars.html",
                },
                {
                    text: "动静态库的制作和使用",
                    icon: "/icon/library.svg",
                    link: "build-library.html",
                },
            ],
        },
    ],
});
