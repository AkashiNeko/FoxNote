---
title: set
article: false
icon: "/icon/project.svg"
order: 9
---

设置原生端口号（参数为主机字节序，可能是大端字节序也可能是小端字节序，取决于机器）。

~~~cpp:no-line-numbers
void set(port_t val);
~~~

示例（主机字节序为小端）

~~~cpp
nano::Port port;
port.set(8080);
std::cout << port.to_string() << std::endl; // 8080
~~~
