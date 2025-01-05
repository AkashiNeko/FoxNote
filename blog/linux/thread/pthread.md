---
title: POSIX线程库
date: 2023-07-02
isOriginal: true
icon: section
category:
  - Linux
tag:
  - 线程
excerpt: 初识POSIX线程库pthread，线程的创建和回收方法。
order: 2
---

 pthread（POSIX Threads）是一个线程库，用于在类Unix操作系统中进行多线程编程。它定义了应用程序与操作系统之间的接口，使不同 Unix 系统上编写的程序可以具有可移植性。[wiki](https://zh.wikipedia.org/zh-cn/POSIX%E7%BA%BF%E7%A8%8B)

 pthread 的库文件位于 `/usr/libx32/` 目录下，头文件位于 `/usr/include/pthread.h`。

~~~c:no-line-numbers
$ ls /usr/libx32/libpthread*
/usr/libx32/libpthread.a  /usr/libx32/libpthread.so.0  /usr/libx32/libpthread_nonshared.a

$ ls /usr/include/pthread.h
/usr/include/pthread.h
~~~

如果使用了 pthread 库，编译时需要额外链接这个库。比如 `g++` 编译器需要带上参数 `-lpthread`。

## 1. 线程的创建

 pthread 库中提供了一系列的函数调用，它们都以 `pthread_` 开头。要创建一个线程，需要使用其中的 `pthread_create()` 函数。

~~~c
#include <pthread.h>

/* Thread identifiers. The structure of the attribute type is not exposed on purpose. */
typedef unsigned long int pthread_t;

int pthread_create(pthread_t *restrict thread,
                   const pthread_attr_t *restrict attr,
                   void *(*start_routine)(void *),
                   void *restrict arg);
~~~

::: info 参数说明

- `thread`：进程标识符 TID，它的类型为 `pthread_t`，本质上是 `unsigned long int`，作为唯一标记某个线程的 ID。如果线程创建成功，它将以输出参数的形式返回。

- `attr`：它可以指定新线程的一些属性，比如线程的栈大小、调度策略、优先级等。设为空指针时则使用默认的属性值。

- `start_routine`：新线程的代码入口，它是指向参数为 `void*`，返回值为 `void*` 的函数指针。

- `arg`：调用 `start_routine` 函数时使用的参数。

:::

和使用 `exit()` 退出进程一样，线程也有类似的直接退出方法 `pthread_exit()`。因为线程的返回值是 `void*`，所以它需要一个该类型的参数。

~~~c
#include <pthread.h>

[[noreturn]] void pthread_exit(void *retval);
~~~

## 2. 线程的回收

和内存申请，子进程创建一样，用完后的资源必须被回收。在线程退出之后，需要回收它的资源。 pthread 库中提供了 `pthread_join()` 函数，它可以让执行完的线程“加入”到当前的执行流，完成资源回收。

~~~c
#include <pthread.h>

int pthread_join(pthread_t thread, void **retval);
~~~

::: info 参数说明

- `thread`：要回收的进程的 TID。

- `retval`：它是 `void**` 类型的指针，用于接收线程函数 `void*` 类型的返回值。如果忽略返回值，可设为空指针。

:::

如果待回收的线程还没有执行完，那么调用 `pthread_join()` 时会阻塞住，直到该线程执行完毕。

另外，在创建线程之后，可以使用 `pthread_detach()` 分离线程。这样当线程退出后，不需要再调用 `pthread_join()`，它会自动进行回收。

~~~c
#include <pthread.h>

int pthread_detach(pthread_t thread);
~~~

也可以使用 `pthread_cancel()` 来取消一个线程，它可以终止指定线程的运行。这种做法是危险的，因为线程可能正在执行一个尚未完成的任务时被中断，造成的后果可能是难以预料的。

~~~c
#include <pthread.h>

int pthread_cancel(pthread_t thread);
~~~

## 3. 示例代码

使用以下代码，创建一个新线程，传入 `"Hello"` 参数，运行结束后返回 `"World"`。

~~~c
void* routine(void* arg) {
    printf("%s\n", (const char*)arg);
    return (void*)"World";
}

int main() {
    pthread_t tid = 0UL;
    pthread_create(&tid, NULL, routine, (void*)"Hello");

    void* result = NULL;
    pthread_join(tid, &result);
    printf("%s\n", (const char*)result);
    return 0;
}
~~~

编译时链接 pthread 库。

~~~bash:no-line-numbers
gcc main.c -o main -lpthread
~~~

~~~txt:no-line-numbers
$ ./main 
Hello
World
~~~
