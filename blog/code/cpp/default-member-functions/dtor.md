---
title: 析构函数
date: 2022-08-14
isOriginal: true
icon: section
category:
  - C++
tag:
  - 析构函数
excerpt: C++对象的销毁和资源回收
order: 3
---

## 什么是析构函数

::: info 析构函数

析构函数也是类中的六个默认成员函数之一，它的写法是在构造函数之前加一个波浪号，且不带任何参数。

:::

~~~cpp
class A {
    int a_;
public:
    A(int a) :a_(a) {};
    ~A() {}; // 析构函数
};
~~~

## 析构函数的调用

在对象声明周期结束时，程序会自动调用析构函数。

~~~cpp
class A {
public:
    A() {
        cout << "test  A" << endl;
    }
    ~A() {
        cout << "test ~A" << endl;
    }
};

int main() {
    A a1;
    return 0;
}
~~~

从运行结果来看，程序确实调用了析构函数`~A()`。在对象生命周期结束后，程序会自动调用析构函数。

## 对象资源的回收

如果类中的成员变量是内置类型，那么当对象的生命周期结束后，其在函数栈中空间会自动被回收。但如果成员使用了 `malloc` 或 `new` 等方法申请空间，对象销毁时没有释放空间，就会造成内存泄漏。因此，析构函数可以对其开辟的空间进行释放。

::: info 示例：一个简单的Stack类

Stack类使用 `malloc` 从堆中申请了空间。当对象的生命周期结束时，为了不造成内存泄漏，必须要回收这个空间。此时可以使用析构函数来自动释放这块空间。

~~~cpp
class Stack {
public:
    Stack(int capa = 4) :_capacity(capa) ,_top(0) {
        _data = (int*)malloc(_capacity * sizeof(int));
        assert(_data != nullptr);
    }
    ~Stack() {
        free(_data);
    }
private:
    int _top;
    int _capacity;
    int* _data;
};
~~~

:::

## 对象的析构顺序

::: info 对象的析构顺序

先创建的对象后析构，后创建的对象先析构。

~~~cpp
int main() {

    A a1; // a1.A() a1先构造
    A a2; // a2.A() a2后构造

    return 0;
    // a2.~A() a2先析构
    // a1.~A() a1后析构
}
~~~

:::
