---
title: POSIX信号量
date: 2023-07-08
isOriginal: true
icon: section
category:
  - Linux
tag:
  - 线程
  - 信号量
excerpt: 信号量是一种用于进程间同步和互斥的机制，用于控制对共享资源的访问，通过计数或二进制状态来实现。
order: 9
---

## 1. 信号量机制

信号量是一种用于实现线程间同步和互斥的机制，基于计数器的思想。信号量维护一个整数值，并提供了两个基本操作：等待（P 操作）和发信号（V 操作）。

::: info 信号量的操作

- **P操作**（等待操作）：当一个线程想要访问一个由信号量保护的共享资源时，它首先执行 P 操作。
如果信号量的值大于零，表示有可用资源，线程可以继续执行访问该资源的操作，并将信号量的值减一。
如果信号量的值为零，表示资源已被其他线程占用，当前线程会被阻塞（挂起）等待，直到其他线程发出 V 操作。

- **V操作**（发信号操作）：当一个线程使用完共享资源后，它应该执行 V 操作，即发出一个信号。
V 操作会将信号量的值加一，表示释放了一个资源。
如果有其他线程在等待该信号量，其中一个线程会被唤醒，继续执行访问共享资源的操作。

:::

## 2. 信号量的接口

在 POSIX 线程库（pthread）中没有提供直接的信号量操作接口，是因为 POSIX 线程库的设计目标主要是提供轻量级的线程管理和同步机制，而不是完整的进程间通信机制，POSIX 信号量相关接口单独声明在头文件 `<semaphore.h>` 中。

~~~c
#include <semaphore.h>

int sem_init(sem_t *sem, int pshared, unsigned int value); // 初始化一个信号量
int sem_destroy(sem_t *sem);                               // 销毁一个信号量
int sem_wait(sem_t *sem);                                  // P 操作（等待）
int sem_post(sem_t *sem);                                  // V 操作（发信号）
int sem_getvalue(sem_t *restrict sem, int *restrict sval); // 获取信号量的当前值
~~~

## 3. 使用示例

以下是对条件变量的简单使用。我们让主线程执行 V 操作，新线程执行 P 操作。

~~~c
#include <stdio.h>
#include <pthread.h>
#include <semaphore.h>
#include <unistd.h>

void* routine(void* arg) {
    sem_t* psem = (sem_t*)arg;
    int value = 0;
    sem_getvalue(psem, &value);
    printf("thread begin.. sem = %d\n", value);
    while (1) {
        sem_wait(psem); // P 操作
        sem_getvalue(psem, &value);
        printf("P操作, sem -= 1, value = %d\n", value);
    }
    return NULL;
}

int main() {
    sem_t sem;
    sem_init(&sem, 3, 3);
    pthread_t tid;
    pthread_create(&tid, NULL, routine, (void*)&sem);
    pthread_detach(tid);
    while (1) {
        sleep(1);
        sem_post(&sem); // V 操作
        int value = 0;
        sem_getvalue(&sem, &value);
        printf("V操作, sem += 1, value = %d\n", value);
    }
    return 0;
}
~~~

编译执行程序。初始时信号量的值为 3，创建的新线程循环执行 P 操作，直到信号量减为 0 时被阻塞住。之后每隔一秒，主线程进行 V 操作，一旦信号量的值超过 0，新线程就解除阻塞并对信号量减一。输出结果如下。

~~~txt:no-line-numbers
$ ./main 
thread begin.. sem = 3
P操作, sem -= 1, value = 2
P操作, sem -= 1, value = 1
P操作, sem -= 1, value = 0
V操作, sem += 1, value = 1
P操作, sem -= 1, value = 0
V操作, sem += 1, value = 1
P操作, sem -= 1, value = 0
...
~~~
