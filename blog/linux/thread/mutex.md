---
title: 互斥锁
date: 2023-07-04
isOriginal: true
icon: book
category:
  - Linux
tag:
  - 线程
  - 互斥锁
excerpt: 当多个线程同时访问共享资源时，可能会引发并发访问的问题。为了避免这些问题，可以使用互斥锁实现线程之间的互斥访问。
order: 4
---

## 1. 初识互斥锁

当多个线程同时访问共享资源时，可能会引发并发访问的问题，例如数据竞争（Data Race）和不一致的状态。为了避免这些问题，可以使用互斥锁（Mutex）来实现线程之间的互斥访问。

互斥锁是一种同步机制，用于保护共享资源，确保在任意时刻只有一个线程可以访问该资源。当一个线程获取到互斥锁时，其他线程将被阻塞，直到该线程释放锁。下面的伪代码大致展示了它的工作（这里使用死循环代替阻塞，它的实际原理将在之后讲到）。

~~~c
bool lock = false;

do {
    if (lock == true) // 锁正在被其他线程持有
        continue; // 等待，直到其他线程释放锁

    // 暂时没有进行其他线程持有锁
    lock = true;  // 加锁
    /* 访问临界区 */
    lock = false; // 解锁
} while (0);
~~~

## 2. pthread中的互斥锁

`pthread` 库中提供了互斥锁 `pthread_mutex_t` 类型，以及相关的接口。

~~~c
#include <pthread.h>

int pthread_mutex_init(pthread_mutex_t *mutex, const pthread_mutexattr_t *mutexattr);
int pthread_mutex_destroy(pthread_mutex_t *mutex);

int pthread_mutex_lock(pthread_mutex_t *mutex);
int pthread_mutex_trylock(pthread_mutex_t *mutex);
int pthread_mutex_unlock(pthread_mutex_t *mutex);
~~~

我们可以在之前的代码中，为临界资源加上锁：

~~~c{5,9,11,18,23}
#include <stdio.h>
#include <pthread.h>

size_t cnt = 0;
pthread_mutex_t mutex;

void* routine(void* arg) {
    for (size_t i = 0; i < 100000; ++i) {
        pthread_mutex_lock(&mutex);
        ++cnt;
        pthread_mutex_unlock(&mutex);
    }
    return NULL;
}

int main() {
    pthread_t tid[2] = {0, 0};
    pthread_mutex_init(&mutex, NULL);
    pthread_create(&tid[0], NULL, routine, NULL);
    pthread_create(&tid[1], NULL, routine, NULL);
    pthread_join(tid[0], NULL);
    pthread_join(tid[1], NULL);
    pthread_mutex_destroy(&mutex);
    printf("cnt = %zu\n", cnt);
    return 0;
}
~~~

使用了互斥锁之后再编译运行代码，此时的结果就不再会出现之前的问题了。

~~~txt:no-line-numbers
$ g++ main.cpp -o main -O0
$ ./main 
cnt = 200000
~~~

另外，`pthread` 中还提供了三个宏。

~~~c
pthread_mutex_t fastmutex   = PTHREAD_MUTEX_INITIALIZER;
pthread_mutex_t recmutex    = PTHREAD_RECURSIVE_MUTEX_INITIALIZER_NP;
pthread_mutex_t errchkmutex = PTHREAD_ERRORCHECK_MUTEX_INITIALIZER_NP;
~~~

## ... TODO
