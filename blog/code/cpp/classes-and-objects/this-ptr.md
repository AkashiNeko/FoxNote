---
title: this指针
date: 2022-08-11
isOriginal: true
icon: section
category:
  - C++
tag:
  - this
excerpt: 成员函数的this指针
order: 3
---

## 隐藏参数

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

## const修饰

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

## 空指针this

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

## this作返回值

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
