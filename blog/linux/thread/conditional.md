---
title: 条件变量
date: 2023-07-07
isOriginal: true
icon: section
category:
  - Linux
tag:
  - 线程
  - 条件变量
excerpt: 条件变量是多线程编程中用于线程等待和通知的同步机制，允许线程在某个条件满足前等待，以避免忙等待并提高多线程程序效率。
order: 8
---

条件变量（Condition Variable）是多线程编程中的一种同步机制，用于线程之间的等待和通知。它允许一个或多个线程等待某个特定条件的发生，而不需要消耗 CPU 资源。条件变量通常与互斥锁（Mutex）一起使用，以实现线程之间的协调。

当一些线程在同时等待某种资源的时候，就可以使用条件变量来控制线程的等待和执行。以下是 pthread 库中条件变量的相关接口。

~~~c
#include <pthread.h>

pthread_cond_t cond = PTHREAD_COND_INITIALIZER;

int pthread_cond_init(pthread_cond_t *cond, pthread_condattr_t *cond_attr);
int pthread_cond_signal(pthread_cond_t *cond);
int pthread_cond_broadcast(pthread_cond_t *cond);
int pthread_cond_wait(pthread_cond_t *cond, pthread_mutex_t *mutex);
int pthread_cond_timedwait(pthread_cond_t *cond, pthread_mutex_t *mutex, const struct timespec *abstime);
int pthread_cond_destroy(pthread_cond_t *cond);
~~~

当某个线程执行 `pthread_cond_wait()` 时，该线程会被阻塞住，并释放互斥锁等待直到被唤醒。被阻塞住的线程需要使用 `pthread_cond_signal()` 或 `pthread_cond_broadcast()` 唤醒，如果有多个线程正在被阻塞，那么前者的作用是随机唤醒其中一个线程，后者是唤醒所有阻塞中的线程。线程被唤醒后，会尝试重新获得锁。

它们大致的工作流程如下表。

| 事件 | 互斥锁状态 | 线程状态 |
| :-: | :-: | :-: |
| ... | 锁定🔒 | 运行⏸ |
| 调用 `pthread_cond_wait()` | 解除🔓 | 阻塞⏹ |
| ... | 解除🔓 | 阻塞⏹ |
| 收到唤醒通知 | 尝试锁定🔐 | 阻塞⏹ |
| 获取锁成功 | 锁定🔒 | 运行⏸ |
| ... | 锁定🔒 | 运行⏸ |

~~~c{12,25}
#include <stdio.h>
#include <pthread.h>
#include <unistd.h>

pthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;
pthread_cond_t cond = PTHREAD_COND_INITIALIZER;

void* routine(void* arg) {
    const char* n = (const char*)arg;
    while (1) {
        pthread_mutex_lock(&mutex);
        pthread_cond_wait(&cond, &mutex);
        printf("thread %s: hello\n", n);
        pthread_mutex_unlock(&mutex);
    }
    return NULL;
}

int main() {
    pthread_t tid1, tid2;
    pthread_create(&tid1, NULL, routine, (void*)"1");
    pthread_create(&tid2, NULL, routine, (void*)"2");
    while (1) {
        printf("main thread: signal\n");
        pthread_cond_signal(&cond);
        sleep(1);
    }
    pthread_join(tid1, NULL);
    pthread_join(tid2, NULL);
    return 0;
}
~~~

主线程执行 `pthread_cond_signal()` 时，会随机唤醒一个正在被 `pthread_cond_wait()` 阻塞的线程，运行结果如下。

~~~txt:no-line-numbers
$ ./main 
main thread: signal
thread 1: hello
main thread: signal
thread 2: hello
main thread: signal
thread 1: hello
...
~~~

如果将上面代码中的 `pthread_cond_signal` 改为 `pthread_cond_broadcast`，那么主线程每次都会唤醒所有线程。

~~~txt:no-line-numbers
$ ./main 
main thread: signal
thread 2: hello
thread 1: hello
main thread: signal
thread 2: hello
thread 1: hello
~~~

需要注意的是，就算 `pthread_cond_broadcast()` 同时放行了所有线程，接下来这些线程也会因为竞争锁，而依次执行。
