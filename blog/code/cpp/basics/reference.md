---
title: 引用
date: 2022-07-04
isOriginal: true
icon: section
category:
  - C++
excerpt: C++在指针的基础上提供了引用，能够更方便地操作对象。
order: 5
---

## 1. 指针和引用

在C语言中，可以用指针变量保存变量的地址。在C++中，可以使用**引用**（Reference）直接引用某个变量。

引用给变量起了别名，它和它引用的变量共用同一块内存空间。在使用引用变量时，实际上是在引用原始的变量。

~~~cpp:no-line-numbers
int a = 10;
int* pa = &a; // 指针
int& ra = a;  // 引用
~~~

通过指针 `pa` 修改 `a`。

~~~cpp:no-line-numbers
*pa = 20;
~~~

通过引用 `ra` 修改 `a`。

~~~cpp:no-line-numbers
ra = 30;
~~~

引用可以用于更高效地函数传参。

~~~cpp:no-line-numbers
// C swap
void swap(int* pa, int* pb) {
    int temp = *pa;
    *pa = *pb;
    *pb = temp;
}

// C++ swap
void swap(int& a, int& b) {
    int temp = a;
    a = b;
    b = temp;
}

int main() {
    // call C swap
    int a = 10, b = 20;
    swap(&a, &b);

    // call C++ swap
    int c = 30, d = 40;
    swap(c, d);
    return 0;
}
~~~

另外，和指针不同的是，引用在定义时必须初始化。且引用的变量不能被修改。

## 2. 常量引用

被 `const` 修饰的引用称为常量引用。

~~~cpp
#include <iostream>

int main() {
    int a = 10;
    const int& const_ra = a;
    std::cout << const_ra << std::endl; // 10
    a = 20; // 修改a的值
    std::cout << const_ra << std::endl; // 20
    return 0;
}
~~~

常量引用可以对常变量进行引用，同时也可以对字面常量进行引用。

~~~cpp:no-line-numbers
const int ca = 100;
const int& ra1 = ca;  // 引用常变量

const int& ra2 = 200; // 引用字面常量
~~~

在函数传参时，可以使用常量引用接收各种类型的参数。

~~~cpp
#include <iostream>

void func(const int& a) {
    std::cout << a << std::endl;
}

int main() {
    func(10); // 传入字面常量

    int n = 20;
    func(n);  // 传入变量

    const int c = 30;
    func(c);  // 传入常变量
    return 0;
}
~~~

对于体积较小的变量，常量引用的方式传参和直接传参似乎没什么区别。但是如果是一个很大的对象（如结构体的对象），直接传参发生拷贝的开销很大，用常量引用可以优化对象拷贝的开销。关于这一点，将在之后类和对象章节提到。
