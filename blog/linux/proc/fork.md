---
title: 创建子进程
date: 2022-08-24
isOriginal: true
icon: section
category:
  - Linux
tag:
  - 进程
  - fork
excerpt: fork是一个系统调用，在Linux系统中用于创建一个新的子进程，使得父进程和子进程可以并行执行不同的任务。
order: 8
---

## 1. fork函数

`fork()` 是一个常见的系统调用，它是Linux操作系统提供的用于创建进程的接口，用于复制当前进程，创建一个新的进程。

~~~c
#include <unistd.h>

pid_t fork();
~~~

`fork()` 接口不需要任何参数。调用 `fork()` 时，它在内核中创建一个子进程，与父进程并发执行。当它创建子进程成功时，会为父进程返回子进程的 `PID`，向子进程返回0。如果创建子进程失败，则返回-1。

下面的代码展示了 `fork()` 的基本用法。

~~~c
#include <stdio.h>
#include <unistd.h>
#include <errno.h>

int main() {
    pid_t pid = fork();

    if (pid < 0) {
        // fork失败
        perror("fork");
        return errno;
    } else if (pid == 0) {
        // 子进程
        printf("I'm child, pid = %d, my parent is %d\n", getpid(), getppid());
    } else {
        // 父进程
        printf("I'm parent, pid = %d, my child is %d\n", getpid(), pid);
    }
    return 0;
}
~~~

输出

~~~text:no-line-numbers
I'm parent, pid = 6137, my child is 6138
I'm child, pid = 6138, my parent is 6137
~~~

## 2. fork的工作流程

在 `fork()` 调用之后，内核做了以下的工作。

::: info fork的工作

- 1. 分配新的内存空间给子进程
- 2. 将父进程的部分资源及内核数据结构拷贝至子进程
- 3. 将子进程添加到操作系统的任务队列中
- 4. 返回用户空间，开始调度器调度

:::

我们在 `fork()` 之前定义一个变量，在 `fork()` 之后分别用父子进程读取变量的值。

~~~c
#include <stdio.h>
#include <unistd.h>

int main() {
    int num = 10;
    if (fork()) {
        // 父进程
        printf("I'm parent, read num = %d\n", num);
    } else {
        // 子进程
        printf("I'm child, read num = %d\n", num);
    }
    return 0;
}
~~~

输出

~~~text:no-line-numbers
I'm parent, read num = 10
I'm child, read num = 10
~~~

可以发现，父进程和子进程读取到了相同的结果。

接下来，我们对子进程中 `num` 的值进行修改，然后在父进程进行读取。为了保证读写顺序，父进程在修改发生一秒后再进行读取。

~~~c
#include <stdio.h>
#include <unistd.h>

int main() {
    int num = 10;
    if (fork()) {
        // 父进程
        sleep(1);
        printf("I'm parent, read num = %d\n", num);
    } else {
        // 子进程
        num = 20;
        printf("I'm child, modify num = %d\n", num);
    }
    return 0;
}
~~~

输出

~~~text:no-line-numbers
I'm child, modify num = 20
I'm parent, read num = 10
~~~

通过以上两个例子可以发现，`fork()` 创建子进程时，会对父进程的虚拟地址空间进行拷贝，且父进程和子进程的空间独立。

![fork的工作](/inset/fork的工作.svg)

子进程继承了父进程的许多属性和资源，包括文件描述符、信号处理程序、进程优先级等。子进程独立于父进程运行，并具有自己的内存空间和进程上下文，子进程与父进程几乎完全相同，包括代码、数据和打开的文件描述符。在 `fork()` 之后，父进程和子进程在不同的内存空间中并发地执行，它们都有自己独立的执行路径。

## 3. 写时拷贝

Linux操作系统在 `fork()` 调用期间采取了一种优化策略**写时拷贝**（Copy-on-Write，COW），以避免不必要的内存复制操作。写时拷贝机制主要用于处理父进程和子进程之间共享内存页面的情况。

::: info 写时拷贝机制

在写时拷贝机制下，父进程和子进程最初共享相同的页面表项。这意味着它们将引用**相同**的物理空间。

![写时拷贝发生前](/inset/写时拷贝发生前.svg)

当父进程或子进程尝试修改共享的内存页面时，写时拷贝机制被触发。操作系统会为修改的页面**创建一个副本**，而不是立即复制整个页面。

![写时拷贝发生后](/inset/写时拷贝发生后.svg)

:::
