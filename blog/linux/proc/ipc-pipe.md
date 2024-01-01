---
title: 进程间管道通信
date: 2022-08-30
isOriginal: true
icon: "/icon/linux_proc_post.svg"
category:
  - Linux
tag:
  - 进程
  - IPC
excerpt: 进程的管道通信包括匿名管道和命名管道，用于进程间单向数据传输，包括匿名管道和命名管道。
order: 5
---

## 1. 管道

### 什么是管道

管道（pipe）是Unix中最古老的进程间通信的形式，它是一种进程通信（IPC，Inter Process Communication）的机制。如同现实世界的管道，它也有两端，通常在一端写入，另一端读取。从实现来看，它是一个内核的数据缓冲区。

![管道通信](/inset/管道通信.svg)

### 命令行的管道

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

## 3. 命名管道

### 创建管道文件

在Linux中，我们可以使用 `mkfifo` 命令创建一个管道文件。

~~~bash:no-line-numbers
mkfifo pipe
~~~

这样可以在当前目录下创建一个名为 `pipe` 的管道文件，使用 `ls -l` 查看其权限 `|rw-r--r--`，可以发现它的类型为 `|`，这是管道文件的标识。

不需要管道文件之后，使用 `unlink` 命令来移除它。

~~~bash:no-line-numbers
unlink pipe
~~~

### 重定向到管道

我们尝试使用 `echo` 命令重定向 `>` 向管道进行写入。

~~~bash:no-line-numbers
mkfifo pipe
echo "Hello, world!" > pipe
~~~

可以发现，这条命令的执行被阻塞了，于是，我们新建另一个终端进行操作。观察管道文件的大小，发现它大小为0。

~~~text:no-line-numbers
$ du -h pipe
0       pipe
~~~

接下来，尝试从管道中读取。

~~~text:no-line-numbers
$ cat pipe
Hello, world!
~~~

这样我们就成功从管道文件中读取到了数据，同时，另一个终端的 `echo` 命令也结束了阻塞状态。

### 读写管道文件

除了使用 `mkfifo` 命令，Linux也提供了 `mkfifo` 接口，用于创建管道文件。

~~~c
#include <sys/types.h>
#include <sys/stat.h>

int mkfifo(const char* pathname, mode_t mode);
~~~

类似于 [`open`](../io/fd.html#open打开文件) 接口，`pathname` 用于指定管道文件的路径和名称，`mode` 为管道文件的权限。

同样，`unlink` 也有对应的接口。

~~~c
#include <unistd.h>

int unlink(const char *pathname);
~~~

通过命名管道，我们可以轻松实现非父子进程的通信。尝试编写下面两个程序 `sender` 和 `receiver`，分别用于发送数据和接收数据。其中 `receiver` 负责创建和删除管道文件。

::: note sender.c

~~~c
#include <unistd.h>
#include <fcntl.h>
#include <unistd.h>

int main() {
    // 打开管道文件
    int fd = open("ipc.fifo", O_WRONLY);
    assert(fd >= 0);

    // 写入
    char buf[] = "Hello, receiver!";
    write(fd, buf, sizeof buf - 1);

    close(fd);
    return 0;
}
~~~

:::

::: note receiver.c

~~~c
#include <unistd.h>
#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>
#include <assert.h>
#include <sys/stat.h>

int main() {
    // 创建管道文件
    int ret = mkfifo("ipc.fifo", 0644);

    int fd = open("ipc.fifo", O_RDONLY);
    assert(fd >= 0);

    // 读取
    char buf[1024];
    read(fd, buf, sizeof(buf));
    printf("%s\n", buf);

    close(fd);
    // 移除管道文件
    unlink("ipc.fifo");
    return 0;
}
~~~

:::

分别对二者进行编译。

~~~bash:no-line-numbers
gcc receiver.c -o receiver
gcc sender.c -o sender
~~~

然后在两个不同的终端下，先执行 `receiver`，再执行 `sender`。

![Sender](/inset/命名管道sender.svg =80%x)

![Receiver](/inset/命名管道receiver.svg =80%x)

像这样通过命名管道，可以实现任何进程之间的通信。
