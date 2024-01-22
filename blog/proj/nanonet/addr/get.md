---
title: get
article: false
icon: "/icon/proj0.svg"
order: 8
---

获取原生IPv4地址（返回值为主机字节序，可能是大端字节序也可能是小端字节序，取决于机器）。

~~~cpp:no-line-numbers
addr_t get() const;
~~~

示例（主机字节序为小端字节序）

~~~cpp
nano::Addr addr = "1.2.3.4";
if (addr.get() == 0x01020304) {
    std::cout << "addr is 0x01020304" << std::endl;
}
~~~
