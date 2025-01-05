---
title: 友元
date: 2022-08-13
isOriginal: true
icon: section
category:
  - C++
tag:
  - 友元
excerpt: C++友元函数和友元类
order: 5
---

## 1. 友元

### 友元函数

由于类的访问限制，类外的函数无法访问类中非 `public` 成员，如果一定要让类外的函数访问，C++允许在类中声明该函数为**友元函数**。

::: info 友元函数

友元函数是在C++中的一种特殊函数，它与类具有特殊的关系，并被授权访问类的私有成员。友元函数可以在类的外部定义，但在类的声明中声明为友元。

友元函数可以访问类的非 `public` 成员，这使得它可以在需要访问类的私有成员时提供更高的灵活性和访问权限。

友元函数可以是全局函数，也可以是其他类的成员函数，只要它们在类的声明中声明为友元。需要注意的是，友元函数的声明必须在类的内部进行，并且在类的外部进行定义。

:::

要声明一个函数为友元函数，需要在函数声明前加上关键字 `friend`，使该函数能访问类的私有和保护成员。

~~~cpp
class A {
    int i_;
public:
    // 声明友元函数
    friend void fun(A& a);
};

void fun(A& a) {
    // 访问类的私有成员变量
    a.i_ = 1;
}
~~~

由于友元函数定义在类外，不属于类的成员，所以也没有 `this` 指针。它可以同时是多个类的友元，可以在类定义的任何地方声明，不受访问限定符的限制。

::: warning 慎重使用友元函数

友元函数可以绕过类的封装性，破坏类的数据封装和访问控制。因此，友元函数的使用应该谨慎，并且仅在确实需要访问私有成员的情况下使用。

:::

### 友元类

与友元函数类似，如果一个类要访问另一个类的非 `public` 成员，可以声明这个类为友元类。

~~~cpp
class A {
    int a_;
public:
    // 声明友元类
    friend class B;
};

class B {
public:
    void fun() {
        A a1;
        // 访问 A 的私有成员
        a1.a_ = 1;
    }
private:
    int b_;
};
~~~

友元类是单向的，且不具有传递性。

~~~cpp
class A {
    int a_;
public:
    friend class B;
};

class B {
    int b_;
public:
    friend class C;
};

class C {
    int _c;
public:
    void fun() {
        A a1;
        // a1.a_ = 1; 错误！
        // A和C之间没有友元关系
    }
};
~~~

::: warning 慎重使用友元类

与友元函数类似，友元类应该被慎重使用，它可能破坏封装性和访问控制。确保只在确实需要共享私有成员或实现特定的协作关系时使用。

:::

## 2. 内部类

### 天生的友元

如果一个类定义在另一个类的内部，则这个类天生就是友元类。

::: info 内部类

内部类是在一个类的**内部**定义的类。它被嵌套在另一个类中，并且可以访问该外部类的所有成员，包括私有成员。内部类与外部类之间建立了一种紧密的关联，可以用于实现更复杂的逻辑和数据封装。

:::

### 示例

下面是一个内部类的示例。

~~~cpp
#include <iostream>

class Outer {
private:
    int outer_data_;

public:
    Outer(int data) : outer_data_(data) {}

    // 内部类
    class Inner {
    public:
        void display(const Outer& outer) {
            // 访问外部类的私有成员
            std::cout << "Outer data: " << outer.outer_data_ << std::endl;
        }
    };
};

int main() {
    Outer outerObj(20);
    Outer::Inner innerObj;
    innerObj.display(outerObj);
    return 0;
}
~~~

执行结果。

~~~text:no-line-numbers
Outer data: 20
~~~
