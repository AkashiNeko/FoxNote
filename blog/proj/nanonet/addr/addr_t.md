---
title: addr_t
article: false
icon: "/icon/proj0.svg"
order: 1
---

系统提供的原生IPv4地址类型。在Linux下，它是 `in_addr_t`，在Windows下，它是`ULONG`。在物理内存中都占用4字节。

~~~cpp:no-line-numbers
#ifdef __linux__
    using addr_t = in_addr_t;
#elif _WIN32
    using addr_t = ULONG;
#endif
~~~
