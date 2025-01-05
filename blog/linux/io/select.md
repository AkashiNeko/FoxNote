---
title: I/O多路转接之select
date: 2023-12-03
isOriginal: true
icon: section
category:
  - Linux
tag:
  - IO
  - select
excerpt: select是最早的一种I/O多路复用机制，用于监视多个文件描述符的状态变化。
order: 4
---

## 1. select接口

### 接口说明

`select` 是由Linux提供的系统调用接口，可使用 `man select` 命令查看相关说明。

~~~c
#include <sys/select.h>

// 类型 - 要关注的fd集合
typedef ... fd_set;

// 接口 - 系统调用
int select(int nfds, fd_set* readfds, fd_set* writefds, fd_set* exceptfds, truct timeval* timeout);
~~~

### fd_set集合

`fd_set` 是一个位图结构，定义如下

~~~c
typedef long int __fd_mask;
#define __FD_SETSIZE  1024
#define __NFDBITS  (8 * (int)sizeof(__fd_mask))

typedef struct {
  __fd_mask fds_bits[__FD_SETSIZE / __NFDBITS];
} fd_set;
~~~

::: info fd_set的大小

**__FD_SETSIZE**的值一般为1024，也就是说，fd_set最多可以容纳1024个比特位，每个比特位表示一个要关注的fd。

:::

下面是一些用于操作 `fd_set` 的宏。

~~~c
// 将set中fd对应的比特位置为0
void FD_CLR(int fd, fd_set *set);

// 获取set中fd对应的比特位
int  FD_ISSET(int fd, fd_set *set);

// 将set中fd对应的比特位置为1
void FD_SET(int fd, fd_set *set);

// 清空set集合
void FD_ZERO(fd_set *set);
~~~

### timeval时间

`timeval` 是一个表示时长的结构体，有两个成员，一个是秒（tv_sec），另一个是微秒（tv_usec），其表示的时长为二者之和。

~~~c
struct timeval {
  time_t      tv_sec;  /* seconds */
  suseconds_t tv_usec; /* microseconds */
};
~~~

## 2. 接口的使用

### 接口参数

`select` 一共有5个参数，其中除了第1个参数 `nfds` ，其他都是输入输出型参数。

::: info 参数列表

1. `nfds`：表示最大的文件描述符，用于指定fd集合的遍历范围。
2. `readfds`：要关注 **读** 操作的文件描述符集合。
3. `writefds`：要关注 **写** 操作的文件描述符集合。
4. `exceptfds`：要关注 **异常** 的文件描述符集合。
5. `timeout`：设置等待超时的时间，设为空指针表示阻塞等待，设为0表示立即返回不等待。

:::

### 返回值

::: info 返回值和输出参数

`select` 返回一个整数，表示关注的fd集合中，就绪fd的数量。同时，参数 `readfds` 、 `writefds` 、 `exceptfds` 会被修改为就绪的fd集合。

如果在调用时设置了 `timeout` 作为输入参数，则 `timeout` 会被设置为距离超时时间的剩余时间。比如将超时时间设为5秒，`select` 在等待3秒后返回，则 `timeout` 被设置为2秒。

:::

## 3. select服务器

### 业务需求

::: important 主要功能

实现一个简单的并发网络服务器，能够接收来自多个客户端的连接，且能够并发地响应客户端的消息。

:::

### 实现思路

使用 `select` 同时等待服务器fd和所有的链接fd，如果其中有某个fd就绪了，就处理对应的事件。

下面是 `select` 等待多个fd的例子。

::: info select服务器

![select等待连接](/inset/select等待连接.svg)

此时如果有客户端发起连接：

![客户端连接服务器fd](/inset/客户端连接服务器fd.svg)

select发现服务器fd有读事件发生，停止等待并返回。对服务器fd调用accept，接受客户端的连接，并将链接fd放入fd集合中，交给select继续等待。

![获取到新连接加入fd集合](/inset/获取到新连接加入fd集合.svg)

select可以同时关注多个fd上的I/O事件，比如同时接收客户端的连接请求和接收客户端的消息。

![select并发响应](/inset/select并发响应.svg)

这样就可以实现在单执行流中并发的响应。

:::

### 代码

使用C++封装实现一个简单的 `select` 网络服务器。

::: details 完整代码

~~~cpp
// Linux
#include <unistd.h>
#include <fcntl.h>
#include <sys/select.h>
#include <sys/socket.h>
#include <arpa/inet.h>

// C
#include <cstring>
#include <cassert>

// C++
#include <iostream>
#include <set>

// 监听端口
const in_port_t ServerPort = 8080;

class SelectServer {

    // server fd
    int server_;

    // fd集合
    std::set<int> set;

public:

    // 初始化服务器
    SelectServer(in_port_t port) {

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

        // 将套接字加入到set中
        set.insert(server_);
    }

    ~SelectServer() {
        // 关闭服务器fd
        close(server_);
    }

    // select服务器运行
    void run() {

        // fd集合
        fd_set rfds;

        // 业务循环
        while (true) {

            // 因为fd_set是一个输入输出参数，所以每次都需要清空重新设置
            FD_ZERO(&rfds);

            // 设置服务器fd
            FD_SET(server_, &rfds);

            // 设置链接fd
            for (int e : set)
                FD_SET(e, &rfds);

            // select系统调用
            int ret = select(*set.rbegin() + 1, &rfds, nullptr, nullptr, nullptr);
            if (ret == -1) exit(-1);
            if (ret == 0) continue;

            // 获取结果
            for (int fd : set) {
                if (fd != server_ && FD_ISSET(fd, &rfds)) {

                    // 收到了链接fd的io事件
                    std::cout << "select from fd: " << fd << std::endl;

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
                }
            }

            // 清除集合中的链接fd
            set = { server_ };

            // 判断是否有新的连接请求
            if (FD_ISSET(server_, &rfds)) {

                // 建立连接
                sockaddr_in addr;
                socklen_t addrlen = sizeof(addr);
                int ret = accept(server_, (struct sockaddr*)&addr, &addrlen);
                assert(ret >= 0);
                char strAddr[INET_ADDRSTRLEN];
                std::cout << "accept from "
                    << inet_ntop(AF_INET, &(addr.sin_addr.s_addr), strAddr, sizeof(strAddr))
                    << ":" << ntohs(addr.sin_port) << std::endl;
                
                // 将新的连接fd加入到set中，进入下一轮select循环
                set.insert(ret);
            }
        }
    }
};

int main() {
    SelectServer ss(ServerPort);
    ss.run();
    return 0;
}
~~~

:::

## 4. 优缺点

::: tip 优点

- 用单个执行流实现了并发通信，节省了多执行流调度的开销。
- 可以同时等待多个文件描述符，相比单个文件描述符的等待，效率更高。

:::

::: warning 缺点

- 实现比较复杂，不便于维护。
- fd集合是一个定长数组，也就算说文件描述符数量有上限。
- fd集合需要在用户和内核之间来回拷贝，而且每次都需要遍历所有fd，开销较大。随着fd数量的增加，其性能也会线性下降。

:::
