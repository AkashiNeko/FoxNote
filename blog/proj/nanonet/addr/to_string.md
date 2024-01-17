---
title: to_string
article: false
icon: "/icon/proj0.svg"
order: 10
---

将地址转换为点分十进制的字符串。

~~~cpp:no-line-numbers
std::string to_string() const;
~~~

示例

~~~cpp
nano::Addr addr = "www.example.com";
std::cout << addr.to_string() << std::endl; // 93.184.216.34
~~~
