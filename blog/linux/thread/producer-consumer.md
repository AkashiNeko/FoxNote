---
title: 生产消费模型
date: 2023-07-09
isOriginal: true
icon: section
category:
  - Linux
tag:
  - 线程
  - 生产消费模型
excerpt: 生产消费模型是一种基于生产者和消费者之间的交互关系，生产者生成数据或任务并将其放入共享资源中，消费者从共享资源中获取数据或任务进行处理。
order: 10
---

## 1. 生产者-消费者问题

生产消费模型常用于描述多线程编程中的一种并发模式，也称为生产者-消费者问题。模型涉及到两类并发执行的角色：生产者和消费者。生产者负责生成数据或任务，并将其放入共享的缓冲区中，而消费者则从缓冲区中获取数据或任务进行处理。

生产消费模型涉及到两类并发执行的角色：**生产者**和**消费者**。生产者负责生成数据或任务，并将其放入共享的缓冲区中，而消费者则从缓冲区中获取数据或任务进行处理。

如果生产者生产数据的速度比消费者消费数据的速度快，那么生产者就必须等待消费者消费完数据才能够继续生产数据，如果消费者消费数据的速度比生产者生产数据快，那么消费者就必须等待生产者生产出数据才能继续消费。所以为了达到生产数据和消费数据之间的平衡，那么就需要一个缓冲区用来存储生产者生产的数据，所以就引入了生产消费模型。

![生产消费模型](/inset/生产消费模型.svg)

生产者-缓冲区-消费者三者的关系类似于工厂-超市-顾客。有若干和工厂和若干的顾客，工厂生产出的商品交给超时进行售卖，顾客从超市购物进行消费。

## 2. 生产消费模型的实现

::: info 需要实现的功能

生产者线程不断向缓冲区（这里使用队列）中存入数据，消费者线程不断从缓冲区中取出数据。当缓冲区为空时，消费者线程应**阻塞等待**直到缓冲区有数据；同样当缓冲区满时，生产者线程应**阻塞等待**直到缓冲区有空闲空间。

:::

### 基于条件变量和阻塞队列

接下来，我们使用条件变量制作阻塞队列，实现生产消费模型。

使用一个全局链式队列作为缓冲区，数据类型为 `int`，缓冲区最大容量为 5。

~~~cpp
std::queue<int> q;            // 缓冲区
const size_t BUFFER_SIZE = 5; // 缓冲区容量
~~~

初始化条件变量和互斥量。

~~~cpp
pthread_cond_t cond_full = PTHREAD_COND_INITIALIZER;
pthread_cond_t cond_empty = PTHREAD_COND_INITIALIZER;
pthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;
~~~

生产者线程，在缓冲区没有空闲空间时应被阻塞。如果有空闲空间，则可以放入数据并通知消费者进行消费。

~~~cpp
void* producer(void*) {
    // 生产者
    while (true) {
        // 生产者生产数据
        int data = 123;

        pthread_mutex_lock(&mutex);

        while (q.size() == BUFFER_SIZE) {
            // 缓冲区满，等待
            pthread_cond_wait(&cond_empty, &mutex);
        }

        // 向缓冲区放入数据
        q.push(data);
        printf("生产者：向缓冲区放入数据；q.size() = %zu\n", q.size());

        // 通知消费者
        pthread_cond_signal(&cond_full);

        pthread_mutex_unlock(&mutex);
    }
    return nullptr;
}
~~~

消费者线程，在缓冲区中没有数据时应被阻塞。如果有数据，则可以取出数据并通知生产者进行生产。

~~~cpp
void* consumer(void*) {
    // 消费者
    while (true) {
        pthread_mutex_lock(&mutex);

        while (q.empty()) {
            // 缓冲区空，等待
            pthread_cond_wait(&cond_full, &mutex);
        }
        // 从缓冲区取走数据
        int data = q.front();
        q.pop();
        printf("消费者：从缓冲区读走数据；q.size() = %zu\n", q.size());

        // 通知生产者
        pthread_cond_signal(&cond_empty);

        pthread_mutex_unlock(&mutex);

        // 消费者消费数据
        (void)data;
    }
    return nullptr;
}
~~~

::: details 完整代码

~~~cpp
#include <stdio.h>
#include <pthread.h>
#include <queue>

std::queue<int> q;            // 缓冲区
const size_t BUFFER_SIZE = 5; // 缓冲区容量

pthread_cond_t cond_full = PTHREAD_COND_INITIALIZER;
pthread_cond_t cond_empty = PTHREAD_COND_INITIALIZER;
pthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;

void* producer(void*) {
    // 生产者
    while (true) {
        // 生产者生产数据
        int data = 123;

        pthread_mutex_lock(&mutex);

        while (q.size() == BUFFER_SIZE) {
            // 缓冲区满，等待
            pthread_cond_wait(&cond_empty, &mutex);
        }

        // 向缓冲区放入数据
        q.push(data);
        printf("生产者：向缓冲区放入数据；q.size() = %zu\n", q.size());

        // 通知消费者
        pthread_cond_signal(&cond_full);

        pthread_mutex_unlock(&mutex);
    }
    return nullptr;
}

void* consumer(void*) {
    // 消费者
    while (true) {
        pthread_mutex_lock(&mutex);

        while (q.empty()) {
            // 缓冲区空，等待
            pthread_cond_wait(&cond_full, &mutex);
        }
        // 从缓冲区取出数据
        int data = q.front();
        q.pop();
        printf("消费者：从缓冲区取出数据；q.size() = %zu\n", q.size());

        // 通知生产者
        pthread_cond_signal(&cond_empty);

        pthread_mutex_unlock(&mutex);

        // 消费者消费数据
        (void)data;
    }
    return nullptr;
}

