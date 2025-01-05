---
title: 类的默认成员函数
date: 2022-08-14
isOriginal: true
icon: section
category:
  - C++
excerpt: C++类中的6个默认成员函数
order: 1
---

~~~cpp
class A {
public:
    // 1. 默认构造函数（Default Constructor）
    A() = default;
    // 2. 析构函数（Destructor）
    ~A() = default;
    // 3. 拷贝构造函数（Copy Constructor）
    A(const A&) = default;
    // 4. 拷贝赋值运算符（Copy AssignmentOperator）
    A& operator=(const A&) = default;
    // 5. 移动构造函数（Move Constructor）
    A(A&&) = default;
    // 6. 移动赋值运算符（Move AssignmentOperator）
    A& operator=(A&&) = default;
};
~~~

类中隐藏了一些特殊的成员函数，由编译器默认生成。它们分别是：

::: info 默认构造函数（Default Constructor）

- 作用：创建类的对象时调用，默认构造函数没有参数。
- 用途：初始化类的成员变量，分配资源，执行其他必要的初始化操作。

:::

::: info 析构函数（Destructor）

- 作用：当对象的生命周期结束时（超出作用域、被删除或销毁等），析构函数被调用。
- 用途：释放对象使用的资源、执行必要的清理操作。

:::

::: info 拷贝构造函数（Copy Constructor）

- 作用：在创建对象时，通过复制已存在的对象来初始化新对象。
- 用途：实现对象的深拷贝，确保新对象与原对象是独立的。

:::

::: info 拷贝赋值运算符（Copy Assignment Operator）

- 作用：将一个对象的值复制给另一个已存在的对象。
- 用途：实现对象的深拷贝，确保对象之间的独立性。

:::

::: info 移动构造函数（Move Constructor）

- 作用：在创建对象时，通过“窃取”已存在的对象的资源来初始化新对象。通常用于右值引用。
- 用途：实现高效的资源管理，避免不必要的数据拷贝。

> C++11加入

:::

::: info 移动赋值运算符（Move Assignment Operator）

- 作用：将一个对象的资源“窃取”给另一个已存在的对象。通常用于右值引用。
- 用途：实现高效的资源管理，避免不必要的数据拷贝。

> C++11加入

:::
