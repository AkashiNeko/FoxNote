---
title: 基础I/O和文件描述符
date: 2022-08-25
isOriginal: true
icon: section
category:
  - Linux
tag:
  - IO
  - 文件描述符
excerpt: 在Linux操作系统下一切皆文件。除了磁盘文件以外，键盘、显示器、网卡等外设都被抽象成文件。
order: 1
---

## 1. 编程语言读写文件

### C语言文件操作

C语言提供了一系列的文件操作接口，比如 `fopen`、`fread`、`fwrite` 和 `fclose` 等。

~~~c
#include <stdio.h>

FILE* fopen(const char* pathname, const char* mode);
int fclose(FILE* stream);
...
~~~

### 三个特殊文件

在C语言程序中，有三个默认打开的文件，它们分别是 `stdin`、`stdout` 和 `stderr`，对应着**标准输入**、**标准输出**和**标准错误**。

::: info 一切皆文件

Linux操作系统将键盘（或其他输入设备）抽象为**可读文件**，当用户输入时，操作系统从外设对应的文件进行读取；显示器屏幕抽象为**可写文件**，当程序向屏幕输出时，操作系统向这些设备对应的文件写入。

~~~text:no-line-numbers
$ ls /dev/std*
/dev/stderr  /dev/stdin  /dev/stdout
~~~

Linux将一切外设（包括硬盘、键盘鼠标、摄像头、麦克风、显示器、网卡等）抽象为文件，位于 `/dev` 目录下。上面提到的 `stdin`、`stdout` 和 `stderr` 也位于这个目录下

:::

从 `stdin` 文件进行读取数据，相当于 `scanf` 读取键盘（或其他输入外设）输入。同样的，对 `stdout` 文件进行写入数据，相当于 `printf` 向屏幕打印。

~~~c
#include <stdio.h>

int main() {
    char buf[1024];
    fscanf(stdin, "%s", buf);
    fprintf(stdout, "%s\n", buf);
    return 0;
}
~~~

和普通文件一样，这三个特殊的文件也是可以被关闭的。

~~~c
#include <stdio.h>

int main() {
    fprintf(stdout, "hello 1\n");
    printf("hello 2\n");

    // 关闭标准输出
    fclose(stdout);

    fprintf(stdout, "hello 3\n");
    printf("hello 4\n");
    return 0;
}
~~~

关闭了 `stdout`，之后的屏幕打印操作都无法正常输出到屏幕上了。

~~~text:no-line-numbers
hello 1
hello 2
~~~

## 2. 系统调用接口

### 系统调用

Linux操作系统提供了一系列文件操作的接口，它是原生的文件操作接口。通常情况下，任何上层的编程语言和应用程序，都需要使用这些接口操作文件。

~~~c
#include <fcntl.h>

int open(const char *pathname, int flags);
int open(const char *pathname, int flags, mode_t mode);
int creat(const char *pathname, mode_t mode);
~~~

~~~c
#include <unistd.h>

ssize_t read(int fd, char* buf, size_t count);
ssize_t write(int fd, const char* buf, size_t count);
int close(int fd);
~~~

提供这些系统调用接口，可以简单模拟一下 `printf` 和 `scanf` 的行为。下面的代码可以接收用户输入的数据，并将数据回显在屏幕上。

~~~c
#include <fcntl.h>
#include <unistd.h>
#include <string.h>

int main() {
    char buf[1024] = {};
    read(0, buf, 1023);         // scanf("%s", buf);
    write(1, buf, strlen(buf)); // printf("%s\n", buf);
    return 0;
}
~~~

### 文件描述符

正如C语言使用 `FILE` 类型的指针标识一个文件，在Linux提供的系统调用接口中，使用文件描述符（File Descriptor，fd）标识一个文件。

文件描述符 `fd` 是一个非负整数，类型为 `int`，它的本质是一个数组下标。

对于上面的代码，可以在 `/proc/` 下找到进程的 `PID` 对应的文件夹，其中有一个名为 `fd/` 的目录，该目录下存放的是当前进程打开的文件描述符。

~~~text:no-line-numbers
$ pidof main # 获取进程的PID
8256

$ ls /proc/8256/fd -l
lrwx------ 1 akashi akashi 64 8月 25 11:04 0 -> /dev/pts/9
lrwx------ 1 akashi akashi 64 8月 25 11:04 1 -> /dev/pts/9
lrwx------ 1 akashi akashi 64 8月 25 11:04 2 -> /dev/pts/9
~~~

可以看到这个目录下有三个文件 `0`、`1` 和 `2`，它们就是进程默认打开的 `fd`，分别对应C语言中的三个特殊文件 `stdin`、`stdout` 和 `stderr`。

