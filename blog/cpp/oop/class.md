---
title: 类和对象入门
date: 2022-08-09
isOriginal: true
icon: "/icon/cpp_oop_post.svg"
category:
  - C++
tag:
  - 编程语法
  - 面向对象
  - class
excerpt: C++面向对象编程基础，类和对象入门。
order: 1
---

## 1. 什么是类

### 从结构体到类

在C语言中，结构体用于将不同的类型打包在一起。在C++中，类可以看作一个增强版的结构体，不仅有C语言结构体的所有功能，还可以定义函数，以及许多便利的功能，类中的成员函数也称为成员方法（method）。

~~~cpp
class MyClass {

    // 成员函数
    void function();

    // 成员变量
    int i;

}; // 这是一个C++类的声明
~~~

使用结构体或类定义变量，不需要像C语言一样使用 `struct` 关键字修饰，可以直接使用类型名。

~~~cpp
// C语言的写法
struct MyStruct st;

// C++的写法
MyStruct var;
MyClass obj;
~~~

在C++中，使用类类型创建的变量，称为**对象**，创建对象的过程称为**实例化**。

### 访问限定符

C++类使用了**访问限定符**，限制从类外部对成员访问的权限，从而达到封装的目的。访问限定符有以下3种：

> | 关键字 | 说明 | 访问权限 |
> | :--: | :--: | :--: |
> | `public` | 公有的✔️ | 从类外可以直接访问 |
> | `private` | 私有的🔒 | 只能被类中的成员访问，类外不可见 |
> | `protected` | 保护的🔑 | 能被类中和子类的成员访问，类外不可见 |

只有被 `public` 修饰的成员，才可以从类外直接访问，其他修饰的成员则对类外不可见。

~~~cpp
class MyClass {
public:
    void f() {
        cout << "qwq\n";
    }
private:
    int a;
    char str[10];
protected:
    int i;
};

// 访问测试
MyClass mc;
mc.func1(); // 可以访问，f 是 "公有的"
mc.a = 10;  // 无法访问，a 是 "私有的"
mc.i++;     // 无法访问，i 是 "保护的"
~~~

在C++中，结构体的默认访问权限为 `public`，类则为 `private`，类的成员默认无法从外部访问。

### 类的作用域

C++类定义了一个**作用域**，域名为类的名称，与命名空间 `namespace` 类似。

~~~cpp
class A {
public:
    static int i;
    using MyInt = int;
};

// 类外访问
A::i = 10;
A::MyInt num = 20;
~~~

## 2. 类的成员函数

### 函数的调用

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

### 声明和定义

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

### 内存空间

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
