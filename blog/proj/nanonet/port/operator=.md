---
title: operator=
article: false
icon: "/icon/project.svg"
order: 4
---

拷贝与赋值。

~~~cpp:no-line-numbers
Port& operator=(port_t other);
Port& operator=(const char* other);
Port& operator=(const std::string& other);
~~~

拷贝赋值运算符由编译器默认生成。

~~~cpp:no-line-numbers
Port& operator=(const Port&) = default;
~~~

如果字符串不能转换为十进制整数，或数值超出合法范围，抛出 `NanoExcept` 异常。

示例

~~~cpp
nano::Port port1 = 80;
nano::Port port2;

port2 = port1;               // 拷贝
port2 = 443;                 // 从整数赋值
port2 = "8080";              // 从C字符串赋值
port2 = std::string("4430"); // 从C++字符串赋值

try {
    port2 = "qwq";
} catch (const nano::NanoExcept& e) {
    std::cout << e.what() << std::endl;
    // [port] port qwq is invalied
}
~~~
