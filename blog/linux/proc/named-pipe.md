---
title: 命名管道通信
date: 2022-08-30
isOriginal: true
icon: section
category:
  - Linux
tag:
  - IPC
  - pipe
excerpt: 命名管道是一种基于文件系统的有名管道。通过在文件系统中创建一个特殊文件，多个进程可以通过该文件进行读取和写入操作，用于实现不具有亲缘关系的进程之间的通信。
order: 12
---

## 1. 创建管道文件

在Linux中，我们可以使用 `mkfifo` 命令创建一个管道文件。

~~~bash:no-line-numbers
mkfifo pipe
~~~

这样可以在当前目录下创建一个名为 `pipe` 的管道文件，使用 `ls -l` 查看其权限 `|rw-r--r--`，可以发现它的类型为 `|`，这是管道文件的标识。

不需要管道文件之后，使用 `unlink` 命令来移除它。

~~~bash:no-line-numbers
unlink pipe
~~~

## 2. 重定向到管道

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

## 3. 系统调用接口

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
