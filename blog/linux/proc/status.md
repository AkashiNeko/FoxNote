---
title: 进程状态
date: 2022-08-21
isOriginal: true
icon: section
category:
  - Linux
tag:
  - 进程
  - 阻塞
excerpt: 操作系统上同时运行着多个进程，合理地分配系统资源，为此，被调度的进程需要有不同的状态。
order: 4
star: true
---

一个进程可以有很多不同的状态，下面是Linux内核源代码中定义的进程状态。

~~~c
/*
 * The task state array is a strange "bitmap" of
 * reasons to sleep. Thus "running" is zero, and
 * you can test for combinations of others with
 * simple bit tests.
 */
static const char * const task_state_array[] = {
    /* states in TASK_REPORT: */
    "R (running)",        /* 0x00 */
    "S (sleeping)",        /* 0x01 */
    "D (disk sleep)",    /* 0x02 */
    "T (stopped)",        /* 0x04 */
    "t (tracing stop)",    /* 0x08 */
    "X (dead)",        /* 0x10 */
    "Z (zombie)",        /* 0x20 */
    "P (parked)",        /* 0x40 */
    /* states beyond TASK_REPORT: */
    "I (idle)",        /* 0x80 */
};
~~~

使用命令 `ps a` 可以查看进程的状态，`STAT` 列显示了各进程当前的状态。

## 1. 运行（R）

只要进程正在被CPU执行，或者在运行队列中等待CPU资源即将被执行，那么它的状态就是 `R`，可以写一个简单的死循环代码来观察。

~~~c
int main() {
    while (1);
}
~~~

::: tip 代码编译运行说明

为了方便表示，下文中的代码都命名 `main.c`，用 `gcc` 进行编译，编译的可执行文件为 `main`。

~~~bash:no-line-numbers
gcc -o main main.c
~~~

由于程序在前台运行，为了观察，需要在机器上另外新建一个终端。

:::

将程序运行起来后，在其他终端下检查进程，可以发现它的运行状态是 `R`。（状态后面的 `+` 表示这是一个前台进程，如果让程序以后台运行的方式执行，那么运行状态会显示为 `R`，我们之后不再关注这个 `+`）。

~~~text:no-line-numbers
$ ps a | head -1 && ps a | grep main
  PID TTY      STAT   TIME COMMAND
14617 pts/6    R+     0:10 ./main
~~~

由于 `R` 状态的进程正在被CPU执行，如果你的机器上安装了 `htop`，可以使用该命令直观的查看的CPU使用率。当上面的死循环运行时，你会发现CPU（如果你的CPU是多核的，那么这里指的是其中一个CPU核心）是满载的。

## 2. 睡眠（S）

虽然名为 `sleeping`，但是此时进程是在等待某种资源或者等待事件完成。比如I/O事件，我们可以写一个最简单的I/O程序观察进程状态。

~~~c
#include <stdio.h>

int main() {
    char buf[32];
    scanf("%s",buf);
    printf("%s\n", buf);
    return 0;
}
~~~

程序运行后，我们先不输入数据。在一个新的终端下观察进程。

~~~text:no-line-numbers
$ ps a | head -1 && ps a | grep main
  PID TTY      STAT   TIME COMMAND
16242 pts/7    S+     0:00 ./main
~~~

可以发现进程当前的状态为 `S`，这里进程是在等待I/O资源，即用户输入事件。有许多情况可以让进程进入 `S` 状态，下面是一些场景的情况。

::: info 睡眠状态的进程

1. **等待I/O操作完成**：当进程执行某个需要等待I/O操作完成的指令时，例如读取磁盘上的数据或等待网络数据的到达，它会进入睡眠状态，直到相应的I/O操作完成。
2. **等待信号**：进程可以通过等待信号的到来来实现同步或异步通信。当进程调用了等待信号的系统调用（如 `sigwait()`、`sigsuspend()` ）时，它会进入睡眠状态，直到相应的信号到达。
3. **等待资源**：进程可能会因为等待某个资源而进入睡眠状态。例如，当进程需要访问一段被其他进程锁定的共享内存或互斥锁时，它会进入睡眠状态，直到资源可用。
4. **等待子进程退出**：当父进程调用了wait()或waitpid()等系统调用来等待子进程退出时，父进程会进入睡眠状态，直到子进程退出。
5. **调度等待**：当进程使用了所有可用的CPU时间片后，它可能会进入睡眠状态，等待调度器重新分配CPU时间片。

:::

## 3. 磁盘睡眠（D）

也叫 **不可中断睡眠**。当进程处于 `D` 状态时，它正在等待一个不可中断的事件完成，例如等待磁盘I/O操作完成或等待某个硬件设备的响应。

