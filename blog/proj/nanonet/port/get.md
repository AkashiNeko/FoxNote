---
title: get
article: false
icon: "/icon/project.svg"
order: 8
---

获取原生端口号（返回值为主机字节序，可能是大端字节序也可能是小端字节序，取决于机器）。

~~~cpp:no-line-numbers
port_t get() const;
~~~

示例（此处机器的主机字节序为小端字节序）

~~~cpp
nano::Port port = 0x1234;
if (port.get() == 0x1234) {
    std::cout << "port is 0x1234" << std::endl;
}
~~~
