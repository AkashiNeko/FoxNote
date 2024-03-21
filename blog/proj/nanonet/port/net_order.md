---
title: net_order
article: false
icon: "/icon/project.svg"
order: 7
---

将端口号转换为网络字节序（大端字节序）。

~~~cpp:no-line-numbers
port_t net_order() const;
~~~

示例（此处机器的主机字节序为小端字节序）

~~~cpp
nano::Port port = 0x1122;
nano::port_t netport = port.net_order();
if (netport == 0x2211) {
    std::cout << "netport is 0x2211" << std::endl;
}
~~~