`D` 状态是一种特殊的睡眠状态，与普通的睡眠状态不同。在 `D` 状态下，进程无法被中断或唤醒，除非等待的事件满足或异常发生。这意味着 `D` 状态的进程无法响应中断信号或其他通常用于唤醒进程的事件。

::: info D状态的模拟实现

在Linux系统中，通常无法直接模拟出一个处于 `D` 状态的进程，因为这种状态通常是由内核在等待某个不可中断的事件时设置的。一般用户空间的应用程序无法直接进入到D状态。只有内核模块或驱动程序在特定条件下才能进入该状态。

:::

## 4. 停止（T）

`T` 状态表示进程已经被停止或暂停，它不会执行任何指令，也不会消耗CPU时间片。通常，`T` 状态的进程是由于接收到了一个停止信号（`SIGSTOP`）而被暂停的。

对一个进程使用 `kill` 命令发送 `SIGSTOP` 信号，可以使其暂停进入 `T` 状态。对 `T` 状态的进程发送 `SIGCONT` 信号，可以使其恢复运行。

为了方便观察，我们使用以下的代码，让进程循环打印 `Hello, world`，然后对进程发送 `SIGSTOP` 信号，观察现象。

~~~c
#include <stdio.h>
#include <unistd.h>

int main() {
    while (1) {
        printf("Hello, world\n");
        sleep(1);
    }
    return 0;
}
~~~

程序被执行后，每隔一秒向屏幕打印一次。分别查看发送信号前后的进程的状态。

~~~text:no-line-numbers
$ ps a | head -1 && ps a | grep main
  PID TTY      STAT   TIME COMMAND
16242 pts/7    S+     0:00 ./main

$ kill -SIGSTOP 16242

$ ps a | head -1 && ps a | grep main
  PID TTY      STAT   TIME COMMAND
16242 pts/7    T+     0:00 ./main
~~~

可以发现，发送了 `SIGSTOP` 信号后，进程进入了 `T` 状态，同时进程停止了屏幕打印。如果想让其恢复运行，可以继续向进程发送 `SIGCONT` 信号。

~~~text:no-line-numbers
$ ps a | head -1 && ps a | grep main
  PID TTY      STAT   TIME COMMAND
16242 pts/7    T+     0:00 ./main

$ kill -SIGCONY 16242

$ ps a | head -1 && ps a | grep main
  PID TTY      STAT   TIME COMMAND
16242 pts/7    S+     0:00 ./main
~~~

之后可以观察到进程恢复了运行，继续向屏幕上打印 `Hello, world`。

::: info 无法停止进程的问题

如果前台无法停止该进程，可以发送 `SIGKILL` 信号杀死该进程。关于信号的问题，不在本文讨论范围之内。

~~~bash :no-line-numbers
kill -SIGKILL <进程的PID>
~~~

:::

## 5. 死亡（X）

死亡 `X` 状态不是Linux中标准的进程状态，它是内核源代码中特定系统的定义。它只是进程终止时的一个返回状态，通常无法被观察到。

## 6. 僵尸（Z）

当一个进程终止时，内核会保留一些信息，包括进程的退出状态和一些元数据，以供父进程查询。这样的终止进程称为僵尸进程（Zombie Process），即处于 `Z` 状态。由于僵尸进程已经终止，所以它不会消耗任何CPU资源，处于一个等待回收的状态，但是它会占用一定的内存空间，所以父进程必须进行回收（调用 `wait()`、`waitpid()` 接口），大量的僵尸进程会影响系统的稳定运行。

当子进程退出时，如果父进程没有回收子进程的资源，那么子进程会处于僵尸状态。我们可以用下面的代码进行验证，创建一个子进程，随后子进程立即退出，父进程不对子进程的资源进行释放。关于子进程的创建，将在后文[进程的创建和等待](/posts/linux/process-create.html)中详细介绍。

~~~c
#include <stdio.h>
#include <unistd.h>

int main() {
    if (fork()) // 创建子进程
        getchar(); // 父进程
    else
        return 1;  // 子进程
    return 0;
}
~~~

运行程序，使用命令 `ps ajx` 查看两个进程的状态。

~~~text:no-line-numbers
$ ps ajx | head -1 && ps ajx | grep main
 PPID     PID    PGID     SID TTY        TPGID STAT   UID   TIME COMMAND
15610   20030   20030   15610 pts/7      20030 S+    1000   0:00 ./main
20030   20031   20030   15610 pts/7      20030 Z+    1000   0:00 [main] <defunct>
~~~

可以看到 `PID` 分别为 `20030` 和 `20031` 的父进程和子进程。子进程的状态为 `Z`。
