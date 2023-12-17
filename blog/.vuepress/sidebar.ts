import { sidebar } from "vuepress-theme-hope";

export default sidebar({
    "/": [
        {
            text: "C++学习笔记",
            icon: "/icon/cpp.svg",
            prefix: "posts/",
            children: [
                {
                    text: "类和对象入门",
                    icon: "/icon/brackets.svg",
                    link: "cpp-classes-objects.html",
                },
                {
                    text: "默认成员函数",
                    icon: "/icon/brackets.svg",
                    link: "cpp-class-functions.html",
                }
            ],
        },
        {
            text: "Linux操作系统",
            icon: "/icon/linux.svg",
            prefix: "posts/",
            children: [
                {
                    text: "Linux进程概念",
                    icon: "/icon/task.svg",
                    link: "linux-process-concept.html",
                },
                {
                    text: "进程的状态转换",
                    icon: "/icon/transform.svg",
                    link: "linux-process-status.html",
                },
                {
                    text: "进程的创建和等待",
                    icon: "/icon/tree.svg",
                    link: "linux-fork-wait.html",
                },
                {
                    text: "基础I/O和文件描述符",
                    icon: "/icon/io.svg",
                    link: "linux-io-fd.html",
                },
                {
                    text: "五种I/O模型",
                    icon: "/icon/model.svg",
                    link: "linux-io-models.html",
                },
                {
                    text: "I/O多路转接之select",
                    icon: "/icon/io.svg",
                    link: "linux-io-select.html",
                },
                {
                    text: "I/O多路转接之poll",
                    icon: "/icon/io.svg",
                    link: "linux-io-poll.html",
                },
                {
                    text: "I/O多路转接之epoll",
                    icon: "/icon/io.svg",
                    link: "linux-io-epoll.html",
                },
                {
                    text: "epoll的LT模式和ET模式",
                    icon: "/icon/io.svg",
                    link: "linux-epoll-lt-et.html",
                },
            ],
        },
        {
            text: "小狐狸的随笔",
            icon: "/icon/pen.svg",
            prefix: "posts/",
            children: [
                {
                    text: "CSI控制字符",
                    icon: "/icon/cursor.svg",
                    link: "note-csi-chars.html",
                },
                {
                    text: "动静态库的制作和使用",
                    icon: "/icon/library.svg",
                    link: "note-build-library.html",
                },
            ],
        },
    ],
});
