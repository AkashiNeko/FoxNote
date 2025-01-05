---
title: 进程空间替换
date: 2022-08-26
isOriginal: true
icon: section
category:
  - Linux
tag:
  - 进程
  - 程序替换
excerpt: 进程替换指的是将正在运行的进程从内存中移除，并将一个新的进程加载到内存中，然后继续执行。
order: 10
---

## 1. 进程替换

### 什么是进程替换

在 `fork()` 创建子进程后，我们希望子进程执行特定的任务，而子进程是和父进程共享代码的。这时候，通常需要将子进程从父进程继承的代码替换成我们需要执行的特定代码，这个替换的过程称为**进程替换**。

### 进程替换的过程

::: info 进程替换的过程

**1. 保存上下文**：操作系统保存当前正在运行进程的上下文信息，包括程序计数器、寄存器、堆栈指针等。

**2. 加载新进程**：如果选择的新进程不在内存中，操作系统需要将新进程的代码和数据加载到内存中。

![进程替换的过程](/inset/进程替换的过程.svg)

**3. 上下文恢复**：恢复新进程的上下文信息，将程序计数器、寄存器、堆栈指针等设置为新进程的状态。

**4. 执行新进程**：内存中的新进程就绪后，操作系统将控制权转移到新进程，并开始执行新进程的指令。

:::

## 2. 系统调用

### 进程替换接口

Linux操作系统提供了6个进程替换的接口，它们声明在 `unistd.h` 头文件中。

~~~c
#include <unistd.h>

int execl(const char* pathname, const char* arg, ... /*, (char*)NULL */);
int execlp(const char* file, const char* arg, ... /*, (char*)NULL */);
int execle(const char* pathname, const char* arg, ... /*, (char*)NULL, char* const envp[] */);
int execv(const char* pathname, char* const argv[]);
int execvp(const char* file, char* const argv[]);
int execvpe(const char* file, char* const argv[], char* const envp[]);
~~~

它们的参数列表类似，其中包括可执行程序的路径和执行时的附加选项，函数名末尾带 `e` 的接口的参数可以传入环境变量。

### 接口的使用

用下面的代码对接口进行简单的使用。

~~~c
#include <unistd.h>
#include <stdio.h>

int main() {
    printf("Hello\n");
    execl("/usr/bin/uname", "uname", "-or", NULL);
    printf("World\n");
    return 0;
}
~~~

运行结果。

~~~text:no-line-numbers
Hello
6.5.0-14-generic GNU/Linux
~~~

从运行结果来看，`execl` 后的代码没有被执行，这说明 `execl` 完成了对原进程代码的替换。

为了不影响当前进程的执行，通常我们会以创建子进程，然后对子进程进行进程替换的方式执行任务。

~~~c
#include <unistd.h>
#include <sys/wait.h>
#include <stdio.h>

int main() {

    if (fork()) {
        printf("- Create child process\n");
        printf("- Wait for PID = %d\n", wait(NULL));
    } else {
        execl("/usr/bin/lsblk", "lsblk", NULL);
    }

    if (fork()) {
        printf("- Create child process\n");
        printf("- Wait for PID = %d\n", wait(NULL));
    } else {
        execl("/usr/bin/ps", "ps", NULL);
    }

    return 0;
}
~~~

运行结果

~~~text:no-line-numbers
- Create child process
NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
nvme0n1     259:0    0 476.9G  0 disk 
├─nvme0n1p1 259:1    0     1G  0 part /boot/efi
├─nvme0n1p2 259:2    0   250G  0 part /
├─nvme0n1p3 259:3    0   200G  0 part /home
└─nvme0n1p4 259:4    0    16G  0 part [SWAP]
- Wait for PID = 9757
- Create child process
    PID TTY          TIME CMD
   8918 pts/10   00:00:00 bash
   9756 pts/10   00:00:00 main
   9758 pts/10   00:00:00 ps
- Wait for PID = 9758
~~~
