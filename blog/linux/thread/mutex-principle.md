---
title: 互斥锁的原理
date: 2023-07-05
isOriginal: true
icon: section
category:
  - Linux
tag:
  - 互斥锁
  - 原子操作
  - 原语
excerpt: 原子操作和原语用于确保多个线程或进程之间对共享资源的安全访问和操作。
order: 5
---

## 1. 原子操作和原语

原子操作（Atomic Operation）是指一个操作在执行过程中不会被中断的特性。在多线程环境下，原子操作是一种确保操作的完整性和一致性的机制。原子操作要么完全执行，要么完全不执行，不存在部分执行的情况。

在之前[临界资源](/linux/thread/critical-resource.html)章节中，`++cnt` 这个语句就不是一个原子操作，因为它由三条汇编语句组成，存在部分执行的情况。

原语（Primitive）是一种基本的操作或函数，提供了一组原子操作，用于实现更高级别的同步和并发控制机制。原语通常由操作系统提供，并且是线程或进程的基本构建块。

C11 标准引入了 `stdatomic.h` 头文件，定义了一组原子类型，如 `atomic_int`、`atomic_flag` 等。这些类型提供了原子的读写操作，可以用于实现特定的原子操作。使用原子操作，可以将之前的代码改为：

~~~c{5,9}
#include <stdio.h>
#include <stdatomic.h>
#include <pthread.h>

atomic_int cnt = ATOMIC_VAR_INIT(0);

void* routine(void* arg) {
    for (size_t i = 0; i < 100000; ++i)
        atomic_fetch_add(&cnt, 1); // 原子操作
    return NULL;
}

int main() {
    pthread_t tid[2] = {0, 0};
    pthread_create(&tid[0], NULL, routine, NULL);
    pthread_create(&tid[1], NULL, routine, NULL);
    pthread_join(tid[0], NULL);
    pthread_join(tid[1], NULL);
    printf("cnt = %u\n", cnt);
    return 0;
}
~~~

当线程的时间片用尽时，操作系统的调度器会中断当前线程的执行，并将处理器分配给其他准备就绪的线程。这种中断是由操作系统的时钟中断（timer interrupt）触发的。而原语会使用特定的指令或操作来**关中断**，以阻止中断请求的触发，确保关键代码段的执行不会被中断。

~~~c:no-line-numbers
原语 {
    关中断指令
    /* 执行原子操作，保证不会中途被切换 */
    开中断指令
}
~~~

## 2. 互斥锁的实现

在 X86 的 Linux 机器上，加锁的操作主要是由 `xchg` 指令完成的。这条指令的作用是交换两个值，类似于 `swap` 函数。

~~~c
void swap(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}
~~~

加锁和解锁的过程大致如下。其中 `mutex_lock` 和 `mutex_unlock` 分别是加锁和解锁对应的指令。`locked` 是内存中的一个全局变量，它的初值为 0。每个线程都有一份寄存器 `al`，上下文切换时，线程会带走自己寄存器 `al` 中的值，并在下一次切回的时候恢复该寄存器的值。

~~~asm{8-13,17-19}
.section .data
    locked:
        .byte 0

.section .text
.global mutex_lock
.type mutex_lock, @function
mutex_lock:
    movb $1, %al       # 将寄存器 AL 的值设置为 1
    xchg %al, locked   # 交换 AL 寄存器的值和内存中 locked 的值
    test %al, %al      # 检查 AL 寄存器的值是否为 0
    jnz mutex_lock     # 如果 AL 不为 0，表示锁已被占用，继续尝试获取锁
    ret                # 如果寄存器 AL 的值为 0，则获取锁成功

.global mutex_unlock
.type mutex_unlock, @function
mutex_unlock:
    movb $0, locked    # 直接将 locked 内存位置的值设置为 0，释放锁
    ret
~~~

### 获取锁

最初，锁是空闲状态的，某个线程想要获取锁：

| 指令 | 线程 `al` | 全局 `locked` | 说明 |
| :-: | :-: | :-: | :-: |
| `movb $1, %al` | 1 | 0 | 将 `al` 设为 1 |
| `xchg %al, locked` | 0 | 1 | 交换二者的值 |

接下来，它会判断 `al` 的值是否为 0。如果为 0，则获取锁成功，可以发现，内存中的 `locked` 由 0 变为了 1。

此时，如果有其他线程尝试获取锁：

| 指令 | 线程 `al` | 全局 `locked` | 说明 |
| :-: | :-: | :-: | :-: |
| `movb $1, %al` | 1 | 1 | 将 `al` 设为 1 |
| `xchg %al, locked` | 1 | 1 | 交换二者的值 |

可以发现，交换 `al` 和 `locked` 的值之后，`al` 仍然为 1，此时程序将会重复上面的获取锁的过程（实际上 Linux 并不会让该线程陷入死循环等待，而是利用了 Linux 内核提供的 futex 机制，实现用户空间的快速互斥锁，在低竞争和短期等待的情况下能够提供很好的性能，并且能够在高竞争情况下适当地进入睡眠状态以避免消耗过多的 CPU 资源）。

以上的汇编语句中，线程在任意位置被切换走，都不会导致数据不一致而引发异常，读者可以自行推导。

### 释放锁

释放锁的过程相对简单，只需要将全局的 `locked` 置为 0，就意味着解锁了。

| 指令 | 全局 `locked` | 说明 |
| :-: | :-: | :-: |
| `movb $0, locked` | 0 | 将 `locked` 设为 1 |
