---
title: I/O重定向
date: 2022-08-28
isOriginal: true
icon: section
category:
  - Linux
tag:
  - IO
excerpt: 重定向是一种通过改变输入、输出流的方向或目标，控制命令行程序的输入和输出的方法。
order: 2
---

## 1. Shell命令重定向

### 重定向符号

对于大多数的Linux命令，它们从标准输入 `STDIN` 读取输入，并输出到标准输出 `STDOUT` 以及标准输出 `STDERR`。三者都对应着我们的终端。

~~~text:no-line-numbers
$ echo 'Hello, world'
Hello, world
~~~

`bash` 提供了一些用于命令行I/O重定向的命令 `>`、`>>` 和 `<` 等，通过这些命令，可以将终端上的输入输出重定向到指定文件中。

~~~bash:no-line-numbers
cmd > file  # 将 cmd 命令的标准输出写入到 file 文件
cmd >> file # 将 cmd 命令的标准输出追加到 file 文件
cmd < file  # 将 file 文件的内容作为 cmd 的标准输入
~~~

使用 `>` 将 `echo` 命令的输出重定向到文件 `echo.txt` 中。

~~~text:no-line-numbers
$ echo 'Hello, world' > echo.txt
$ ls
echo.txt
$ cat echo.txt
Hello, world
~~~

通过 `<` 将文件内容输入到 `md5sum` 命令，计算文件 `echo.txt` 内容的哈希值。

~~~text:no-line-numbers
$ md5sum < echo.txt
a7966bf58e23583c9a5a4059383ff850  -
~~~

### 指定fd重定向

尝试以下代码，分别向标准输出和标准错误进行输出。

~~~c
// main.c
#include <stdio.h>

int main() {
    // 标准输出
    fprintf(stdout, "Hello, I'm STDOUT\n");
    // 标准错误
    fprintf(stderr, "Hello, I'm STDERR\n");
    return 0;
}
~~~

编译运行。

~~~text:no-line-numbers
Hello, I'm STDOUT
Hello, I'm STDERR
~~~

在章节[文件描述符](./fd.html#文件描述符)中提到，标准输出 `STDOUT` 和标准错误 `STDERR` 分别对应 `1` 和 `2` 号文件描述符。

这里的标准输出和标准错误都正常打印到了屏幕上。如果我们要将二者分离，可以使用下面的方式，将 `1` 号文件描述符重定向到文件 `stdout.txt`，`2` 号文件描述符重定向到文件 `stderr.txt`。

~~~bash:no-line-numbers
./main 1>stdout.txt 2>stderr.txt
~~~

再分别查看两个文件的内容，可以发现两行内容已被分离。

![标准输出和标准错误分离](/inset/标准输出和标准错误分离.svg =800x)

### 两个特殊文件

在Linux的 `/dev` 目录下，有两个特殊的文件，它们分别是：

::: info 特殊的文件

`/dev/null`：一个特殊的设备文件，也称为**黑洞**。向其中写入数据时，它会默默地丢弃这些数据，不会进行任何处理。这对于需要执行某些操作，但不关心结果的情况非常有用。例如，有一个命令产生了许多输出，但是我们不希望在终端上看到这些输出，可以将输出重定向到该文件，这样输出就会被丢弃而不会显示在屏幕上。

`/dev/zero`：也是一个特殊的设备文件。从其中读取数据时，它会返回一个无限序列的零字节（null bytes）。也就是说，它会不断生成连续的零字节流。这对于某些需要初始化数据或者生成特定大小的文件的操作非常有用。可以将该文件作为输入，重定向到一个新文件中，以生成一个空文件。

:::

对于某些命令，如果我们不想看到错误消息，就可以将标准错误重定向到 `/dev/null`。

~~~bash
cmd 2>/dev/null
~~~

比如 `ls` 查看一个不存在的目录，丢弃错误结果。

~~~text:no-line-numbers
$ ls /123/456
"/123/456": No such file or directory (os error 2)

$ ls /123/456 2>/dev/null
~~~

如果要生成一个空白（填充零字节）文件，就可以使用 `/dev/zero`。

为了控制大小，使用 `dd` 命令进行重定向，生成一个 `1MB` 大小的文件。

~~~bash
dd if=/dev/zero of=zerofile bs=1024 count=1024
~~~

~~~text:no-line-numbers
$ du -h zerofile
1.0M    zerofile
~~~

## 2. 重定向的实现

### 关闭特殊fd

在关闭标准输出的 `1` 号文件描述符后，进程就无法使用标准输出向屏幕打印了。之后如果再打开新的文件，根据从小开始分配fd的规则，它会被分配为 `1`。我们可以编写以下的测试代码。

~~~c
#include <unistd.h>
#include <fcntl.h>

#include <stdio.h>
#include <assert.h>

int main() {
    close(1); // 关闭标准输出，然后打开一个新的文件 out.txt
    int ret = open("out.txt", O_CREAT | O_WRONLY, 0644);
    assert(ret == 1); // 断言打开文件成功

    // 屏幕打印（向1号文件描述符输出）
    printf("Hello\n");
    printf("World\n");
    return 0;
}
~~~

编译运行上面的代码。从结果来看，可以发现 `printf` 函数没有在屏幕上输出任何内容，程序执行结束后，生成了 `out.txt` 文件。

~~~text:no-line-numbers
$ cat out.txt
Hello
World
~~~

本来应该要输出在屏幕上的内容，被重定向到了文件中。这种现象称为**输出重定向**。

![输出重定向](/inset/输出重定向.svg)

### dup 函数

`dup` 是Linux提供的一个系统调用，它可以复制产生一个新的fd，二者指向同一个文件。

~~~c
#include <unistd.h>

int dup(int oldfd);
~~~

它的参数 `oldfd` 为要复制的fd。如果成功，返回新的fd，失败则返回-1。

比如，我们可以对标准输出的文件描述符 `1` 进行复制。

~~~c
#include <unistd.h>

int main() {
    int fd = dup(1);

    write(1, "hello\n", 6);
    close(1); // 关闭1号fd

    write(fd, "world\n", 6);
    close(fd);

    return 0;
}
~~~

输出：

~~~text:no-line-numbers
hello
world
~~~

![dup的工作](/inset/dup的工作.svg)

### dup2 函数

`dup2` 增加了一个参数 `newfd`，用于指定复制之后的新的文件描述符，并且在复制之前，`dup2` 会关闭之前的目标fd（如果存在）。

~~~c
#include <unistd.h>

int dup2(int oldfd, int newfd);
~~~

既然可以指定目标fd，我们可以打开一个文件，将该文件的fd直接 `dup2` 到标准输出 `1` 上，实现输出重定向的功能。

~~~c
#include <unistd.h>
#include <fcntl.h>
#include <stdio.h>

int main() {
    int fd = open("dup2.txt", O_CREAT | O_WRONLY, 0644);
    dup2(fd, 1); // 将文件 dup2.txt 的 fd 覆盖到标准输入
    close(fd); // 关闭原来的 fd
    printf("Hello, dup2!\n");
    return 0;
}
~~~

编译运行之后，`printf` 打印的内容成功输出到了 `dup2.txt` 文件。

~~~text:no-line-numbers
$ cat dup2.txt 
Hello, dup2!
~~~
