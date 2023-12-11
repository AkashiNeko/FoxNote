---
title: 默认成员函数
date: 2022-08-14
isOriginal: true
icon: "/icon/class.svg"
category:
  - C++
tag:
  - 编程语法
  - 面向对象
excerpt: C++类中的6个默认成员函数：构造函数、析构函数、拷贝构造、移动构造、拷贝赋值、移动赋值。
---

类中隐藏了一些特殊的成员函数，如果用户不显示地声明，编译器会自动生成。

~~~cpp
class A {
public:
    // 默认构造函数（Default Constructor）
    A() = default;
    // 析构函数（Destructor）
    ~A() = default;
    // 拷贝构造函数（Copy Constructor）
    A(const A&) = default;
    // 拷贝赋值运算符（Copy AssignmentOperator）
    A& operator=(const A&) = default;
    // 移动构造函数（Move Constructor）
    A(A&&) = default;
    // 移动赋值运算符（Move AssignmentOperator）
    A& operator=(A&&) = default;
};
~~~

## 1. 构造函数

### 什么是构造函数

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
        printf("i_ = %d", i_);
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

### 成员变量的初始化

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

### 初始化列表

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

### explicit关键字

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

## 2. 析构函数

### 什么是析构函数

::: info 析构函数

析构函数也是类中的六个默认成员函数之一，它的写法是在构造函数之前加一个波浪号，且不带任何参数。

:::

~~~cpp
class A {
    int a_;
public:
    A(int a) :a_(a) {};
    ~A() {}; // 析构函数
};
~~~

### 析构函数的调用

在对象声明周期结束时，程序会自动调用析构函数。

~~~cpp
class A {
public:
    A() {
        cout << "test  A" << endl;
    }
    ~A() {
        cout << "test ~A" << endl;
    }
};

int main() {
    A a1;
    return 0;
}
~~~

从运行结果来看，程序确实调用了析构函数`~A()`。在对象生命周期结束后，程序会自动调用析构函数。

### 对象资源的回收

如果类中的成员变量是内置类型，那么当对象的生命周期结束后，其在函数栈中空间会自动被回收。但如果成员使用了 `malloc` 或 `new` 等方法申请空间，对象销毁时没有释放空间，就会造成内存泄漏。因此，析构函数可以对其开辟的空间进行释放。

::: info 示例：一个简单的Stack类

Stack类使用 `malloc` 从堆中申请了空间。当对象的生命周期结束时，为了不造成内存泄漏，必须要回收这个空间。此时可以使用析构函数来自动释放这块空间。

~~~cpp
class Stack {
public:
    Stack(int capa = 4) :_capacity(capa) ,_top(0) {
        _data = (int*)malloc(_capacity * sizeof(int));
        assert(_data != nullptr);
    }
    ~Stack() {
        free(_data);
    }
private:
    int _top;
    int _capacity;
    int* _data;
};
~~~

:::

### 析构函数的调用顺序

::: info 对象的析构顺序

先创建的对象后析构，后创建的对象先析构。

~~~cpp
int main() {

    A a1; // a1.A() a1先构造
    A a2; // a2.A() a2后构造

    return 0;
    // a2.~A() a2先析构
    // a1.~A() a1后析构
}
~~~

:::

## 3. 拷贝构造函数

### 什么是拷贝构造

拷贝构造是构造函数的一个重载，用于从其他对象拷贝初始化。

~~~cpp
class A {
public:
    // 构造函数
    A() :i_(0) {}
    // 拷贝构造
    A(const A &a) i_(a.i_) {}

private:
    int i_;
};
~~~

### 拷贝构造的调用

::: info 拷贝初始化

当对象通过拷贝其他对象来初始化时，会调用拷贝构造函数。

:::

下面对象 `a2` 通过拷贝 `a1` 来完成自身的初始化。

~~~cpp
A a1;
A a2(a1);
~~~

同样的，可以通过下面的代码看出拷贝构造是如何调用的。

~~~cpp
class A {
public:
    // 构造函数
    A() :i_(0) {}

