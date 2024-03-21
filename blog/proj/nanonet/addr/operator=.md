---
title: operator=
article: false
icon: "/icon/project.svg"
order: 4
---

拷贝与赋值。

~~~cpp:no-line-numbers
Addr& operator=(addr_t other);
Addr& operator=(const char* other);
Addr& operator=(const std::string& other);
~~~

其中拷贝赋值运算符由编译器默认生成。

~~~cpp:no-line-numbers
Addr& operator=(const Addr&) = default;
~~~

如果字符串是不合法的IPv4地址，且DNS查询失败，抛出 `NanoExcept` 异常。

示例

~~~cpp
nano::Addr addr = "10.0.0.1";
addr = (nano::addr_t)0; // 0.0.0.0
addr = "localhost"; // C字符串

std::string str_addr = "192.168.1.1";
addr = str_addr; // C++字符串

try {
    addr = "qwq";
} catch (const nano::NanoExcept& e) {
    std::cout << e.what() << std::endl;
    // [addr] getaddrinfo: Temporary failure in name resolution
}
~~~
