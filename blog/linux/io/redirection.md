---
title: I/O重定向
date: 2022-08-28
isOriginal: true
icon: "/icon/linux_io_post.svg"
category:
  - Linux
tag:
  - IO
excerpt: 重定向是一种通过改变输入、输出流的方向或目标，控制命令行程序的输入和输出的方法。
order: 2
---

## 1. Shell命令重定向

### 重定向符号

对于大多数的Linux命令，它们从标准输入 `STDIN` 读取输入，并输出到标准输出 `STDOUT` 以及标准输出 `STDERR`。这些都对应着我们的终端。

~~~text:no-line-numbers
$ echo 'Hello, world'
Hello, world
~~~

Linux提供了一组用于I/O重定向的命令 `>`、`>>` 和 `<` 等，通过这些命令，可以将终端上的I/O重定向到其他位置。

~~~bash:no-line-numbers
cmd > file  # 将cmd的标准输出写入到文件file
cmd >> file # 将cmd的标准输出追加到文件file
cmd < file  # 将file的内容输入到cmd标准输入
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

在[文件描述符](./fd.html#文件描述符)章节中我们知道，标准输出 `STDOUT` 和标准错误 `STDERR` 分别对应 `1` 和 `2` 号文件描述符。我们编写以下代码，分别向二者输出。

~~~c
// main.c
#include <stdio.h>

int main() {
    fprintf(stdout, "Hello, I'm STDOUT\n");
    fprintf(stderr, "Hello, I'm STDERR\n");
    return 0;
}
~~~

编译运行。

~~~text:no-line-numbers
Hello, I'm STDOUT
Hello, I'm STDERR
~~~

这里的标准输出和标准错误都正常打印到了屏幕上。如果我们要将二者分离，可以使用下面的方式，将 `1` 号文件描述符重定向到文件 `stdout.txt`，`2` 号文件描述符重定向到文件 `stderr.txt`。

~~~bash:no-line-numbers
./main 1>stdout.txt 2>stderr.txt
~~~

再分别查看两个文件的内容，可以发现上面的两行内容已被分离。

![标准输出和标准错误分离](/inset/标准输出和标准错误分离.svg =800x)

## 2. 重定向的实现

### 关闭特殊fd

在关闭 `1` 号文件描述符后，进程就无法使用标准输出向屏幕打印了。此时如果打开新的文件，根据从小开始分配的规则，它会重修占用 `1` 号文件描述符。我们可以编写以下的测试代码。

~~~c
#include <unistd.h>
#include <fcntl.h>

#include <stdio.h>
#include <assert.h>

int main() {
    close(1);
    int ret = open("out.txt", O_CREAT | O_WRONLY, 0644);
    assert(ret == 1);
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

`dup` 是Linux提供的一个系统调用，它可以复制产生一个新的fd，两个fd都指向同一个文件。

~~~c
#include <unistd.h>

int dup(int oldfd);
~~~

它的参数为要复制的fd，返回值为新的fd。

比如，我们可以对标准输出的文件描述符 `1` 进行复制。

~~~c
#include <unistd.h>

int main() {
    int fd = dup(1);

    write(1, "hello\n", 6);
    close(1);

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

`dup2` 比 `dup` 多一个参数 `newfd`，该参数用于指定复制之后的新的文件描述符，并且在复制之前，`dup2` 会关闭之前的目标fd（如果存在）。

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

编译运行之后，`printf` 的内容成功输出到了 `dup2.txt` 文件。

~~~text:no-line-numbers
$ cat dup2.txt 
Hello, dup2!
~~~
