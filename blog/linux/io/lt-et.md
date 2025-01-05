---
title: epoll的LT模式和ET模式
date: 2023-12-09
isOriginal: true
icon: section
category:
  - Linux
tag:
  - IO
excerpt: epoll的两种工作模式：水平触发（Level Trigger，LT）和边缘触发（Edge Trigger，ET）。
order: 7
---

## 1. 电学中的LT和ET

水平触发（Level Trigger，LT）和边缘触发（Edge Trigger，ET）两个词来自电学中触发器的类型。

- 水平触发（Level Trigger，LT）：在输入信号保持在特定电平时触发的触发器。当输入信号的电平达到或保持在预设的水平时，触发器会被触发。

- 边缘触发（Edge Trigger，ET）：在输入信号发生边沿变化时触发的触发器。边缘可以是上升沿（上升边缘）或下降沿（下降边缘），具体取决于触发器的设计。

::: echarts  LT触发和ET触发的时机

~~~js
option = {
    legend: {
        // Try 'horizontal'
        orient: 'vertical',
        right: 10,
        top: 'center'
    },
    xAxis: {
        type: 'category',
        data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name: '电平信号',
            type: 'line',
            step: 'end',
            data: [0.5, 0.5, 2.5, 2.5, 2.5, 0.5, 0.5, 2.5, 2.5, 0.5, 0.5]
        },
        {
            name: 'LT触发',
            type: 'line',
            data: ['-', '-', 2.7, 2.7, 2.7, 2.7, '-', 2.7, 2.7, 2.7, '-']
        },
        {
            name: 'ET触发',
            type: 'scatter',
            data: [
                [2, 2.6],
                [7, 2.6]
            ]
        }
    ]
};
~~~

:::

在 `epoll` 中，可以将fd的就绪看作高电平，没有就绪看作低电平。那么LT模式的触发条件是持续处于高电平，ET模式的触发条件是一次电信号将低电平变为高电平。

## 2. epoll的LT触发

`epoll` 的默认工作模式是LT，这与 `select` 和 `poll` 是相同的。

我们可以用下面的代码简单验证LT模式。

~~~c
// Linux
#include <unistd.h>
#include <sys/epoll.h>
#include <fcntl.h>

// C
#include <stdio.h>
#include <assert.h>

int main() {

    // 创建一个epoll
    int epfd = epoll_create(1);

    // 设置0号fd非阻塞
    const int STDIN_FD = 0;
    int flags = fcntl(STDIN_FD, F_GETFL);
    fcntl(STDIN_FD, F_SETFL, flags | O_NONBLOCK);

    // 将标准输入（fd = 0）加入关注列表
    struct epoll_event ev;
    ev.events = EPOLLIN;
    ev.data.fd = STDIN_FD;
    epoll_ctl(epfd, EPOLL_CTL_ADD, STDIN_FD, &ev);

    // 读取
    while (1) {
        // 等待标准输入就绪，即用户输入
        assert(epoll_wait(epfd, &ev, 1, -1) == 1);

        // 每次只读4个字节
        char buf[5] = {};
        int ret = read(STDIN_FD, buf, 4);
        printf("读取数据：%s\n", buf);
    }

    return 0;
}
~~~

上面的代码中，用 `epoll_wait` 等待标准输入（fd = 0）上的读事件。当其上有读事件就绪时，使用 `read()` 读取，但是每次只读4个字节。我们输入 `hello,world` 作为测试。

![LT模式下运行结果](/inset/LT模式下的运行结果.svg =800x)

可以发现，在输入 `hello world` 后，程序连续调用了多次 `read()` 进行fd的读取后，程序才被阻塞住。

这是因为，当我们第一次调用 `read()` 时，只从标准输入缓冲区里读取了4个字节而没有读取完，在下一次循环中调用 `epoll_wait` 时，由于 `epoll` 默认使用LT模式，`epoll_wait` 发现标准输入fd上仍然有数据未被读完，不阻塞立即返回。这样就造成了多次对输入缓冲区的fd进行读取的现象，直到读取完程序才被阻塞。

## 3. epoll的ET触发

要将 `epoll` 设为ET模式，只需要在 `events` 里加入 `EPOLLET` 标志位。

::: info 将fd设为ET触发

在上面代码的第22行加入 `EPOLLET` 标志位。

~~~c
ev.events = EPOLLIN | EPOLLET;
~~~

::: details 完整代码

~~~c
// Linux
#include <unistd.h>
#include <sys/epoll.h>
#include <fcntl.h>

// C
#include <stdio.h>
#include <assert.h>

int main() {

    // 创建一个epoll
    int epfd = epoll_create(1);

    // 设置0号fd非阻塞
    const int STDIN_FD = 0;
    int flags = fcntl(STDIN_FD, F_GETFL);
    fcntl(STDIN_FD, F_SETFL, flags | O_NONBLOCK);

    // 将标准输入（fd = 0）加入关注列表
    struct epoll_event ev;
    ev.events = EPOLLIN | EPOLLET; // 加入EPOLLET标志位
    ev.data.fd = STDIN_FD;
    epoll_ctl(epfd, EPOLL_CTL_ADD, STDIN_FD, &ev);

    // 读取
    while (1) {
        // 等待标准输入就绪，即用户输入
        assert(epoll_wait(epfd, &ev, 1, -1) == 1);

        // 每次只读4个字节
        char buf[5] = {};
        int ret = read(STDIN_FD, buf, 4);
        printf("读取数据：%s\n", buf);
    }

    return 0;
}
~~~

:::

运行代码可以发现，我们输入了 `hello world`，程序读取了我们输入的前4个字节后立刻阻塞住了。

继续按下回车，即进行下一次输入后，`hello world` 剩余的部分才被陆续被读取了。

![ET模式下的运行结果](/inset/ET模式下的运行结果.svg =800x)

这就是ET模式下工作的 `epoll`，当我们输入 `hello world` 后，发生了边缘触发，即fd上的读事件有更新。当用户进行一次读取之后，虽然仍然有数据没读完，但是fd上并没有收到新的数据，所以ET模式下的 `epoll` 并不关注这个没读完的fd，直接进入阻塞状态。

当我们继续按下回车键进行输入，会使标准输入fd就绪，让 `epoll` 发生边缘触发。再使用 `read()` 进行读取时，由于上一次读取还有剩余的数据没有读完，所以会读到上一次输入的剩余数据。

## 4. LT和ET的对比

通过上面的例子，可以看出LT模式下工作的 `epoll` 会在fd有可读事件时，持续触发可读事件，而在ET模式下，只会触发一次。这意味着在ET模式下收到了可读事件时，由于只触发一次，所以必须在触发时一次性将缓冲区内的数据全部读完。

::: info LT和ET的优缺点

- 在LT模式下，可以自由决定何时读取数据以及每次读取的多少，但是可能会导致多次触发而影响效率
- 在ET模式下，必须每次都要将缓冲区中的数据全部读完，其优点是触发次数少，性能相对更好。

:::
