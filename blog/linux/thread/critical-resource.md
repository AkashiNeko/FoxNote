---
title: 临界资源
date: 2023-07-03
isOriginal: true
icon: section
category:
  - Linux
tag:
  - 线程
  - 临界资源
excerpt: 临界资源是并发编程中被多个线程或进程共享访问的资源，例如共享变量、共享数据结构、共享文件、共享设备等。
order: 3
---

下面是一个很经典的案例，两个线程同时对一个全局变量进行++操作。每个线程对这个全局变量操作 100,000 次，所以++操作总共执行了 200,000 次。理论上操作完之后的 `cnt` 值应该为 200,000。

~~~c
#include <stdio.h>
#include <pthread.h>

size_t cnt = 0;

void* routine(void* arg) {
    for (size_t i = 0; i < 100000; ++i)
        ++cnt;
    return NULL;
}

int main() {
    pthread_t tid[2] = {0, 0};
    pthread_create(&tid[0], NULL, routine, NULL);
    pthread_create(&tid[1], NULL, routine, NULL);
    pthread_join(tid[0], NULL);
    pthread_join(tid[1], NULL);
    printf("cnt = %zu\n", cnt);
    return 0;
}
~~~

编译代码，关闭编译器优化。

~~~bash:no-line-numbers
$ gcc -o main main.c -O0 -lpthread
$ ./main 
cnt = 116601
$ ./main 
cnt = 110954
$ ./main 
cnt = 112617
~~~

反复运行代码，可以发现每次 `cnt` 的值不仅离 200,000 差得远，而且每次的结果还不一样。

观察 `++cnt` 对应的汇编。实际上它对应了三条汇编语句。

~~~asm
mov eax, dword ptr [cnt]   ; (1) 将 cnt 的值从内存加载到寄存器 eax 中
add eax, 1                 ; (2) 将寄存器 eax 中的值加 1
mov dword ptr [cnt], eax   ; (3) 将寄存器 eax 中的值存回内存 cnt 中
~~~

假设 `cnt` 的值当前为 20，那么第一条汇编一句则是将 20 这个值从内存中读到寄存器 `eax` 中。

![从内存中读入寄存器eax](/inset/从内存中读入寄存器eax.svg =320x)

第二条汇编语句，让 `eax` 寄存器的值加一。

![eax寄存器的值加一](/inset/eax寄存器的值加一.svg =320x)

最后一条汇编语句，将寄存器 `eax` 中的值写回内存中。

![从寄存器eax中写回内存](/inset/从寄存器eax中写回内存.svg =320x)

在[进程调度](/linux/proc/scheduling.html)章节，我们知道 Linux 是采用时间片轮转的方式进行进程调度的，而在 CPU 眼里，线程是和进程相同的实体。所以线程在执行时，也可能会在任意位置被切换走。

在以上第二条汇编语句执行完之后，第三条写回内存的汇编语句执行之前，寄存器中的数据和内存中的数据是不一致的。如果此时线程被切换，另一个线程对 `cnt` 的值进行了修改，当调度器再次切回该线程的时候，第三条写回内存的汇编语句被执行，`cnt` 的值就会被不正确地覆盖。

![两个线程同时读写内存造成的数据异常](/inset/两个线程同时读写内存造成的数据异常.svg)

可以发现，造成数据不正确的本质原因是，在某个线程从内存中读走数据后，还没来得及处理和写回内存就被切换走了，并且其他的线程还对这块内存进行了修改。这里的 `cnt` 变量就是可以同时被多个线程同时读写的数据，称为**临界资源**。

::: info 临界资源

临界资源（Critical Resource）是指在并发编程中被多个线程或进程共享访问的资源，如共享变量、共享数据结构、共享文件、共享设备等。

由于多个线程或进程可以同时访问临界资源，如果没有适当的同步机制来保护它们，可能会导致竞态条件（Race Condition）的发生，从而导致数据不一致、程序错误或异常行为。

:::