    // 拷贝构造
    A(const A &a) :i_(a.i_) {
        cout << "A(const A&)" << endl;
    }
private:
    int i_;
};

int main() {
    A a1;
    A a2(a1);
    return 0;
}
~~~

::: info 函数的传参

只要对象发生了拷贝初始化，就必须调用拷贝构造，包括函数传参的过程。

~~~cpp
void fun(A a) {} // 对象a1传参给a时，会调用一次拷贝构造

int main() {
    A a1;
    fun(a1); // 函数调用，传参
    return 0;
}
~~~

:::

由于拷贝构造函数也是函数，所以在传参时，对象必须以**引用**的形式传参。

如果以非引用的形式传参，会发生拷贝构造的调用，在拷贝构造的参数列表中，发生拷贝构造函数的调用，即对拷贝构造自身的调用，会造成无限递归。

::: info 非引用传参的危害

假设拷贝函数的参数 `a` 不使用引用传参

~~~cpp
A(A other) :i_(other.i_) {}
~~~

对象 `a2` 调用拷贝构造函数，试图对对象 `a1` 进行拷贝

~~~cpp
int main() {
    A a1;
    A a2(a1);
    return 0;
}
~~~

在调用 `A a2(a1)` 时，对象 `a1` 被作为参数传递给拷贝构造函数 `A(A other)` 中的对象 `other`，由于 `other` 不是一个引用，所以此时会发生新的拷贝：从 `a1` 到 `other` 的拷贝。而调用拷贝函数时，又会发生拷贝式的传参，造成无限递归。

:::

因此，在定义拷贝构造时必须使用**引用传参**。

### 深拷贝和浅拷贝

::: info 为什么需要自定义拷贝构造

在上面的示例中，拷贝构造对成员变量进行了拷贝，即直接对对象的内存空间进行了复制，这种拷贝称为**浅拷贝**。这种情况下，直接使用默认生成的拷贝构造函数也达成目的。

如果对象中管理了其他的资源，而拷贝时需要对这些额外的资源进行拷贝，就会涉及到对象的**深拷贝**。比如成员变量中含有其他资源的指针，就不得不自己定义拷贝构造。

编译器默认生成的拷贝构造都是浅拷贝。

:::

### 拷贝构造的实现

以之前Stack类举例。

~~~cpp
int main() {
    Stack s1;
    Stack s2(s1);
    return 0;
}
~~~

如果使用编译器默认生成的拷贝构造，在对Stack对象进行拷贝时，`_data` 指针会被拷贝到新对象，而其指向的数据没有被拷贝。这样会造成诸多问题，比如：

- *由于两个对象的 `_data` 指针指向同一块空间，在原对象中对 `_data` 指向的空间做修改时，会影响新对象中 `_data` 指向的空间。*
- *在调用析构函数时，`_data` 指向的空间会被释放两次，而导致程序异常。*

此时就需要自己定义深拷贝的逻辑了，不能只拷贝 `_data` 指针，而是要拷贝其指向的空间。

~~~cpp
Stack(const Stack& s) :_capacity(s._capacity), _top(s._top), _data(nullptr) {
    // 申请新的空间
    _data = (int*)malloc(_capacity * sizeof(int));
    assert(_data != nullptr);

    // 对空间进行拷贝
    memcpy(_data, s._data, _capacity * sizeof(int));
}
~~~

这样就能正确地完成Stack类的深拷贝了。

## 4. 拷贝赋值运算符

::: info 拷贝构造和赋值运算符的区别

拷贝赋值运算符和拷贝构造非常相似，都是对对象的拷贝。不同的是在赋值时，对象中可能已经存在被管理的数据，所以在拷贝工作之前，需要清除这些数据。下面是二者的对比：

- **拷贝构造**

~~~cpp
std::string s1 = "Hello, world";
std::string s2 = s1; // 调用拷贝构造，使用s1的内容初始化s2
~~~

- **拷贝赋值运算符**

~~~cpp
std::string s1 = "Hello, world";
std::string s2 = "Hello, AkashiNeko";
s1 = s2; // 调用赋值运算符，将s2赋值给s1，同时需要清除s1原有的内容
~~~

