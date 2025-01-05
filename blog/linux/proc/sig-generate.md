---
title: 进程信号的产生
date: 2022-09-05
isOriginal: true
icon: section
category:
  - Linux
tag:
  - IPC
  - 信号
excerpt: Linux中的进程信号是一种用于进程间通信的机制，它允许一个进程向另一个进程发送通知。
order: 15
---

## 1. 进程信号

信号是一种软件中断，用于通知进程某个事件已经发生。Linux系统定义了一系列的标准信号，使用 `kill -l` 命令可以查看系统提供的所有信号。

~~~txt:no-line-numbers
$ kill -l
 1) SIGHUP       2) SIGINT       3) SIGQUIT      4) SIGILL       5) SIGTRAP
 6) SIGABRT      7) SIGBUS       8) SIGFPE       9) SIGKILL     10) SIGUSR1
11) SIGSEGV     12) SIGUSR2     13) SIGPIPE     14) SIGALRM     15) SIGTERM
16) SIGSTKFLT   17) SIGCHLD     18) SIGCONT     19) SIGSTOP     20) SIGTSTP
21) SIGTTIN     22) SIGTTOU     23) SIGURG      24) SIGXCPU     25) SIGXFSZ
26) SIGVTALRM   27) SIGPROF     28) SIGWINCH    29) SIGIO       30) SIGPWR
31) SIGSYS      34) SIGRTMIN    35) SIGRTMIN+1  36) SIGRTMIN+2  37) SIGRTMIN+3
38) SIGRTMIN+4  39) SIGRTMIN+5  40) SIGRTMIN+6  41) SIGRTMIN+7  42) SIGRTMIN+8
43) SIGRTMIN+9  44) SIGRTMIN+10 45) SIGRTMIN+11 46) SIGRTMIN+12 47) SIGRTMIN+13
48) SIGRTMIN+14 49) SIGRTMIN+15 50) SIGRTMAX-14 51) SIGRTMAX-13 52) SIGRTMAX-12
53) SIGRTMAX-11 54) SIGRTMAX-10 55) SIGRTMAX-9  56) SIGRTMAX-8  57) SIGRTMAX-7
58) SIGRTMAX-6  59) SIGRTMAX-5  60) SIGRTMAX-4  61) SIGRTMAX-3  62) SIGRTMAX-2
63) SIGRTMAX-1  64) SIGRTMAX
~~~

## 2. 信号的产生

### 按键发出信号

在进程前台运行时，按下 `CTRL` + `C`，会向进程发送 `SIGINT` 信号。如果该信号没有被捕捉，则进程将被终止。如果按下 `CTRL` + `\`，则会发送 `SIGQUIT` 信号，则终止进程的同时进行核心转储（Core Dump）。

如果进程被信号终止，那么它的退出码会被设置为终止进程的信号编号+128。

尝试以下的死循环代码，命名为 `main.c`，编译出可执行程序 `main`。

~~~c
#include <unistd.h>

int main() {
    while (1) sleep(1);
    return 0;
}
~~~

运行程序，分别按下 `CTRL` + `C` 和 `CTRL` + `\` 终止进程。然后查看它们终止的状态码，再用 `kill -l` 命令即可查出是哪个信号终止了进程。

~~~txt:no-line-numbers{2,4}
$ ./main 
^C
$ echo $?
130
~~~

`CTRL` + `C`：进程退出信号为 130 - 128 = 2 号信号 `SIGINT`。

~~~txt:no-line-numbers{2,4}
$ ./main 
^\退出 (核心已转储)
$ echo $?
131
~~~

`CTRL` + `\`：进程退出信号为 131 - 128 = 3 号信号 `SIGQUIT`。

### 系统调用发送信号

Linux 提供了系统调用 `kill()`，它的功能是向指定PID的进程发送指定的信号。

~~~c
#include <signal.h>

int kill(pid_t pid, int sig);
~~~

Linux 还提供了 `kill` 命令，使用 `kill` 命令发送信号时，它进行了对 `kill()` 的调用。

~~~bash
kill -信号名或编号 PID
~~~

比如，向PID为 114514 的进程发送 9 号信号。

~~~bash
kill -SIGKILL 114514
~~~

我们可以将之前的 `main` 运行起来，然后在其他终端下，使用 `kill` 命令发送 `SIGINT` 信号。

~~~txt:no-line-numbers{5}
$ ./main

...
# 在其他终端下
$ kill -SIGINT $(pidof main)
...

$ echo $?
130
~~~

除了 `kill()` 之外，还有 `raise()` 系统调用。它的功能是向自身的进程发送指定的信号。

~~~c
#include <signal.h>

int raise(int sig);
~~~

### 硬件异常产生信号

除零运算时，进程将收到 `SIGFPE` 信号。

~~~c{3}
int main() {
    int a = 10, b = 0;
    int c = a / b; // 除零运算
    return 0;
}
~~~

~~~txt:no-line-numbers{2,4}
$ ./main
浮点数例外 (核心已转储)
$ echo $?
136
~~~

退出码 136 - 128 = `(8) SIGFPE`

非法访问不可访问的内存时，进程将收到 `SIGSEGV` 信号。

~~~cpp{3}
int main() {
    int* p = (int*)0x00112233;
    int a = *p; // 野指针解引用
    return 0;
}
~~~

~~~txt:no-line-numbers{2,4}
$ ./main 
段错误 (核心已转储)
$ echo $?
139
~~~

退出码 139 - 128 = `(11) SIGSEGV`

::: info 除此之外，还有一些硬件异常可以产生信号。

`SIGILL` 非法指令：当程序尝试执行一个非法的、未定义的或错误的指令时产生。

`SIGTRAP` 跟踪陷阱：当程序执行到一个跟踪陷阱指令时产生，常用于调试。

`SIGABRT` 异常中止：当程序中止执行，通常是检测到异常条件，如 `abort()` 被调用时产生。

`SIGBUS` 总线错误：当程序尝试访问一个不允许的内存地址或者硬件错误导致的数据总线错误时产生。它与 `SIGSEGV` 类似，但是它通常与硬件问题有关，而 `SIGSEGV` 更多地与软件问题有关。

`SIGEMT` 仿真陷阱：用于仿真一些旧的硬件指令，比如在早期的处理器上运行的程序。

`SIGSYS` 系统调用错误：当程序尝试执行一个非法的系统调用或者参数不正确时产生。

:::
