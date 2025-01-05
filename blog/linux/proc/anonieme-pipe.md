---
title: 匿名管道通信
date: 2022-08-30
isOriginal: true
icon: section
category:
  - Linux
tag:
  - IPC
  - pipe
excerpt: 匿名管道是一种单向有限缓冲的通信机制。一个进程作为写入端，另一个进程作为读取端，通过管道进行数据传输，用于实现具有亲缘关系的进程之间的通信。
order: 11
---

## 1. 管道

### 什么是管道

管道（pipe）是Unix中最古老的进程间通信的形式，它是一种进程通信（IPC，Inter Process Communication）的机制。如同现实世界的管道，它也有两端，通常在一端写入，另一端读取。从实现来看，它是一个内核的数据缓冲区。

![管道通信](/inset/管道通信.svg)

### 命令行中的管道

在Linux的Shell下，管道是一种强大的特性，用于连接多个命令并实现数据流的传输和处理。它允许将一个命令的输出直接作为另一个命令的输入，从而实现命令之间的协作和数据流水线的构建。

管道的符号是竖线 `|`，在命令行中使用它可以将前一个命令的输出作为后一个命令的输入。

~~~bash
cmd1 | cmd2
~~~

比如最常见的 `grep` 命令，使用它时一般需要用管道 `|` 进行连接。

~~~text:no-line-numbers
$ ls / | grep lib
lib
lib32
lib64
~~~

## 2. 匿名管道

### 创建管道

[匿名管道](https://zh.wikipedia.org/wiki/%E5%8C%BF%E5%90%8D%E7%AE%A1%E9%81%93)（Anonymous Pipe）是一种在操作系统中用于进程间通信的机制，它是一种临时的、只能在具有亲缘关系的进程之间使用的无名管道。Linux提供了创建匿名管道的接口 `pipe`，Linux将管道抽象为文件，一端是只读的，另一端是只写的。

~~~c
#include <unistd.h>

int pipe(int pipefd[2]);
~~~

`pipe()` 接受一个长度为2的 `int` 数组作为参数，用于接收管道两端的fd。成功创建管道后，数组中会被填充管道的读端和写端的fd，并返回0。

创建成功后，数组的 `pipefd[0]` 会被改为管道的读端fd，`pipefd[1]` 则被改为写端fd。

![pipe创建管道](/inset/pipe创建管道.svg)

我们可以尝试将 `Hello, world` 经过管道传输再输出在屏幕上。

~~~c
#include <unistd.h>
#include <fcntl.h>
#include <stdio.h>

int main() {
    // 创建管道
    int fd[2];
    int ret = pipe(fd);

    // 向写端写数据
    char hello[] = "Hello, world";
    write(fd[1], hello, sizeof hello);

    // 从读端读数据
    char buf[1024];
    read(fd[0], buf, sizeof buf);

    // 查看
    printf("%s\n", buf);
    return 0;
}
~~~

### 父子进程通信

在单进程中，使用匿名管道似乎没有什么意义，它更多情况用于进程间的通信。示例代码如下。

~~~c
#include <unistd.h>
#include <fcntl.h>
#include <stdio.h>
#include <string.h>
#include <assert.h>

int main() {
    // 创建管道
    int fd[2];
    assert(pipe(fd) == 0);

    // 创建子进程
    pid_t pid = fork();
    assert(pid >= 0);

    if (pid > 0) {
        // 父进程关闭写端
        close(fd[1]);

        // 接收数据
        char buf[1024];
        while (1) {
            int len = read(fd[0], buf, sizeof buf);
            buf[len] = '\0';
            printf("parent receive: %s\n", buf);
        }
    } else {
        // 子进程关闭读端
        close(fd[0]);

        // 发送数据
        char buf[1024];
        while (1) {
            printf("child> ");
            scanf("%s", buf);
            write(fd[1], buf, strlen(buf));
            sleep(1); // 每次发完休眠1秒
        }
    }
    return 0;
}
~~~

创建匿名管道之后，再使用 `fork()` 创建子进程，这样子进程中就有了和父进程指向相同管道的fd。

![fork后的匿名管道](/inset/fork后的匿名管道.svg)

创建子进程后，我们只希望子进程能向父进程发送数据，进行单工通信。于是，父进程关闭不需要的写端，子进程关闭不需要的读端。

![关闭不需要的fd](/inset/关闭不需要的fd.svg)

执行程序。

![父子进程的匿名管道通信](/inset/父子进程匿名管道通信运行结果.svg =50%x)
