---
title: operator==
article: false
icon: "/icon/project.svg"
order: 5
---

判断两个端口号是否相等。

~~~cpp:no-line-numbers
bool operator==(port_t other) const;
bool operator==(const char* other) const;
bool operator==(const std::string& other) const;
~~~

示例

~~~cpp
nano::Port port = 443;
port == 443; // true
port == std::string("443"); // true
port == "8080"; // false
~~~
