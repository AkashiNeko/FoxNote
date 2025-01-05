---
title: 自旋锁
date: 2023-07-12
isOriginal: true
icon: section
category:
  - Linux
tag:
  - 线程
  - 自旋锁
excerpt: 自旋锁是一种基于忙等待的同步机制，当一个线程获取锁时，其他线程会循环等待直到锁被释放。
order: 6
---

## 1. 自旋锁的原理

当多个执行流互斥使用某些资源的时候，就需要使用锁。只有获取了锁的执行流才能对资源进行访问。在之前的互斥锁中，没有得到锁的线程需要将自己阻塞起来，直到获取锁再恢复运行。而本文中讲述的自旋锁，则是一直**循环等待**（自旋）判断持有锁的线程是否已经释放锁，它不用将自己阻塞起来。

自旋锁的原理比较简单，简单来说可以描述成以下的代码。

~~~c
bool lock = false;
...
while (lock);
lock = true;
// 临界区..
lock = false;
~~~

自旋锁可以避免操作系统的线程调度切换，所以可以在**竞争较小**（等待锁时间较短）的情况下使用，比如在操作系统内核中经常会使用到自旋锁。但是如果长时间持有锁，其他线程需要不断自旋获取锁，性能开销将会非常大。

## 2. 自旋锁的使用

pthread 库中提供了自旋锁相关的接口。

~~~c
#include <pthread.h>

int pthread_spin_init(pthread_spinlock_t *lock, int pshared);
int pthread_spin_destroy(pthread_spinlock_t *lock);

int pthread_spin_lock(pthread_spinlock_t *lock);
int pthread_spin_trylock(pthread_spinlock_t *lock);
int pthread_spin_unlock(pthread_spinlock_t *lock);
~~~

使用自旋锁作为互斥量，可以将之前代码中的互斥锁改为自旋锁。

~~~c
#include <stdio.h>
#include <pthread.h>

size_t cnt = 0;
pthread_spinlock_t spin;

void* routine(void* arg) {
    for (size_t i = 0; i < 100000; ++i) {
        pthread_spin_lock(&spin);
        ++cnt;
        pthread_spin_unlock(&spin);
    }
    return NULL;
}

int main() {
    pthread_t tid[2] = {0, 0};
    pthread_spin_init(&spin, 0);
    pthread_create(&tid[0], NULL, routine, NULL);
    pthread_create(&tid[1], NULL, routine, NULL);
    pthread_join(tid[0], NULL);
    pthread_join(tid[1], NULL);
    pthread_spin_destroy(&spin);
    printf("cnt = %zu\n", cnt);
    return 0;
}
~~~
