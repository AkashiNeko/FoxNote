---
title: 成员函数
date: 2022-08-09
isOriginal: true
icon: section
category:
  - C++
excerpt: C++类的成员函数
order: 2
---

## 函数的调用

成员函数可以通过对象的指针或引用进行调用，调用成员函数的一般语法是使用成员访问操作符.来访问对象的成员函数。

~~~cpp
class A {
public:
    void fun() {
        cout << 1;
    }
    void init(int a) {
        a_ = a;
    }
private:
    int a_;
};

A obj;
obj.fun();   // 对象的引用调用成员函数fun
obj.init(3); // 对象的引用调用成员函数init

A* ptr = new A();
ptr->fun();  // 对象的指针调用成员函数fun
ptr->init(3) // 对象的指针调用成员函数init
~~~

除了显式调用，也可以用匿名对象的方式调用成员函数。

~~~cpp
class A {
public:
    void print() {
        cout << "qwq\n";
    }
};

// 匿名对象
A().print();
~~~

## 声明和定义

成员函数可以在类中声明，在类外定义。类外定义时需要加上

~~~cpp
class A {
    int a_;
    int b_;

public:
    // 声明
    void public_method();

private:
    // 声明
    void private_method();
};

// 定义
void A::public_method() {
    cout << a_;
}

// 定义
void A::private_method() {
    cout << b_;
}
~~~

## 内存空间

在C语言的结构体中，成员变量存储在对象的内存空间中。那么在C++类中，成员函数是否也会占用对象的内存空间？

~~~cpp
// 类 A 中包含一个成员函数和一个成员变量
class A {
public:
    void func() {}
    int num;
};

// 类 B 中只有一个相同的成员变量
class B {
public:
    int num;
};
~~~

分别用 `sizeof` 计算类和对象的大小。

~~~cpp
sizeof(A) // 4
sizeof(B) // 4

A obj1;
B obj2;
...
sizeof(obj1); // 4
sizeof(obj2); // 4
~~~

从 `sizeof` 的结果来看，类 `A` 和 `B` 及其对象占用的空间相同。这说明，成员函数并不占用对象的空间。

::: info 成员函数的存储

成员函数的定义和实现是共享的，当对象被创建时，每个对象会分配自己的内存空间来存储成员变量，但成员函数的代码并不会复制到每个对象中。这样可以节省内存，并且多个对象可以同时调用同一个成员函数。

:::

~~~cpp
class MemberlessClass {};
...
sizeof(MemberlessClass); // 1
~~~

此外，如果类中没有任何成员变量，编译器会分配一个字节给对象，用于标记。
