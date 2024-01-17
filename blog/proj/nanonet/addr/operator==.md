---
title: operator==
article: false
icon: "/icon/proj0.svg"
order: 5
---

判断两个IPv4地址是否相等。

~~~cpp:no-line-numbers
bool operator==(addr_t other) const;
bool operator==(const char* other) const;
bool operator==(const std::string& other) const;
~~~

示例

~~~cpp
nano::Addr addr(0);
addr == (nano::addr_t)0; // true
addr == std::string("0.0.0.0"); // true
addr == "127.0.0.1"; // false
~~~
