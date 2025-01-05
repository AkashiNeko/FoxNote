---
title: 函数重载
date: 2022-07-03
isOriginal: true
icon: section
category:
  - C++
excerpt: 函数参数的默认值
order: 4
---

C++允许同一个作用域内定义多个同名函数，但它们的**参数列表**不能完全相同，这样的多个函数构成函数重载。

~~~cpp
void my_print(int a) {
    printf("int: %d\n", a);
}

void my_print(double n) {
    printf("double: %lf\n", n);
}

void my_print(const char* str) {
    printf("const char*: %s\n", str);
}
~~~

编译器会自动根据参数列表来选择调用哪个函数。

~~~cpp
int main() {
    my_print(123);     // int: 123
    my_print(3.14);    // double: 3.140000
    my_print("hello"); // const char*: hello
}
~~~
