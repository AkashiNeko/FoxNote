---
title: 线程概念
date: 2023-07-01
isOriginal: true
icon: section
category:
  - Linux
tag:
  - 线程
excerpt: 在Linux中，线程与进程共享相同的资源，比如内存空间、文件描述符等。
order: 1
---

## 1. Linux下的线程

在操作系统教材中，都会有这样一句话：

> 进程是资源分配的基本单位，线程是CPU调度的基本单位

在Linux中，线程（Thread）与进程共享相同的资源，比如内存空间、文件描述符等。在Linux内核中，线程的实现方式与进程非常相似，并没有专门区分进程和线程的 `task_struct` 结构体。对于CPU来说，线程被视为与进程相同的实体。和进程一样，Linux内核也使用 `task_struct` 结构体来表示线程。

![Linux下的线程](/inset/Linux下的线程.svg)

由于线程共享进程的资源，所以可以说线程是在进程“内部”运行的。如果线程发生异常崩溃，会导致整个线程崩溃，而线程是进程的执行分支，进程中的其他所有线程也会随之终止。

虽然线程和进程共享地址空间，但线程也有一些自己独立的数据，比如函数栈、线程ID（TID）、寄存器上下文、线程控制块（TCB）、线程局部存储（TLS）等。

## 2. 优点和缺点

::: tip 线程的优点

- 轻量级：线程和进程共享同一进程的资源，所以创建和销毁线程比创建和销毁进程更加高效。

- 上下文切换：线程之间进行上下文切换比在进程之间进行上下文切换更为快速和高效。

- 资源共享：线程可以共享进程的资源，这使得资源的管理更为灵活和高效。

- 并发性：在某些情况下，使用线程可以实现更好的并发性能，因为它们可以利用多核处理器并发执行任务。

:::

::: warning 线程的缺点

- 共享状态：多个线程可以同时访问和修改共享数据，这可能导致竞态条件、死锁和数据不一致等问题。

- 调试困难：多线程程序的调试通常比单线程程序更加困难，因为在并发环境中出现的问题复现更困难，而且由于线程间的交互，出错的原因可能更加难以追踪和定位。

- 资源竞争：多线程程序容易出现资源竞争问题，例如多个线程同时访问共享资源而导致的数据竞争。

- 复杂的设计：多线程编程通常需要更复杂的设计和实现，包括对同步问题的处理，增加了程序的复杂性和开发成本。

:::

## 3. 多线程和多进程

在Linux操作系统中，进程之间是相互独立的，每个进程都有自己的地址空间、内存和系统资源。进程之间的通信通常需要通过 IPC 机制，如管道、消息队列、共享内存等。而多线程是在同一个进程内创建多个线程，每个线程都共享相同的地址空间和系统资源。线程是在进程内部执行的独立执行路径，共享进程的上下文环境。多线程的优势在于线程之间的切换开销较小，可以更有效地利用系统资源。

选择使用多进程还是多线程取决于具体的应用需求和场景。多进程适用于需要隔离、安全性要求高的任务，而多线程适用于需要高效利用系统资源、共享数据的任务。