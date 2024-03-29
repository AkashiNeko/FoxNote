---
title: Addr
article: false
icon: "/icon/project.svg"
order: 2
---

初始化一个IPv4地址对象，默认值为 `0.0.0.0` 。字符串可以是一个域名。

~~~cpp:no-line-numbers
Addr(addr_t val = 0);           // 从系统原生类型构造（主机字节序）
Addr(const char* addr);         // 从C字符串构造
Addr(const std::string& addr);  // 从C++字符串构造
~~~

从整数构造时，使用主机字节序（host byte order）。如果字符串是不合法的IPv4地址，且DNS查询失败，抛出 `NanoExcept` 异常。

示例

~~~cpp
nano::Addr addr1; // 使用默认值 0.0.0.0
nano::Addr addr2 = 0xFFFFFFFF; // 255.255.255.255

nano::Addr addr3 = "127.0.0.1"; // C字符串
nano::Addr addr4 = "example.com"; // 如果是域名自动查询DNS

std::string host = "localhost";
nano::Addr addr5 = host; // C++字符串

try {
    nano::Addr addr = "qwq";
} catch (const nano::NanoExcept& e) {
    std::cout << e.what() << std::endl;
    // [addr] getaddrinfo: Temporary failure in name resolution
}
~~~
