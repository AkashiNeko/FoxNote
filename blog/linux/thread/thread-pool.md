---
title: 线程池
date: 2023-07-11
isOriginal: true
icon: section
category:
  - Linux
tag:
  - 线程
  - 线程池
excerpt: 线程池是一种管理和复用线程的机制，它通过预先创建一组线程，接收任务并将其分配给可用线程来提高执行效率，避免频繁创建和销毁线程的开销。
order: 11
---

线程池是对线程的池化技术，也就是事先创建好一批线程，在需要执行并发任务时使用，以减小线程创建时和销毁时的开销。同时，线程池还能保证限制线程的数量，以控制系统的并发度，可以避免过度占用系统资源。

## 1. 线程池的工作流程

线程池本质上也是一个生产消费模型，它的工作流程如下。

- 在程序启动时，预先创建好一组线程，这些线程阻塞等待任务到来。

![预先创建一批线程](/inset/线程池-预先创建线程.svg)

- 当有任务需要执行时，可以将任务提交给线程池执行。

![提交任务到线程池](/inset/线程池-提交任务.svg)

- 任务将被线程池分配给一个空闲的线程执行，线程执行完任务后，恢复到空闲状态继续等待。

![处理任务](/inset/线程池-处理任务.svg)

- 当同时出现大量任务，线程池中的所有线程都被任务占用时，提交的任务需要排队等待线程空闲。

![任务队列](/inset/线程池-任务队列.svg)

## 2. 线程池的实现

我们为线程池实现一个C++类，提供 `push()` 方法，用于提交任务。用条件变量控制线程的执行和阻塞。使用 `std::vector` 管理一组线程，使用 `std::queue` 作为任务队列。

~~~cpp
class ThreadPool {
    std::mutex mutex_;                        // 互斥锁
    std::condition_variable cond_;            // 条件变量
    std::vector<std::thread> threads_;        // 工作线程
    std::queue<std::function<void()>> taskq_; // 任务队列
    bool running_;                            // 运行状态

public:
    ThreadPool(size_t nthreads);            // 创建线程池（创建一组线程，可指定线程数）
    ~ThreadPool();                          // 销毁线程池（停止所有线程并回收资源）

    template <class Task, class ...Args>
    void push(Task&& task, Args&& ...args); // 向线程池提交任务
};
~~~

创建线程池时，初始化一组线程。每个工作线程所做的工作和[生产消费模型](./producer-consumer.html#基于条件变量和阻塞队列)中消费者线程的工作类似。其中 `nthreads` 是要创建的工作线程的数量。

~~~cpp
ThreadPool(size_t nthreads) {
    std::unique_lock<std::mutex> lock;
    for (size_t i = 0; i < nthreads; ++i) {
        // 创建线程，以及定义线程做的工作
        threads_.emplace_back([this]() {
            while (true) {
                std::unique_lock<std::mutex> lock(mutex_);
                while (running_ && taskq_.empty())
                    cond_.wait(lock);
                if (!running_) return;
                auto task = std::move(taskq_.front());
                taskq_.pop();
                lock.unlock();
                // 线程执行任务
                task();
            }
        });
    }
    // 线程创建完毕，设置运行状态为 true
    running_ = true;
}
~~~

销毁线程池时，回收所有线程。

~~~cpp
~ThreadPool() {
    {
        std::unique_lock<std::mutex> lock(mutex_);
        running_ = false;   // 设置运行状态为 false
        cond_.notify_all(); // 通知所有线程
    }
    for (std::thread& t : threads_)
        t.join();
}
~~~

提交任务时，条件变量通知线程从队列里取任务。

~~~cpp
template <class Function, class ...Args>
void push(Function&& task, Args&& ...args) {
    std::unique_lock<std::mutex> lock(mutex_);
    // 将要执行的任务打包成 lambda，存入队列
    taskq_.emplace([=]() {
        task(args...);
    });
    // 通知单个线程从队列取任务
    cond_.notify_one();
}
~~~

使用线程池时，只需要将要执行的任务提交到线程池。

~~~cpp
ThreadPool tp;
...
tp.push([]() {
    // do something...
});
~~~

::: details 完整代码

~~~cpp
#include <iostream>
#include <vector>
#include <queue>
#include <functional>
#include <thread>
#include <mutex>
#include <condition_variable>

class ThreadPool {
    std::mutex mutex_;
    std::condition_variable cond_;
    std::vector<std::thread> threads_;
    std::queue<std::function<void()>> taskq_;
    bool running_;
public:
    ThreadPool(size_t nthreads = 4) {
        std::unique_lock<std::mutex> lock;
        for (size_t i = 0; i < nthreads; ++i) {
            threads_.emplace_back([this]() {
                while (true) {
                    std::unique_lock<std::mutex> lock(mutex_);
                    while (running_ && taskq_.empty())
                        cond_.wait(lock);
                    if (!running_) return;
                    auto task = std::move(taskq_.front());
                    taskq_.pop();
                    lock.unlock();
                    task();
                }
            });
        }
        running_ = true;
    }
    ~ThreadPool() {
        mutex_.lock();
        running_ = false;
        cond_.notify_all();
        mutex_.unlock();
        for (std::thread& t : threads_)
            t.join();
    }
    template <class Task, class ...Args>
    void push(Task&& task, Args&& ...args) {
        std::unique_lock<std::mutex> lock(mutex_);
        taskq_.emplace([=]() {
            task(args...);
        });
        cond_.notify_one();
    }
};

int main() {
    ThreadPool pool;
    // 提交 10 个任务给线程池，每个任务都是打印 "hello"
    for (int i = 0; i < 10; ++i) {
        pool.push([]() {
            std::cout << "hello" << std::endl;
        });
    }
    getchar();
    return 0;
}
~~~

:::
