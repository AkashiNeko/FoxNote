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
                    icon: "/icon/class.svg",
                    link: "classes-and-objects/",
                },
                {
                    text: "默认成员函数",
                    icon: "/icon/class.svg",
                    link: "class-default-functions/",
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
                    link: "process-concept/",
                },
                {
                    text: "进程的状态转换",
                    icon: "/icon/trace.svg",
                    link: "process-status/",
                },
                {
                    text: "五种IO模型",
                    icon: "/icon/io.svg",
                    link: "io-models/",
                },
                {
                    text: "IO多路转接之select",
                    icon: "/icon/io.svg",
                    link: "io-select/",
                },
                {
                    text: "IO多路转接之poll",
                    icon: "/icon/io.svg",
                    link: "io-poll/",
                },
                {
                    text: "IO多路转接之epoll",
                    icon: "/icon/io.svg",
                    link: "io-epoll/",
                },
                {
                    text: "epoll的LT模式和ET模式",
                    icon: "/icon/io.svg",
                    link: "epoll-lt-et/",
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
                    link: "csi-chars/",
                },
                {
                    text: "动静态库的制作和使用",
                    icon: "/icon/library.svg",
                    link: "build-library/",
                },
            ],
        },
    ],
});
