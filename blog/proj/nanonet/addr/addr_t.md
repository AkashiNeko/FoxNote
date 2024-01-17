---
title: addr_t
article: false
icon: "/icon/proj0.svg"
order: 1
---

系统提供的原生IPv4地址类型。

~~~cpp:no-line-numbers
#ifdef __linux__
    using addr_t = in_addr_t;
#elif _WIN32
    using addr_t = ULONG;
#endif
~~~
