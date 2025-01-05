---
title: 进程信号的处理
date: 2022-09-06
isOriginal: true
icon: section
category:
  - Linux
tag:
  - IPC
  - 信号
excerpt: Linux中的进程信号是一种用于进程间通信的机制，它允许一个进程向另一个进程发送通知。
order: 16
---

`SIGINT` 信号默认会终止进程，`SIGQUIT` 信号默认终止进程并核心转储。我们也可以通过注册信号，自定义对信号的处理方式。

C标准库中提供了注册信号的接口 `signal()`，它接受两个参数：要处理的信号。以及处理信号的方法。

~~~c
#include <signal.h>

typedef void (*sighandler_t)(int);

sighandler_t signal(int signum, sighandler_t handler);
~~~

`handler` 是一个函数指针，指向参数为 `int`，返回值为 `void` 的函数。

注册信号之后，当收到 `signum` 信号时，操作系统会调用 `handler` 指向的函数，并将收到的信号作为参数传给该函数。

下面是一个捕捉信号的简单例子。捕捉 `SIGINT` 信号并由 `handler` 函数处理。

~~~c
#include <stdio.h>
#include <signal.h>

void handler(int sig) {
    printf("收到信号: %d\n", sig);
}

int main() {
    signal(SIGINT, handler);
    while (1) sleep(1);
    return 0;
}
~~~

编译运行代码。按下 `CTRL` + `C` 向进程发送 `SIGINT` 信号。

~~~txt:no-line-numbers
$ ./main 
^C收到信号: 2
^C收到信号: 2
~~~

可以发现进程收到 `SIGINT` 信号时，我们自定义的 `handler()` 函数被调用了。

> 你可以使用 `CTRL` + `\` 终止这个进程。

另外，`signal()` 的第二个参数可以传入以下的两个宏。

~~~c
#define SIG_DFL  ((__sighandler_t)  0)  /* Default action.  */
#define SIG_IGN  ((__sighandler_t)  1)  /* Ignore signal.  */
~~~

如果要忽略某个信号，可以使用 `SIG_IGN` 作为 `signal()` 的第二个参数，比如

~~~c:no-line-number
signal(SIGINT, SIG_IGN); // 忽略SIGINT信号
~~~

这样当进程收到 `SIGINT` 信号时，会直接忽略而不进行任何处理。

当一个信号被设置为 `SIG_DFL` 时，操作系统会采取默认的行为来处理该信号。

~~~c:no-line-number
signal(SIGINT, SIG_DFL); // SIGINT默认终止进程
~~~
