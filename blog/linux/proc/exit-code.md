---
title: 终止时的状态码
date: 2022-08-24
isOriginal: true
icon: section
category:
  - Linux
tag:
  - 进程
  - 状态码
excerpt: 进程的退出状态码是一个整数值，用于表示进程在退出时返回给父进程的信息，通常用于指示进程的执行结果或错误情况。
order: 7
---

## 1. 进程退出码

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

## 2. return和exit()

在 `main` 函数中，使用 `return` 可以让进程退出。此外，操作系统还给我们提供了在任意位置退出进程的接口 `exit()`。由于 `exit()` 的调用会结束进程，所以它的返回值可以忽略。与 `return` 相同，`exit()` 的参数即是进程的退出码。

~~~c
#include <stdlib.h>

[[noreturn]] void exit(int status);
~~~
