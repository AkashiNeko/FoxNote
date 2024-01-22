---
title: port_t
article: false
icon: "/icon/proj0.svg"
order: 1
---

系统提供的原生端口类型。在Linux下，它是 `in_port_t`，在Windows下，它是`USHORT`。在物理内存中都占用2字节。

~~~cpp:no-line-numbers
#ifdef __linux__
    using port_t = in_port_t;
#elif _WIN32
    using port_t = USHORT;
#endif
~~~
