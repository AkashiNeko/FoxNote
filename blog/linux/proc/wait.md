---
title: 进程等待
date: 2022-08-24
isOriginal: true
icon: section
category:
  - Linux
tag:
  - 进程
  - wait
excerpt: wait是一个系统调用，在Linux系统中用于父进程等待子进程的结束，并获取子进程的退出状态信息。
order: 9
---

在之前的[进程状态](/posts/linux/process-status.html)中提到，进程退出后会变为僵尸进程，必须由父进程进行资源的回收。

当一个进程退出时，如果父进程不对子进程进行资源回收，子进程就会持续处于僵尸状态，占用一些内存空间，造成内存泄漏。由于僵尸进程是已经终止的进程，所以它也接收不到任何命令，不能通过 `kill -SIGKILL` 来回收它。**僵尸进程必须通过它的父进程来回收**。

## 1. 进程等待

操作系统提供了一些回收子进程资源的接口，常用的有 `wait` 和 `waitpid`，如下。

~~~c
#include <sys/wait.h>

pid_t wait(int* wstatus);
pid_t waitpid(pid_t pid, int* wstatus, int options);
~~~

这两个接口中都有一个指针类型的参数 `wstatus`，它是一个输出型的参数，用于父进程接收子进程的退出状态。

`wstatus` 由低字节部分和高字节部分组成，其中低字节部分包含了子进程的退出码，高字节部分包含了子进程终止的其他信息，如是否被信号终止、终止子进程的信号编号等。下面是一些 `wstatus` 相关的宏。

~~~c
WIFEXITED(wstatus) 检查子进程是否正常终止。
WEXITSTATUS(wstatus) 获取子进程的退出码。
WIFSIGNALED(wstatus) 检查子进程是否被信号终止止。
WTERMSIG(wstatus) 获取使子进程退出的信号编号。
~~~

::: details man wait 原文

~~~text:no-line-numbers
If wstatus is not NULL, wait() and waitpid() store status information in the int towhich it points.  This integer can be inspected with the following macros (which take the integer itself as anargument, not a pointer to it, as is done in wait() and waitpid()!):
WIFEXITED(wstatus)
    returns true if the child terminated normally, that is, by calling exit(3) or _exit(2), or by returning from main().
WEXITSTATUS(wstatus)
    returns the exit status of the child.  This consists of the least significant 8 bits of the status argument that the child specified in a call to exit(3) or _exit(2) or as the argument for a return statement in main().  This macro should be employed only if WIFEXITED returned true.
WIFSIGNALED(wstatus)
    returns true if the child process was terminated by a signal.
WTERMSIG(wstatus)
    returns the number of the signal that caused the child process to terminate.  This macro should be  employed only if WIFSIGNALED returned true.
WCOREDUMP(wstatus)
    returns  true  if  the child produced a core dump (see core(5)).  This macro should be employed only if WIFSIGNALED returned true. This macro is not specified in POSIX.1‐2001 and is not available on some  UNIX  implementations  (e.g., AIX, SunOS).  Therefore, enclose its use inside #ifdef WCOREDUMP ... #endif.
WIFSTOPPED(wstatus)
    returns  true  if  the  child process was stopped by delivery of a signal; this is possible only if the call was done using WUNTRACED or when the child is being traced (see ptrace(2)).
WSTOPSIG(wstatus)
    returns the number of the signal which caused the child to stop.  This macro should be employed only if WIFSTOPPED returned true.
WIFCONTINUED(wstatus)
    (since Linux 2.6.10) returns true if the child process was resumed by delivery of SIGCONT.
~~~

:::

## 2. wait

调用 `wait()` 时，它会阻塞等待，直到某个子进程就绪，它的返回值为就绪的子进程的 `PID`，失败时返回-1。可以用下面的代码简单验证。

~~~c
#include <stdio.h>
#include <stdlib.h>
#include <sys/wait.h>
#include <unistd.h>

int main() {

    if (fork() == 0) {
        // 子进程
        printf("Child: Hello, my pid is %d\n", getpid());
        sleep(1);
        exit(123); // 退出
    } else {
        // 父进程
        int status = 0;
        pid_t pid = wait(&status);
        // 获取退出码
        int code = WEXITSTATUS(status);
        printf("Process %d exited with code %d\n", pid, code);
    }

    return 0;
}
~~~

输出

~~~text:no-line-numbers
Child: Hello, my pid is 10818
Process 10818 exited with code 123
~~~

## 3. waitpid

`waitpid` 与 `wait` 的功能基本相同，它可以指定要等待的子进程的 `PID`，并额外带上一些参数。

~~~c
pid_t waitpid(pid_t pid, int* wstatus, int options);
~~~

::: info 参数说明

- `pid`：要等待的子进程，有以下的取值。
  - `< -1`：表示 `PID` 值等于该参数绝对值的子进程。
  - `= -1`：等待任何子进程。
  - `= 0`：与调用进程处于同一进程组的任何子进程。
  - `> 0`：表示 `PID` 值等于该参数的子进程。
- `wstatus`：与 [`wait()`](/posts/linux/process-create.html#进程等待) 的参数相同，是一个输出型参数。
- `options`：用于传入附加选项，是一个位图的结构，指定多个参数时使用位或操作符 `|` 连接。
  - `WNOHANG`：设为非阻塞等待。如果没有已终止（僵尸状态）的子进程则立即返回零，
  - `WUNTRACED`：用于检测已停止的子进程。如果子进程被暂停执行（比如收到 `SIGSTOP` 信号），则返回其 `PID`。
  - `WCONTINUED`：用于检测已恢复执行的子进程。如果子进程之前被暂停，且现已恢复执行（比如收到 `SIGCONT` 信号），则返回其 `PID`。

:::

我们可以使用下面的代码简单验证。子进程运行5秒后退出，父进程每隔1秒进行非阻塞式的轮询，直到子进程退出。

~~~c
#include <stdio.h>
#include <stdlib.h>
#include <sys/wait.h>
#include <unistd.h>

int main() {
    pid_t pid = fork();
    if (pid == 0) {
        // 子进程
        printf("Child: Hello, my pid is %d\n", getpid());
        sleep(5);
        exit(0);
    } else {
        // 父进程
        int status = 0;
        while (1) {
            pid_t ret = waitpid(pid, &status, WNOHANG);
            if (ret == 0) {
                // 子进程未终止
                printf("Parent: The child process %d does not exit\n", pid);
            } else {
                // 子进程已终止
                printf("Parent: The child process %d has exited\n", ret);
                break;
            }
            sleep(1);
        }
    }

    return 0;
}
~~~

执行程序，它在执行5秒后退出。

![运行结果](/inset/waitpid示例代码运行结果.svg =800x)
