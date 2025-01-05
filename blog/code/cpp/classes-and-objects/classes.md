---
title: 类
date: 2022-08-09
isOriginal: true
icon: section
category:
  - C++
tag:
  - class
excerpt: C++类
order: 1
---

在 C 语言中，结构体用于将不同的类型打包在一起。在 C++ 中，类可以看作一个增强版的结构体，不仅有 C 结构体的所有功能，还可以定义函数。类中的成员函数（member function）在许多语言中也被称为方法（method）。

~~~cpp
struct MyStruct {
    void func(); // 成员函数
    int i;       // 成员变量
};

class MyClass {
    void func(); // 成员函数
    int i;       // 成员变量
};
~~~

使用结构体或类定义变量时，也不需要像C语言一样使用 `struct` 关键字修饰，可以直接使用类型名。

~~~cpp
// C 语言的写法
struct MyStruct st;

// C++ 的写法
MyStruct var;
MyClass obj;
~~~

在C++中，使用类类型创建的变量称为**对象**，创建对象的过程称为**实例化**。

C++的结构体和类中都存在一个**作用域**，作用域的名字与类名相同，就像是一个命名空间。

~~~cpp
class A {
public:
    static int i;      // A::i
    using MyInt = int; // A::MyInt
};
~~~
