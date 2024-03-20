---
title: 函数的参数
date: 2024-03-20
isOriginal: true
icon: "/icon/cpp2.svg"
category:
  - C++
excerpt: 相比C函数，C++函数提供了缺省参数和函数重载功能。
order: 3
---

## 1. 缺省参数

在C++中，定义一个函数时，可以为其中的一个或多个参数指定默认值。

~~~cpp
int add(int a, int b = 0) {
    return a + b;
}

int main() {
    add(20);   // 20 + 0 = 20
    add(1, 2); // 1 + 2 = 3
    return 0;
}
~~~

缺省的参数必须从右向左依次给出，中间不允许间隔。

~~~cpp
void func(int a, int b, int c = 0);         // OK
void func(int a = 0, int b = 0, int c = 0); // OK
void func(int a = 0, int b, int c = 0);     // 不合法！
~~~

## 2. 函数重载

C++允许同一个作用域内定义多个同名函数，但它们的**参数列表**必须不同，这样的多个函数构成函数重载。

~~~cpp
#include <cstdio>

void print(int a) {
    printf("int: %d\n", a);
}

void print(double n) {
    printf("double: %lf\n", n);
}

void print(const char* str) {
    printf("const char*: %s\n", str);
}

int main() {
    print(123);     // int: 123
    print(3.14);    // double: 3.140000
    print("hello"); // const char*: hello
}
~~~
