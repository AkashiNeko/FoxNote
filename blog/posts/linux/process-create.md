---
title: 进程的创建和等待
date: 2022-08-24
isOriginal: true
icon: "/icon/tree.svg"
category:
  - Linux
tag:
  - 进程
  - fork
  - wait
excerpt: fork创建子进程和写时拷贝机制，wait和waitpid回收资源查看退出码。
---

## 1. 进程创建

### fork函数

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

### fork的工作流程

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

### 写时拷贝

Linux操作系统在 `fork()` 调用期间采取了一种优化策略**写时拷贝**（Copy-on-Write，COW），以避免不必要的内存复制操作。写时拷贝机制主要用于处理父进程和子进程之间共享内存页面的情况。

::: info 写时拷贝机制

在写时拷贝机制下，父进程和子进程最初共享相同的页面表项。这意味着它们将引用**相同**的物理空间。

![写时拷贝发生前](/inset/写时拷贝发生前.svg)

当父进程或子进程尝试修改共享的内存页面时，写时拷贝机制被触发。操作系统会为修改的页面**创建一个副本**，而不是立即复制整个页面。

![写时拷贝发生后](/inset/写时拷贝发生后.svg)

:::

## 2. 进程退出

### 进程退出码

在C/C++程序中，一定会存在一个主函数 `int main()`（Windows的GUI应用程序为 `int WinMain()`）作为程序的入口。在主函数返回后，程序运行结束退出，**主函数将返回值返回给了父进程**。

退出码用于将自己的任务执行情况告诉父进程。通常退出码为0表示执行正常，非0表示执行异常。在Linux终端下，`$?` 记录了上一个程序的退出码，可以使用 `echo` 命令查看。

~~~text:no-line-numbers
$ ls / # 执行正常的命令
bin  boot  dev  etc  home  lib  lib32  lib64  libx32  opt  proc  root  run  sbin  srv  sys  tmp  usr  var

$ echo $?
0

$ ls /123/456 # 查看一个不存在的目录
"/123/456": No such file or directory (os error 2)

$ echo $?
2
~~~

我们也可以自己写程序验证进程的退出码。

~~~text:no-line-numbers
$ echo 'int main() { return 123; }' > main.c

$ gcc main.c -o main

$ ls
main  main.c

$ ./main

$ echo $?
123
~~~

::: info 错误码对应的信息

在头文件 `string.h` 中，有一个函数 `strerror()` 可以查看错误码对应的错误信息。

~~~c
#include <string.h>

char *strerror(int errnum);
const char *strerrorname_np(int errnum);
const char *strerrordesc_np(int errnum);
~~~

因此，可以通过编写以下的代码查看退出码对应的信息。

~~~c
#include <stdio.h>
#include <string.h>

int main() {
    for (int i = 0; i < 128; ++i) {
        printf("%d: %s\n", i, strerror(i));
    }
    return 0;
}
~~~

::: details 输出结果

~~~text:no-line-numbers
0: Success
1: Operation not permitted
2: No such file or directory
3: No such process
4: Interrupted system call
5: Input/output error
6: No such device or address
7: Argument list too long
8: Exec format error
9: Bad file descriptor
10: No child processes
11: Resource temporarily unavailable
12: Cannot allocate memory
13: Permission denied
14: Bad address
15: Block device required
16: Device or resource busy
17: File exists
18: Invalid cross-device link
19: No such device
20: Not a directory
21: Is a directory
22: Invalid argument
23: Too many open files in system
24: Too many open files
25: Inappropriate ioctl for device
26: Text file busy
27: File too large
28: No space left on device
29: Illegal seek
30: Read-only file system
31: Too many links
32: Broken pipe
33: Numerical argument out of domain
34: Numerical result out of range
35: Resource deadlock avoided
36: File name too long
37: No locks available
38: Function not implemented
39: Directory not empty
40: Too many levels of symbolic links
41: Unknown error 41
42: No message of desired type
43: Identifier removed
44: Channel number out of range
45: Level 2 not synchronized
46: Level 3 halted
47: Level 3 reset
48: Link number out of range
49: Protocol driver not attached
50: No CSI structure available
51: Level 2 halted
52: Invalid exchange
53: Invalid request descriptor
54: Exchange full
55: No anode
56: Invalid request code
57: Invalid slot
58: Unknown error 58
59: Bad font file format
60: Device not a stream
61: No data available
62: Timer expired
63: Out of streams resources
64: Machine is not on the network
65: Package not installed
66: Object is remote
67: Link has been severed
68: Advertise error
69: Srmount error
70: Communication error on send
71: Protocol error
72: Multihop attempted
73: RFS specific error
74: Bad message
75: Value too large for defined data type
76: Name not unique on network
77: File descriptor in bad state
78: Remote address changed
79: Can not access a needed shared library
80: Accessing a corrupted shared library
81: .lib section in a.out corrupted
82: Attempting to link in too many shared libraries
83: Cannot exec a shared library directly
84: Invalid or incomplete multibyte or wide character
85: Interrupted system call should be restarted
86: Streams pipe error
87: Too many users
88: Socket operation on non-socket
89: Destination address required
90: Message too long
91: Protocol wrong type for socket
92: Protocol not available
93: Protocol not supported
94: Socket type not supported
95: Operation not supported
96: Protocol family not supported
97: Address family not supported by protocol
98: Address already in use
99: Cannot assign requested address
100: Network is down
101: Network is unreachable
102: Network dropped connection on reset
103: Software caused connection abort
104: Connection reset by peer
105: No buffer space available
106: Transport endpoint is already connected
107: Transport endpoint is not connected
108: Cannot send after transport endpoint shutdown
109: Too many references: cannot splice
110: Connection timed out
111: Connection refused
112: Host is down
113: No route to host
114: Operation already in progress
115: Operation now in progress
116: Stale file handle
117: Structure needs cleaning
118: Not a XENIX named type file
119: No XENIX semaphores available
120: Is a named type file
121: Remote I/O error
122: Disk quota exceeded
123: No medium found
124: Wrong medium type
125: Operation canceled
126: Required key not available
127: Key has expired
~~~

:::

### return和exit()

在 `main` 函数中，使用 `return` 可以让进程退出。此外，操作系统还给我们提供了在任意位置退出进程的接口 `exit()`。由于 `exit()` 的调用会结束进程，所以它的返回值可以忽略。与 `return` 相同，`exit()` 的参数即是进程的退出码。

~~~c
#include <stdlib.h>

[[noreturn]] void exit(int status);
~~~

## 3. 资源回收

之前在[进程状态](/posts/linux/process-status.html#僵尸-z)提到，进程退出后会变为僵尸进程，必须由父进程进行资源的回收。

### 为什么要回收

当一个进程退出时，如果父进程不对子进程进行资源回收，子进程就会持续处于僵尸状态，占用一些内存空间，造成内存泄漏。由于僵尸进程是已经终止的进程，所以它也接收不到任何命令，不能通过 `kill -SIGKILL` 来回收它。**僵尸进程必须通过它的父进程来回收**。

### 进程等待

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

### wait函数

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

### waitpid函数

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
