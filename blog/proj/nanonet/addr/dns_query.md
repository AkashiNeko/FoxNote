---
title: dns_query
article: false
icon: "/icon/project.svg"
order: 12
---

DNS查询。参数为域名字符串，`use_tcp` 指定查询时使用的协议，默认为 `true` 使用TCP进行查询，设为 `false` 则使用UDP查询。查询失败时抛出 `NanoExcept` 异常。

~~~cpp:no-line-numbers
static Addr dns_query(const char* domain, bool use_tcp = true);
static Addr dns_query(const std::string& domain, bool use_tcp = true);
~~~

示例

~~~cpp
std::cout << nano::Addr::dns_query("www.baidu.com").to_string() << std::endl;
std::cout << nano::Addr::dns_query("www.google.com").to_string() << std::endl;
try {
    std::cout << nano::Addr::dns_query("hello, world").to_string() << std::endl;
} catch (const nano::NanoExcept& e) {
    std::cout << e.what() << std::endl;
}
~~~

    183.2.172.185
    142.251.46.228
    [addr] getaddrinfo: Name or service not known
