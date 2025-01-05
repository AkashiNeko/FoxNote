---
title: 缺省参数
date: 2022-07-03
isOriginal: true
icon: section
category:
  - C++
excerpt: 函数参数的默认值
order: 3
---

在C++中，定义一个函数时，可以为其中的一个或多个参数指定默认值。

~~~cpp
int add(int a, int b = 0) {
    return a + b;
}

int main() {
    std::cout << add(5)    << std::endl; // 5 + 0 = 5
    std::cout << add(1, 2) << std::endl; // 1 + 2 = 3
    return 0;
}
~~~

缺省的参数必须从右向左依次给出，中间不允许间隔。

~~~cpp
void func(int a, int b, int c = 0);         // OK
void func(int a = 0, int b = 0, int c = 0); // OK
// void func(int a = 0, int b, int c = 0);  // 不允许
~~~