int main() {

    // 创建一批生产者
    const int NPROS = 3;
    pthread_t producers[NPROS];
    for (int i = 0; i < NPROS; i++)
        pthread_create(producers + i, nullptr, producer, nullptr);

    // 创建一批消费者
    const int NCONS = 3;
    pthread_t consumers[NCONS];
    for (int i = 0; i < NCONS; i++)
        pthread_create(consumers + i, nullptr, consumer, nullptr);

    // never
    for (int i = 0; i < NPROS; i++)
        pthread_join(producers[i], nullptr);
    for (int i = 0; i < NCONS; i++)
        pthread_join(consumers[i], nullptr);
    return 0;
}
~~~

:::

### 基于信号量和环形队列

使用信号量和环形队列，实现生产消费模型。

使用一个全局的环形队列作为缓冲区，数据类型为 `int`，缓冲区最大容量为 5。

~~~cpp
const size_t CAPACITY = 5;    // 缓冲区容量
int ring_buf[CAPACITY];       // 缓冲区（环形队列）
size_t front = 0, rear = 0;   // 环形队列头尾指针
~~~

初始化信号量和互斥量。

~~~cpp
sem_t sem_full, sem_empty;    // 数据计数器，空间计数器
pthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;

...
// 初始化信号量
sem_init(&sem_full, CAPACITY, 0);
sem_init(&sem_empty, CAPACITY, CAPACITY);
~~~

生产者线程，在缓冲区没有空闲空间时应被阻塞。如果有空闲空间，则可以放入数据并通知消费者进行消费。

~~~cpp
void* producer(void*) {
    // 生产者
    while (true) {
        // 生产者生产数据
        int data = 123;

        // 空间计数器 P 操作
        sem_wait(&sem_empty);

        pthread_mutex_lock(&mutex);
        // 向缓冲区放入数据
        ring_buf[front++] = data;
        if (front == CAPACITY) front = 0;
        printf("生产者：向缓冲区放入数据\n");
        pthread_mutex_unlock(&mutex);

        // 数据计数器 V 操作
        sem_post(&sem_full);

    }
    return nullptr;
}
~~~

消费者线程，在缓冲区中没有数据时应被阻塞。如果有数据，则可以取出数据并通知生产者进行生产。

~~~cpp
void* consumer(void*) {
    // 消费者
    while (true) {

        // 数据计数器 P 操作
        sem_wait(&sem_full);

        pthread_mutex_lock(&mutex);
        // 从缓冲区取出数据
        int data = ring_buf[rear++];
        if (rear == CAPACITY) rear = 0;
        printf("消费者：从缓冲区取出数据\n");
        pthread_mutex_unlock(&mutex);

        // 空间计数器 V 操作
        sem_post(&sem_empty);

        // 消费者消费数据
        (void)data;
    }
    return nullptr;
}
~~~

::: details 完整代码

~~~cpp
#include <stdio.h>
#include <pthread.h>
#include <semaphore.h>

const size_t CAPACITY = 5;  // 缓冲区容量
int ring_buf[CAPACITY];     // 缓冲区（环形队列）
size_t front = 0, rear = 0; // 环形队列头尾指针

sem_t sem_full, sem_empty;  // 数据计数器，空间计数器
pthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;

void* producer(void*) {
    // 生产者
    while (true) {
        // 生产者生产数据
        int data = 123;

        // 空间计数器 P 操作
        sem_wait(&sem_empty);

        pthread_mutex_lock(&mutex);
        // 向缓冲区存入数据
        ring_buf[front++] = data;
        if (front == CAPACITY) front = 0;
        printf("生产者：向缓冲区存入数据\n");
        pthread_mutex_unlock(&mutex);

        // 数据计数器 V 操作
        sem_post(&sem_full);

    }
    return nullptr;
}

void* consumer(void*) {
    // 消费者
    while (true) {

        // 数据计数器 P 操作
        sem_wait(&sem_full);

        pthread_mutex_lock(&mutex);
        // 从缓冲区取走数据
        int data = ring_buf[rear++];
        if (rear == CAPACITY) rear = 0;
        printf("消费者：从缓冲区读走数据\n");
        pthread_mutex_unlock(&mutex);

        // 空间计数器 V 操作
        sem_post(&sem_empty);

        // 消费者消费数据
        (void)data;
    }
    return nullptr;
}

int main() {

    // 初始化空间计数器为 5，数据计数器为 0，上限都为 5
    sem_init(&sem_full, CAPACITY, 0);
    sem_init(&sem_empty, CAPACITY, CAPACITY);

    // 创建一批生产者
    const int NPROS = 3;
    pthread_t producers[NPROS];
    for (int i = 0; i < NPROS; i++)
        pthread_create(producers + i, nullptr, producer, nullptr);

    // 创建一批消费者
    const int NCONS = 3;
    pthread_t consumers[NCONS];
    for (int i = 0; i < NCONS; i++)
        pthread_create(consumers + i, nullptr, consumer, nullptr);

    // never
    for (int i = 0; i < NPROS; i++)
        pthread_join(producers[i], nullptr);
    for (int i = 0; i < NCONS; i++)
        pthread_join(consumers[i], nullptr);
    return 0;

    sem_destroy(&sem_full);
    sem_destroy(&sem_empty);
}
~~~

:::
