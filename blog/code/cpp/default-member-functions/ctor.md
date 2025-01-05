---
title: 构造函数
date: 2022-08-14
isOriginal: true
icon: section
category:
  - C++
tag:
  - 构造函数
excerpt: C++对象的创建和初始化
order: 2
---

## 什么是构造函数

构造函数是类中隐藏的特殊函数之一，如果程序员没有手动声明，那么编译器会为程序自动生成。

::: info 构造函数

构造函数是一个隐藏的默认成员函数，函数名与类名相同，且不写返回值。

~~~cpp
class A {
    int i_;
public:
    // 默认构造函数
    A() {}
};
~~~

在对象实例化的过程中，构造函数会被调用，用于初始化对象。

:::

通过函数重载，我们可以使用构造函数初始化成员变量。

~~~cpp
class A {
public:
    A() { i_ = 0; }

    A(int a) { i_ = a; }

    void show() {
        printf("i = %d\n", i_);
    }
private:
    int i_;
};

int main() {

    A a1; // 调用 A()
    a1.show(); // 0

    A a2(3); // 调用 A(int a)
    a2.show(); // 3

    return 0;
}
~~~

上面的两个构造函数也可以单独写成缺省参数的形式。

~~~cpp
A(int a = 0) {
    i_ = a;
}
~~~

## 成员的初始化

::: info 自定义类型

如果类的成员变量中存在自定义类型，那么这个类在实例化对象的时候，会自动调用自定义类型的构造函数。

:::

~~~cpp
class A {
public:
    A() { cout << "Hello A\n"; }
};

class B {
private:
    int n_;
    A a_; // B中存在自定义类型A
};

int main() {
    B b1;
    return 0;
}
~~~

由于B类中包含A类的对象，B类在实例化时，会自动调用A类的构造函数，调用由B类的构造函数完成。

::: info 内置类型

类初始化时，默认会处理自定义类型，调用自定义类型的构造函数，但是默认不对内置类型进行初始化。内置类型在类中声明可以给予初值（C++11）。

:::

~~~cpp
class A {
public:
    int a = 1;
    int b = 2;
};

struct St {
    int c = 3;
    int d = 4;
};
~~~

## 初始化列表

在之前的初始化对象中，成员变量是在构造函数内部被赋值初始化的。

~~~c
A(int a = 0) {
    i_ = a;
}
~~~

这种赋值操作也可以写成**初始化列表**的形式：

~~~c
A(int a = 0) :i_(a) {}
~~~

::: info 初始化列表的写法

~~~cpp
:member1(value1), member2(value2), member3(value3)
~~~

:::

~~~cpp
class Date {
public:
    Date(int Year = 1970, int Month = 1, int Day = 1)
        :year_(Year), month_(Month), day_(Day) {}
private:
    int year_;
    int month_;
    int day_;
};
~~~

如果类中存在**常量**或者**引用**的成员变量，则只能用初始化列表进行初始化。

~~~cpp
class A {
public:
    A(int &i, int c) :i_(i), c_(c) {}

    // 下面的代码无法通过编译
    //
    // A(int i, int c) {
    //     i_ = i;
    //     c_ = c;
    // }
    //
    // 因为其本质上是赋值，并不是初始化
    // 而引用和常量都无法被赋值

private:
    int& i_;
    const int c_;
};

int main() {
    int i = 10;
    A a(i, 20);
    return 0;
}
~~~

## explicit关键字

::: info 构造函数的隐式类型转换

在创建对象时，对于只有一个参数或者第一个参数之后的参数都有默认值的构造函数，除了用函数调用的形式传参，还可以用等号进行类型转换赋值。

:::

~~~cpp
class A {
public:
    A(int a = 0) :i_(a) {}
private:
    int i_;
};

int main() {
    A a = 1; // 直接使用等号初始化，这里也是在调用构造函数
    return 0;
}
~~~

使用 `explicit` 关键字修饰构的造函数，会禁止这种构造函数的隐式类型转换。

~~~cpp
class A {
public:
    explicit A(int a = 0, int b = 2) :i_(a) {}
private:
    int i_;
};

int main() {
    A a(1); // 构造函数被explicit修饰，只允许这种形式的调用
    // A a = 1; // 不允许
    return 0;
}
~~~
