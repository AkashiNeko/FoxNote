---
title: 移动赋值运算符
date: 2022-08-16
isOriginal: true
icon: section
category:
  - C++
tag:
  - 右值
  - 运算符重载
excerpt: C++对象的资源转移构造
order: 6
---

## 移动赋值的功能

与拷贝赋值运算符、移动构造函数类似，移动赋值运算符是通过右值引用的方式将对象的资源移动给新对象。

~~~cpp
class A {
public:
    A& operator=(A&& a);
};
~~~

为了支持连续赋值操作，它和拷贝赋值运算符同样，在数据移动之前，先清空当前的数据，移动完成后返回自身的引用。

::: info std::string 的移动赋值运算符

~~~cpp
std::string s1 = "Hello, world";
std::string s2;
s2 = std::move(s1);
// move之后，s1 = ""，s2 = "Hello, world";
~~~

:::

## 移动赋值的实现

::: info Stack类的移动赋值运算符

移动赋值运算符主要完成以下三个工作

- 清除当前管理的资源
- 移动资源
- 清空临时对象

~~~cpp
Stack& operator=(Stack&& s) {
    // 清空当前管理的资源
    free(_data);
    _data = nullptr;

    // 移动资源
    _capacity = s._capacity;
    _top = s._top;
    _data = s._data;

    // 清空临时对象
    s._top = s._capacity = 0;
    s._data = nullptr;
}
~~~

:::
