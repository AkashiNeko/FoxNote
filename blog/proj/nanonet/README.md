---
title: NanoNet
article: false
icon: "/icon/proj0.svg"
dir:
  link: true
---

## Nanonet网络库

NanoNet是用C++11编写的一个跨平台网络库，对操作系统提供的原生网络编程接口进行了简单封装。支持TCP/UDP协议的IPv4网络通信。

::: info 仓库地址

[github.com/AkashiNeko/NanoNet](https://github.com/AkashiNeko/NanoNet)

:::

::: details 示例

下面简单展示使用NanoNet库，让客户端向服务端发送 `Hello, world!`。

*如果使用g++编译，请附加参数 `-lnanonet`。如果在Windows下编译，还需带上 `-lws2_32`。*

<h4>TCP服务端</h4>

~~~cpp
#include <iostream>
#include "nanonet.h"

int main() {
    nano::ServerSocket serv("0.0.0.0", 8888);
    serv.listen();
    auto sock = serv.accept();
    serv.close();
    char buf[1024];
    sock.receive(buf, sizeof(buf) - 1);
    std::cout << buf << std::endl;
    sock.close();
    return 0;
}
~~~

<h4>TCP客户端</h4>

~~~cpp
#include "nanonet.h"

int main() {
    nano::Socket sock;
    sock.connect("127.0.0.1", 8888);
    char msg[] = "Hello, world!";
    sock.send(msg, sizeof(msg) - 1);
    sock.close();
    return 0;
}
~~~

:::

~~~class NanoNet
AddrPort o-- Addr
AddrPort o-- Port
SocketBase ..> AddrPort
Socket --|> SocketBase
ServerSocket --|> SocketBase
UdpSocket --|> SocketBase
class Addr{
    -addr_t val_
    +net_order()
    +get()
    +set(addr_t)
    +to_string()
    +is_valid(Addr)$
    +dns_query(const char*)$
    +dns_query(string)$
}
class Port {
    -port_t val_
    +net_order()
    +get()
    +set(port_t)
    +to_string()
}
class AddrPort {
    -Addr addr_
    -Port port_
    +get_addr()
    +get_port()
    +set_addr(addr_t)
    +set_port(port_t)
    +to_string()
    +to_string(Addr, Port)$
    +to_addrport(sockaddr_in)$
}
class SocketBase {
    #socket_t socket_
    #sockaddr_in local_
    #create_socket_(int)
    +close()
    +is_open()
    +get_sock()
    +bind(Addr, Port)
    +get_local()
    +set_option(int, int, T)$
    +get_option(int, int, T)$
}
class Socket {
    -sockaddr_in remote_
    +connect(Addr, Port)
    +send(const char*, size_t)
    +send(string)
    +receive(char*, size_t)
    +recv_timeout(long)
    +get_remote()
}
class ServerSocket {
    +listen()
    +accept()
    +reuse_addr(bool)
}
class UdpSocket {
    -sockaddr_in remote_
    -is_connected_;
    +send_to(const char*, size_t, AddrPort)
    +send_to(string, AddrPort)
    +receive_from(char*, size_t, AddrPort)
    +receive_from(string, AddrPort)
    +connect(Addr, Port)
    +send(const char*, size_t)
    +send(string)
    +receive(char*, size_t)
    +recv_timeout(long)
    +get_remote()
}
~~~

## 命名空间

本项目的所有代码位于命名空间 `nano` 中。

## 类型定义

- `sock_t`：系统原生套接字对象。
- `addr_t`：IPv4地址，大小为4字节。
- `port_t`：端口号，大小为2字节。

## 库的类和接口

- [`Addr`](./addr/)
- `Port`
- `AddrPort`
- `SocketBase`
- `Socket`
- `ServerSocket`
- `UdpSocket`
