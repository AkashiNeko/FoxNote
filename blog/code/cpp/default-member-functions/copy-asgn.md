---
title: 拷贝赋值运算符
date: 2022-08-15
isOriginal: true
icon: section
category:
  - C++
tag:
  - 运算符重载
excerpt: C++对象的拷贝赋值
order: 5
---

### 与拷贝构造的区别

拷贝赋值运算符和拷贝构造非常相似，都是对对象的拷贝。不同的是在赋值时，对象中可能已经存在被管理的数据，所以在拷贝工作之前，需要清除这些数据。下面是二者的对比：

::: info 拷贝构造

~~~cpp
std::string s1 = "Hello, world";
std::string s2 = s1; // 调用拷贝构造，使用s1的内容初始化s2
~~~

:::

::: info 拷贝赋值运算符

~~~cpp
std::string s1 = "Hello, world";
std::string s2 = "Hello, AkashiNeko";
s1 = s2; // 调用赋值运算符，将s2赋值给s1，同时需要清除s1原有的内容
~~~

:::

### 赋值运算符函数

拷贝赋值运算符的函数声明如下

~~~cpp
class A {
public:
    A& operator=(const A& a);
};
~~~

需要注意的是，它返回一个自身的引用，以应对连续赋值的情况

~~~cpp
A a1, a2, a3;
...
a1 = a2 = a3; // 连续赋值
~~~

### 拷贝赋值的实现

相比拷贝构造，拷贝赋值运算符相当于在拷贝构造的工作之前，释放掉当前管理的资源。

::: info Stack类的拷贝赋值运算符

拷贝赋值运算符主要完成以下两个工作

- 清除当前管理的资源
- 拷贝资源

~~~cpp
Stack& operator=(const Stack& s) {
    // 清除当前管理的资源
    free(_data);
    _data = nullptr;

    // 申请新的空间
    _data = (int*)malloc(_capacity * sizeof(int));
    assert(_data != nullptr);

    // 对空间进行拷贝
    memcpy(_data, s._data, _capacity * sizeof(int));
    _capacity = s._capacity;
    _top = s._top;
}
~~~

:::
