---
title: I/O多路转接之poll
date: 2023-12-04
isOriginal: true
icon: section
category:
  - Linux
tag:
  - IO
  - poll
excerpt: poll是对select的改进，提供了一种更直观和可扩展的方式来处理多个文件描述符。
order: 5
---

`poll` 的功能和 [`select`](/posts/linux/io-select/) 非常相似，同样是用集合将一批文件描述符交给内核进行等待，内核再把等待的结果交付给用户。

## 1. poll接口

### 接口说明

`poll` 是由Linux提供的系统调用接口，可使用 `man poll` 命令查看相关说明。

~~~c
#include <poll.h>

typedef unsigned long int nfds_t;

int poll(struct pollfd* fds, nfds_t nfds, int timeout);
~~~

### pollfd

`pollfd` 是一个结构体，表示了要关注的fd以及其上的事件。

~~~c
struct pollfd {
    int   fd;       /* file descriptor */
    short events;   /* requested events */
    short revents;  /* returned events */
};
~~~

其中 `events` 和 `revents` 可能的取值有：

::: details events 和 revents 的取值

`POLLIN`：有数据可读取。

`POLLPRI`：文件描述符上存在异常情况。可能的情况包括：

- TCP套接字上存在带外数据（参见tcp(7)）。
- 包模式的伪终端主设备看到从设备状态的变化（参见ioctl_tty(2)）。
- cgroup.events文件已被修改（参见cgroups(7)）。

`POLLOUT`：可写入数据，但如果写入的数据大小大于套接字或管道中可用空间，仍然会阻塞（除非设置了O_NONBLOCK）。

`POLLRDHUP`（自Linux 2.6.17起）：流套接字的对等方关闭了连接，或关闭了连接的写半部分。要获得此定义，必须在包含任何头文件之前定义_GNU_SOURCE特性测试宏。

`POLLERR`：错误条件（仅在revents中返回；在events中被忽略）。当引用管道的写端的文件描述符在读端关闭时，此位也会被设置。

`POLLHUP`：挂断（仅在revents中返回；在events中被忽略）。请注意，当从管道或流套接字等通道读取时，此事件仅表示对等方关闭了通道的一端。随后从通道读取的数据在消耗完通道中的所有未处理数据后，将返回0（文件末尾）。

`POLLNVAL`：无效请求：文件描述符未打开（仅在revents中返回；在events中被忽略）。

- 在定义了_XOPEN_SOURCE的情况下，还有以下宏，它们除了列出的位信息外，不提供其他信息：

`POLLRDNORM`：等效于POLLIN。
`POLLRDBAND`：可以读取优先级带数据（在Linux上通常不使用）。
`POLLWRNORM`：等效于POLLOUT。
`POLLWRBAND`：可以写入优先级数据。

Linux还了解 `POLLMSG` ，但不使用它。

::: details 原文

~~~text:no-line-numbers
POLLIN: There is data to read.

POLLPRI: There is some exceptional condition on the file descriptor. Possibilities include:
- There is out-of-band data on a TCP socket (see tcp(7)).
- A pseudoterminal master in packet mode has seen a state change on the slave (see ioctl_tty(2)).
- A cgroup.events file has been modified (see cgroups(7)).

POLLOUT: Writing is now possible, though a write larger than the available space in a socket or pipe will still block (unless O_NONBLOCK is set).

POLLRDHUP (since Linux 2.6.17): Stream socket peer closed connection, or shut down writing half of connection. The _GNU_SOURCE feature test macro must be defined (before including any header files) in order to obtain this definition.

POLLERR: Error condition (only returned in revents; ignored in events). This bit is also set for a file descriptor referring to the write end of a pipe when the read end has been closed.

POLLHUP: Hang up (only returned in revents; ignored in events). Note that when reading from a channel such as a pipe or a stream socket, this event merely indicates that the peer closed its end of the channel. Subsequent reads from the channel will return 0 (end of file) only after all outstanding data in the channel has been consumed.

POLLNVAL: Invalid request: fd not open (only returned in revents; ignored in events).

When compiling with _XOPEN_SOURCE defined, one also has the following, which convey no further information beyond the bits listed above:

POLLRDNORM: Equivalent to POLLIN.

POLLRDBAND: Priority band data can be read (generally unused on Linux).

POLLWRNORM: Equivalent to POLLOUT.

POLLWRBAND: Priority data may be written.

Linux also knows about, but does not use POLLMSG.
~~~

:::

## 2. 接口的使用

### 接口参数

`poll` 有三个参数：

::: info 参数列表

1. `fds`：一个数组，表示要关注的fd以及事件集合。
2. `nfds`：数组的长度，即遍历时的结束范围。
3. `timeout`：等待的超时时间，单位为毫秒。设为-1时阻塞等待，设为0时立即返回不阻塞。

:::

`fds` 是 `pollfd` 类型的数组，作为输入参数时， `pollfd` 中设置需要关注的fd，以及将 `events` 设为该fd上要关注的事件。

::: info 示例

比如需要关注4号fd上的 `POLLIN` 和 `POLLPRI` 事件，则该pollfd应该被设置为：

~~~json
fd: 4
events: POLLIN | POLLPRI
revents: 0
~~~

如果 `poll` 成功地捕捉到了该fd上的 `POLLIN` 事件，则 `revents` 会被修改：

