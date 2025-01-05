---
title: 互斥锁的使用
date: 2023-07-04
isOriginal: true
icon: section
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

互斥锁是一种同步机制，用于保护共享资源，确保在任意时刻只有一个线程可以访问该资源。当一个线程获取到互斥锁时，其他线程将被阻塞，直到该线程释放锁。下面的伪代码大致展示了它的工作。

~~~c
bool lock = false;
...
if (lock == true)     // 锁正在被其他线程持有
    block_wait(lock); // 阻塞等待其他线程解锁，直到其他线程释放锁
lock = true;  // 加锁
/* 访问临界区.. */
lock = false; // 解锁
~~~

## 2. 互斥锁的使用

### 互斥锁操作接口

 pthread 库中提供了互斥锁 `pthread_mutex_t` 类型，以及相关的接口。

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

### 静态初始化器

另外，pthread 中还提供了一些宏。

~~~c
pthread_mutex_t fastmutex   = PTHREAD_MUTEX_INITIALIZER;
pthread_mutex_t recmutex    = PTHREAD_RECURSIVE_MUTEX_INITIALIZER_NP;
pthread_mutex_t errchkmutex = PTHREAD_ERRORCHECK_MUTEX_INITIALIZER_NP;
~~~

这些宏是互斥锁的静态初始化器，用于以静态方式初始化互斥锁。它们都可以将互斥锁初始化为静态分配的对象。也就是说，如果使用这些宏，就不需要再调用 `pthread_mutex_init()` 初始化和 `pthread_mutex_destroy()` 销毁互斥锁了。

- `PTHREAD_MUTEX_INITIALIZER`：常规的互斥锁，对应 `pthread_mutex_init()` 第二个参数为空时初始化的互斥锁。

- `PTHREAD_RECURSIVE_MUTEX_INITIALIZER_NP`：可递归（可重入）的互斥锁，它允许同一线程多次获取该互斥锁，而不会导致死锁。

- `PTHREAD_ERRORCHECK_MUTEX_INITIALIZER_NP`：带有错误检查的互斥锁，提供了对多次锁定同一互斥锁的错误检查机制。如果同一线程多次锁定该互斥锁，将会在调用 `pthread_mutex_lock()` 锁定时返回错误码 `EPERM`。
