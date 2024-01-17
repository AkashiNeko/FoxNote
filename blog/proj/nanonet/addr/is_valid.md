---
title: is_valid
article: false
icon: "/icon/proj0.svg"
order: 11
---

判断点分十进制的IPv4地址字符串是否合法。

~~~cpp:no-line-numbers
static bool is_valid(const std::string& addr);
~~~

示例

~~~cpp
std::cout << nano::Addr::is_valid("11.22.33.44") << std::endl;   // 1
std::cout << nano::Addr::is_valid("11.22.") << std::endl;        // 0
std::cout << nano::Addr::is_valid("1.2.3.256") << std::endl;     // 0
std::cout << nano::Addr::is_valid("1...2") << std::endl;         // 0
~~~
