---
title: NanoNet
article: false
icon: "/icon/proj0.svg"
dir:
  link: true
---

NanoNet是用C++11编写的一个跨平台网络库，对操作系统提供的原生网络编程接口进行了简单封装。支持TCP/UDP协议的IPv4网络通信。

::: info 仓库地址

[github.com/AkashiNeko/NanoNet](https://github.com/AkashiNeko/NanoNet)

:::

::: details 示例

下面简单展示使用NanoNet库，让客户端向服务端发送 `Hello, world!`。

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