~~~json
fd: 4
events: POLLIN | POLLPRI
revents: POLLIN
~~~

:::

### 返回值

`poll` 返回一个整数：

::: info 返回值

成功时，返回 `pollfds` 数组中的元素中的 `revents` 字段被设置为非零值的数量，即等待成功的fd的数量。

返回值为0表示在任何fd就绪之前，系统调用超时。

发生错误时，返回-1，`errno` 被设置为错误代码。

:::

## 3. poll服务器

### 业务需求

::: important 主要功能

实现一个简单的并发网络服务器，能够接收来自多个客户端的连接，且能够并发地响应客户端的消息。

:::

### 实现思路

与 [select服务器](/posts/linux/io-select/#实现思路) 基本一致。

### 完整代码

使用C++封装实现一个简单的 `poll` 网络服务器。

::: details 完整代码

~~~cpp
// Linux
#include <unistd.h>
#include <fcntl.h>
#include <poll.h>
#include <sys/socket.h>
#include <arpa/inet.h>

// C
#include <cstring>
#include <cassert>

// C++
#include <iostream>
#include <memory>

// 监听端口
const in_port_t ServerPort = 8080;
const size_t NFDS = 100;

class PollServer {

    // server fd
    int server_;

    // fd集合
    std::unique_ptr<pollfd[], void(*)(pollfd*)> fds;

public:

    // 初始化服务器
    PollServer(in_port_t port)
        // 开辟pollfd数组
        : fds(new pollfd[NFDS], [](pollfd* fds) {
        delete[] fds;
    }) {

        // 创建tcp套接字
        server_ = socket(AF_INET, SOCK_STREAM, 0);
        assert(server_ >= 0);

        // 绑定地址端口
        struct sockaddr_in addr;
        addr.sin_family = AF_INET;
        addr.sin_port = htons(port);
        addr.sin_addr.s_addr = htonl(INADDR_ANY);
        assert(bind(server_, (struct sockaddr *)&addr, sizeof(struct sockaddr_in)) >= 0);

        // 设置端口复用
        const int Optlen = 1;
        setsockopt(server_, SOL_SOCKET, SO_REUSEADDR, &Optlen, sizeof(Optlen));

        // 监听
        assert(listen(server_, 10) >= 0);
        std::cout << "Server listening on 0.0.0.0:" << port << std::endl;

        // 将套接字加入到fds中
        fds[0].fd = server_;
        fds[0].events = POLLIN;
        fds[0].revents = 0;
    }

    ~PollServer() {
        // 关闭服务器fd
        close(server_);
    }

    // poll服务器运行
    void run() {

        // 业务循环
        while (true) {

            // poll系统调用
            int ret = poll(fds.get(), NFDS, -1);
            if (ret == -1) exit(-1);
            if (ret == 0) continue;

            // 获取结果
            for (size_t i = 1; i < NFDS; ++i) {
                if (fds[i].revents & POLLIN) {

                    // 收到了链接fd的io事件
                    int fd = fds[i].fd;
                    std::cout << "poll from fd: " << fd << std::endl;

                    // TODO: 处理具体业务...
                    // 这里简单的接收一下客户端发来的消息，并原封不动发回，然后关闭fd
                    char buf[4096];

                    // 接收
                    assert(read(fd, (void*)buf, sizeof(buf) -1) >= 0);
                    std::cout << "read fd " << fd << ": " << buf << std::endl;

                    // 发送
                    std::cout << "write fd " << fd << ", length = "
                        << write(fd, buf, strlen(buf)) << std::endl;

                    // 关闭连接
                    close(fd);

                    // 清空当前的pollfd
                    fds[i].fd = 0;
                    fds[i].events = 0;
                    fds[i].revents = 0;
                }
            }

            // 判断是否有新的连接请求
            if (fds[0].revents & POLLIN) {

                // 建立连接
                sockaddr_in addr;
                socklen_t addrlen = sizeof(addr);
                int ret = accept(server_, (struct sockaddr*)&addr, &addrlen);
                assert(ret >= 0);
                char strAddr[INET_ADDRSTRLEN];
                std::cout << "accept from "
                    << inet_ntop(AF_INET, &(addr.sin_addr.s_addr), strAddr, sizeof(strAddr))
                    << ":" << ntohs(addr.sin_port) << std::endl;
                
                // 将新的连接fd加入到fds中，进入下一轮poll循环
                for (size_t i = 1; i < NFDS; ++i) {
                    if (fds[i].events == 0) {
                        fds[i].fd = ret;
                        fds[i].events = POLLIN;
                        fds[i].revents = 0;
                        break;
                    }
                }
            }
        }
    }
};

int main() {
    PollServer ps(ServerPort);
    ps.run();
    return 0;
}
~~~

:::

## 4. 优缺点

::: tip 优点

- 使用 `pollfd` 结构体封装了fd、关注的 `events` 和发生的 `revents` ，使用起来比 `select` 方便。
- 相比于 `select` ，`poll` 的fd集合是由用户自定义长度的数组，没有fd数量的限制。

:::

::: warning 缺点

- 和 `select` 一样，fd集合是一个数组，每次都需要线性遍历数组获取各fd的状态。
- 对于大量的fd，可能只有很少的fd处于就绪状态。随着fd数量的增加，其性能也会线性下降。

:::
