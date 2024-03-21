---
title: Port
article: false
icon: "/icon/project.svg"
order: 2
---

初始化一个端口号对象。

~~~cpp:no-line-numbers
Port(port_t val = 0);           // 从系统原生类型构造
Port(const char* port);         // 从C字符串构造
Port(const std::string& port);  // 从C++字符串构造
~~~

从整数构造时，使用主机字节序（host byte order）。如果字符串不能转换为十进制整数，或字符串表示的整数范围不合法，则抛出 `NanoExcept` 异常。

示例

~~~cpp
nano::Port port1; // 默认值 0
nano::Port port2 = 8080;

nano::Port port3 = "443"; // C字符串

std::string host = "3389";
nano::Port port5 = host; // C++字符串

try {
    nano::Port port = "qwq";
} catch (const nano::NanoExcept& e) {
    std::cout << e.what() << std::endl;
    // [port] port qwq is invalied
}
~~~
