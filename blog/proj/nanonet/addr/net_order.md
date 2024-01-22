---
title: net_order
article: false
icon: "/icon/proj0.svg"
order: 7
---

将地址转换为网络字节序（大端字节序）。

~~~cpp:no-line-numbers
addr_t net_order() const;
~~~

示例

~~~cpp
nano::Addr addr = "1.2.3.4";
nano::Addr netaddr = addr.net_order();
std::cout << netaddr.to_string() << std::endl;
~~~