:::

### 什么是拷贝赋值运算符

拷贝赋值运算符的函数声明如下

~~~cpp
class A {
public:
    A& operator=(const A& a);
};
~~~

需要注意的是，它返回一个自身的引用，以应对连续赋值的情况

~~~cpp
A a1, a2, a3;
...
a1 = a2 = a3; // 连续赋值
~~~

### 拷贝赋值运算符的实现

相比拷贝构造，拷贝赋值运算符相当于在拷贝构造的工作之前，释放掉当前管理的资源。

::: info Stack类的拷贝赋值运算符

拷贝赋值运算符主要完成以下两个工作

- 清除当前管理的资源
- 拷贝资源

~~~cpp
Stack& operator=(const Stack& s) {
    // 清除当前管理的资源
    free(_data);
    _data = nullptr;

    // 申请新的空间
    _data = (int*)malloc(_capacity * sizeof(int));
    assert(_data != nullptr);

    // 对空间进行拷贝
    memcpy(_data, s._data, _capacity * sizeof(int));
    _capacity = s._capacity;
    _top = s._top;
}
~~~

:::

## 5. 移动构造函数（C++11）

### 右值引用

在C++11中，可以使用 `std::move()` 将对象转换为右值引用（将亡值），完成资源转移。

~~~cpp
std::string s1("Hello world");
std::string s2(std::move(s1));
// move之后: s1 = "", s2 = "Hello world";
~~~

### 什么是移动构造

顾名思义，移动构造也是构造函数的一种。移动构造可以更高效地转移资源（浅拷贝），比如 `std::string` 的移动构造。

::: info std::string 移动构造的例子

下面是 `std::string` 构造函数的例子。这里的 `to_string` 会将整数 `123` 转换为字符串对象 `"123"`，这个字符串对象是一个临时值（右值），被传入 `str` 对象的构造函数中。

~~~cpp
std::string str(to_string(123));
~~~

对于 `str` 对象的构造，如果不使用移动构造（C++11前），不考虑编译器优化，`to_string` 返回的临时对象需要通过深拷贝到 `str` 中，并且这个临时对象需要被析构。如果使用了移动构造，临时对象可以直接将自己管理的数据交给 `str` 管理，完成资源的转移，从而减少拷贝的次数。

:::

下面是一个移动构造函数的声明。

~~~cpp
class A {
public:
    A(A&& a);
};
~~~

### 移动构造的实现

以之前的Stack类举例，下面是Stack类的移动构造函数。它的主要工作是将 `_data` 指向的空间的管理权从右值交给新对象，并将临时对象的内容清空。

~~~cpp
Stack(Stack&& s) :_top(s._top), _capacity(s._capacity), _data(s._data) {
    s._top = s._capacity = 0;
    s._data = nullptr;
}
~~~

## 6. 移动赋值运算符（C++11）

### 什么是移动赋值运算符

与拷贝赋值运算符、移动构造函数类似，移动赋值运算符是通过右值引用的方式将对象的资源移动给新对象。

~~~cpp
class A {
public:
    A& operator=(A&& a);
};
~~~

为了支持连续赋值操作，它和拷贝赋值运算符同样，在数据移动之前，先清空当前的数据，移动完成后返回自身的引用。

::: info std::string 的移动赋值运算符

~~~cpp
std::string s1 = "Hello, world";
std::string s2;
s2 = std::move(s1);
// move之后，s1 = ""，s2 = "Hello, world";
~~~

:::

### 移动赋值运算符的实现

::: info Stack类的移动赋值运算符

移动赋值运算符主要完成以下三个工作

- 清除当前管理的资源
- 移动资源
- 清空临时对象

~~~cpp
Stack& operator=(Stack&& s) {
    // 清空当前管理的资源
    free(_data);
    _data = nullptr;

    // 移动资源
    _capacity = s._capacity;
    _top = s._top;
    _data = s._data;

    // 清空临时对象
    s._top = s._capacity = 0;
    s._data = nullptr;
}
~~~

:::
