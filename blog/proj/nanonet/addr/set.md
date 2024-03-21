---
title: set
article: false
icon: "/icon/project.svg"
order: 9
---

设为原生IPv4地址。（参数为主机字节序，可能是大端也可能是小端，取决于机器）

~~~cpp:no-line-numbers
void set(addr_t val);
~~~

示例（主机字节序为小端）

~~~cpp
nano::Addr addr;
addr.set(0x01020304);
std::cout << addr.to_string() << std::endl; // 1.2.3.4
~~~