### fd_array

在Linux内核源代码，进程的PCB结构体 `task_struct` 中，定义了进程用于管理文件的结构体 `files_struct`。

~~~c
struct task_struct {
    ...
    struct files_struct* files;
    ...
}
~~~

在 `files_struct` 的最后，可以找到 `fd` 数组 `fd_array` 的定义。

~~~c
struct files_struct {
    ...
    struct file __rcu * fd_array[NR_OPEN_DEFAULT];
}
~~~

::: details files_struct 结构体

~~~c
struct files_struct {
  /*
   * read mostly part
   */
    atomic_t count;
    bool resize_in_progress;
    wait_queue_head_t resize_wait;

    struct fdtable __rcu *fdt;
    struct fdtable fdtab;
  /*
   * written part on a separate cache line in SMP
   */
    spinlock_t file_lock ____cacheline_aligned_in_smp;
    unsigned int next_fd;
    unsigned long close_on_exec_init[1];
    unsigned long open_fds_init[1];
    unsigned long full_fds_bits_init[1];
    struct file __rcu * fd_array[NR_OPEN_DEFAULT];
};
~~~

:::

![fd_array](/inset/fd_array文件描述符数组.svg)

之前提到的 `0`、`1` 和 `2` 号文件描述符，表示的都是的这个 `fd_array` 的下标索引。

### open打开文件

~~~c
#include <fcntl.h>

int open(const char *pathname, int flags);
int open(const char *pathname, int flags, mode_t mode);
~~~

`open()` 用于打开一个文件，成功并返回文件的 `fd`，失败时返回-1，它有以下的参数。

::: info open的参数

- `pathname`：和C语言的 `fopen()` 类似，用于指定要操作的文件的路径。可以是绝对路径也可以是相对路径。
- `flags`：用于指定操作的类型。它是一个位图结构，使用多个值时需要用按位或 `|` 运算符进行连接。
  - `O_RDONLY`：以只读的方式打开。
  - `O_WRONLY`：以只写的方式打开。
  - `O_RDWR`：以读写的方式打开。
  - `O_APPEND`：以追加的形式打开。
  - `O_CREAT`：如果文件不存在，创建之。
  - 上面是一些常见的值，更多的值可以使用命令 `man 2 open` 查看。
- `mode`：文件创建时的权限，比如 `0644`。

:::

下面的代码可以创建一个文件 `file.txt`，并写入内容 `hello`。

~~~c
#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>
#include <string.h>

int main() {
    int fd = open("file.txt", O_CREAT | O_WRONLY, 0644);
    printf("Create file: fd = %d\n", fd);
    write(fd, "hello", 5);
    close(fd);
    return 0;
}
~~~

编译执行程序，成功创建并写入了文件。

~~~text:no-line-numbers
$ gcc main.c -o main

$ ./main 
Create file: fd = 3

$ ls
file.txt  main  main.c

$ cat file.txt 
hello
~~~

### fd的分配

文件描述符从最小的没有被使用的下标分配。比如当 `0`、`1` 和 `2` 号文件描述符默认打开的情况下，新打开的文件描述符会默认分配为 `3`、`4`、`5` …

使用下面的代码验证，先打开 `3`、`4`、`5` 号文件描述符，然后关闭 `0` 和 `3`，再打开两个文件描述符，观察现象。

~~~c
#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main() {
    int fds[3] = {};
    const char* files[3] = {
        "file1.txt",
        "file2.txt",
        "file3.txt"
    };

    // fd_array: 0 1 2 _ _ _ _ ...

    for (int i = 0; i < 3; ++i) {
        fds[i] = open(files[i], O_CREAT | O_WRONLY);
        printf("open fd: %d\n", fds[i]);
    }

    // fd_array: 0 1 2 3 4 5 _ ...

    close(0);
    close(3);
    printf("close fd: 0 3\n");

    // fd_array: _ 1 2 _ 4 5 _ ...

    int fd1 = open("file4.txt", O_CREAT);
    printf("open fd: %d\n", fd1);

    // fd_array: 0 1 2 _ 4 5 _ ...

    int fd2 = open("file5.txt", O_CREAT);
    printf("open fd: %d\n", fd2);

    // fd_array: 0 1 2 3 4 5 _ ...

    return 0;
}
~~~

编译运行，程序的输出结果证明了 `fd` 是从没有被使用的最小的一个下标开始分配的。

~~~text:no-line-numbers
$ ls
main.c

$ gcc main.c -o main

$ ./main 
open fd: 3
open fd: 4
open fd: 5
close fd: 0 3
open fd: 0
open fd: 3

$ ls
file1.txt  file2.txt  file3.txt  file4.txt  file5.txt  main  main.c
~~~
