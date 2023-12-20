---
title: this指针
date: 2022-08-11
isOriginal: true
icon: "/icon/cpp_oop_post.svg"
category:
  - C++
tag:
  - 编程语法
  - 面向对象
  - this
  - static
excerpt: C++面向对象编程基础，类和对象入门。
order: 2
---

## 1. this指针

### 隐藏参数

为了能修改对象的内存空间，在每个非静态成员函数的参数中，都隐藏了一个 `this` 指针，该指针指向调用函数的对象。

~~~cpp
class A {
    int num;
public:
    void setNum(int n) {
        num = n;
    }
};

A a;
a.setNum(10); // 函数调用，修改对象内存中的变量
~~~

之所以 `setNum` 函数能够修改对象的成员变量 `num`，是因为 `setNum` 函数的参数列表中，有一个隐藏的参数 `this`，函数其实是通过 `this` 指针找到对象所在的内存空间，并对内容进行修改。

~~~cpp
// 编译器眼中的成员函数
class A {
    ...
    void setNum(A* const this, int n) {
        this->num = n;
    }
    ...
};
~~~

::: info this指针

在C++中，this指针是一个隐式的指针，它指向当前对象的地址。通过使用this指针，可以在类的成员函数内部访问和操作当前对象的成员变量和成员函数。它主要用于解决成员变量与形参重名的冲突，同时也可以在成员函数中返回当前对象的引用，以实现链式调用。

:::

### const修饰

如果程序员声明了一个 `const` 对象，那么对象的内存应该无法被修改。即 `this` 指针需要被 `const` 修饰，才能保证成员函数无法修改对象的内存空间。

~~~cpp
const A* const this
~~~

但是在成员函数中，`this` 指针是一个隐藏参数，程序员无法直接使用 `const` 来修饰它。因此，C++给出的解决方案是：在函数声明的末尾加上 `const` 关键字，用以修饰 `this` 指针。

~~~cpp
class A {
    int num;
public:
    void setNum(int n) {
        num = n;
    }
    int getNum() const { // const 用于修饰 this 指针
        // this->num = 10; // 无法修改
        return num;
    }
};

...

A a1;
a1.setNum(10);

const A a2;
a2.getNum();
// a2.setNum(10); // 不能通过编译
~~~

### 空指针this

当 `this` 为空指针时，只要不对它进行解引用，程序仍能正常运行。这种做法是不推荐的。

~~~cpp
class A {
public:
    void print() {
        cout << "qwq\n";
    }
private:
    int a_;
};

int main() {
    A* pa = nullptr; // 空指针的对象
    pa->print(); // 将自身指针传入函数
    return 0;
}
~~~

### this作返回值

`this` 指针也可以作为函数的返回值使用，返回对象指针或者对象本身。

~~~cpp
class A {
public:
    void init(int a = 0) {
        a_ = a;
    }
    A& add() {
        ++a_;
        return *this;
    }
    void print() {
        cout << a_ << endl;
    }
private:
    int a_;
};

int main() {
    A a;
    a.init(0);
    a.add().add();
    return 0;
}
~~~

## 2. static关键字

### 静态成员变量

在C语言中，用 `static` 修饰的全局变量，会被限制在当前文件。

C++允许使用 `static` 修饰类的成员和函数，被 `static` 修饰的成员变量和成员函数称为**静态成员变量**和**静态成员函数**。

静态成员变量在所有类的实例之间共享，它存储在全局区，不占用对象的内存空间。

~~~cpp
class A {
public:
    static int a_;
private:
    int i_;
    static int b_;
};

int A::a_ = 10;
int A::b_ = 20;
~~~

值得注意的是，静态成员变量不能直接在类内赋予初始值，而是需要在**类内声明，类外定义**。

### 静态成员函数

`static` 可以用于修饰成员函数。与普通成员函数不同的是，静态成员函数的参数表中**没有** `this` 指针。由于成员函数访问成员变量时，需要通过 `this` 指针才能找到对象的内存，因此静态成员函数无法访问对象的非静态成员变量。

::: info 静态成员函数

静态成员函数是属于类而不是类的实例的函数。它们与任何特定的对象实例无关，而是与整个类相关联。

:::

~~~cpp
class A {
public:
    static void print() {
        // 静态成员函数可以访问静态成员变量
        cout << a_ << endl;

        // 静态成员函数无法访问普通成员变量
        // cout << i_ << endl; // 不能通过编译
    }
private:
    static int a_;
    int i_;
};
int A::a_ = 1;

int main() {
    A::print();
    return 0;
}
~~~

静态成员函数可以直接通过类名调用，而不需要通过对象实例。
