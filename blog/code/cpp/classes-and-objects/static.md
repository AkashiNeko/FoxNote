---
title: 静态成员
date: 2022-08-11
isOriginal: true
icon: section
category:
  - C++
tag:
  - static
excerpt: 成员函数的this指针
order: 4
---

## 静态成员变量

在C语言中，用 `static` 修饰的全局变量，会被限制在当前文件。

C++允许使用 `static` 修饰类的成员和函数，被 `static` 修饰的成员变量和成员函数称为**静态成员变量**和**静态成员函数**。

静态成员变量在所有类的实例之间共享，它存储在全局区，不占用对象的内存空间。

~~~cpp
class A {
public:
    static int a_;
private:
    int i_;
    static int b_;
};

int A::a_ = 10;
int A::b_ = 20;
~~~

值得注意的是，静态成员变量不能直接在类内赋予初始值，而是需要在**类内声明，类外定义**。

## 静态成员函数

`static` 可以用于修饰成员函数。与普通成员函数不同的是，静态成员函数的参数表中**没有** `this` 指针。由于成员函数访问成员变量时，需要通过 `this` 指针才能找到对象的内存，因此静态成员函数无法访问对象的非静态成员变量。

::: info 静态成员函数

静态成员函数是属于类而不是类的实例的函数。它们与任何特定的对象实例无关，而是与整个类相关联。

:::

~~~cpp
class A {
public:
    static void print() {
        // 静态成员函数可以访问静态成员变量
        cout << a_ << endl;

        // 静态成员函数无法访问普通成员变量
        // cout << i_ << endl; // 不能通过编译
    }
private:
    static int a_;
    int i_;
};
int A::a_ = 1;

int main() {
    A::print();
    return 0;
}
~~~

静态成员函数可以直接通过类名调用，而不需要通过对象实例。
