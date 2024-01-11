---
title: C++类
date: 2022-08-09
isOriginal: true
icon: "/icon/cpp2.svg"
category:
  - C++
tag:
  - class
excerpt: C++类的访问限定符和作用域
order: 1
---

## 从结构体到类

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

## 访问限定符

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

## 类的作用域

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
