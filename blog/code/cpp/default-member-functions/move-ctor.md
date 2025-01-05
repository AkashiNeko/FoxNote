---
title: 移动构造函数
date: 2022-08-16
isOriginal: true
icon: section
category:
  - C++
tag:
  - 右值
  - 构造函数
excerpt: C++对象的资源转移构造
order: 6
---

## 右值引用

在C++11中，可以使用 `std::move()` 将对象转换为右值引用（将亡值），完成资源转移。

~~~cpp
std::string s1("Hello world");
std::string s2(std::move(s1));
// move之后: s1 = "", s2 = "Hello world";
~~~

## 移动构造的功能

顾名思义，移动构造也是构造函数的一种。移动构造可以更高效地转移资源（浅拷贝），比如 `std::string` 的移动构造。

::: info std::string 移动构造的例子

下面是 `std::string` 构造函数的例子。这里的 `to_string` 会将整数 `123` 转换为字符串对象 `"123"`，这个字符串对象是一个临时值（右值），被传入 `str` 对象的构造函数中。

~~~cpp
std::string str(to_string(123));
~~~

对于 `str` 对象的构造，如果不使用移动构造（C++11前），不考虑编译器优化，`to_string` 返回的临时对象需要通过深拷贝到 `str` 中，并且这个临时对象需要被析构。如果使用了移动构造，临时对象可以直接将自己管理的数据交给 `str` 管理，完成资源的转移，从而减少拷贝的次数。

:::

下面是一个移动构造函数的声明。

~~~cpp
class A {
public:
    A(A&& a);
};
~~~

## 移动构造的实现

以之前的Stack类举例，下面是Stack类的移动构造函数。它的主要工作是将 `_data` 指向的空间的管理权从右值交给新对象，并将临时对象的内容清空。

~~~cpp
Stack(Stack&& s) :_top(s._top), _capacity(s._capacity), _data(s._data) {
    s._top = s._capacity = 0;
    s._data = nullptr;
}
~~~
