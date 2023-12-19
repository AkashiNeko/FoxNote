---
title: 类和对象入门
date: 2022-08-09
isOriginal: true
icon: "/icon/brackets.svg"
category:
  - C++
tag:
  - 编程语法
  - 面向对象
excerpt: C++面向对象编程基础，类和对象入门。
order: 1
---

## 1. 什么是类

### 从结构体到类

在C语言中，结构体用于将不同的类型打包在一起。在C++的类中，不仅有C语言结构体的所有功能，还可以定义函数，以及许多便利的功能。类中的函数一般称为**方法**。

~~~cpp
class MyClass {

    // 成员方法
    void function();

    // 成员变量
    int i;

}; // 这是一个C++类的声明
~~~

在C++中，对象的实例化不需要像C语言一样使用struct关键字修饰，可以直接使用类名：

~~~cpp
// C语言的写法
struct MyStruct st;

// C++的写法
MyClass A;
~~~

### 访问限定符

C++使用访问限定符关键字限制对类成员的访问

| 关键字 | 说明 | 访问权限 |
| :--: | :--: | :--: |
| public | 公有的 | 从类外可以直接访问 |
| private | 私有的 | 只能被类中的成员访问，类外不可见 |
| protected | 保护的 | 能被类中和子类的成员访问，类外不可见 |

只有public修饰的成员可以从类外直接访问，如下面的例子。

~~~cpp
class MyClass {
public:
    void f() {
        cout << "qwq\n";
    }
private:
    int a;
    char str[10];
protected:
    int i;
};

// 访问测试
MyClass mc;
mc.func1(); // 可以访问，f 是 "公有的"
mc.a = 10;  // 无法访问，a 是 "私有的"
mc.i++;     // 无法访问，i 是 "保护的"
~~~

结构体的默认访问权限为public，类则是private，默认是无法从外部访问的。

### 类的作用域

类定义了一个域名为类名的作用域，与命名空间namespace类似。

~~~cpp
class A {
public:
    static int i;
    using MyInt = int;
};

// 类外访问
A::i = 10;
A::MyInt num = 20;
~~~

## 2. 类的成员方法

### 对象的内存模型

在C语言的结构体中，成员变量会按照内存对齐占用对象空间。那么C++类的成员方法如何存储？

现有两个类，观察其大小。

~~~cpp
// 类A中包含一个成员方法和一个int变量
class A {
public:
    void func() {}
    int num;
};

// 类B中只包含一个int变量
class B {
public:
    int num;
};
~~~

分别用sizeof计算类的大小

~~~cpp
sizeof(A); // 4
sizeof(B); // 4
~~~

A和B占用空间相同，这说明，成员方法并不占用对象的空间。

~~~cpp
class MemberlessClass {};

sizeof(MemberlessClass); // 1
~~~

如果类中没有任何成员，编译器会分配一个字节给对象。

### 成员方法的调用

成员方法可以在类中声明，在类外定义。类外定义时需要加上

~~~cpp
class A {
    int a_;
    int b_;

public:
    // 声明
    void public_method();

private:
    // 声明
    void private_method();
};

// 定义
void A::public_method() {
    cout << a_;
}

// 定义
void A::private_method() {
    cout << b_;
}
~~~

成员方法的调用，可以使用object.method()的方式。

~~~cpp
class A {
public:
    void fun() {
        cout << 1;
    }
    void init(int a) {
        a_ = a;
    }
private:
    int a_;
};

A obj;
obj.fun();   //调用成员函数fun
obj.init(3); //调用成员函数init
~~~

也可以用匿名对象的方式调用成员函数，此时对象为右值。

~~~cpp
class A {
public:
    void print() {
        cout << "qwq\n";
    }
};

// 匿名对象 A()
A().print();
~~~

## 3. this指针

### 成员方法的隐藏参数

类内的每个非静态成员方法的参数中都隐藏了一个this指针，该指针指向当前调用的对象。

~~~cpp
class A {
    int num;
public:
    void setNum(int n) {
        num = n;
    }
};

// 调用方法
A a;
a.setNum(10); // 将a中的num值修改为10
~~~

为什么setNum方法能够修改num？这是因为setNum的参数列表中有一个隐藏的参数this，setNum通过this指针修改了num的值。

~~~cpp
// 编译器会将setNum处理成以下的形式
void setNum(A* const this, int n) {
    this->num = n;
}
~~~

### const方法

此时如果用户声明了一个const对象，this指针应该是const的，即

~~~cpp
const A* const this
~~~

但是this参数是被隐藏的，用户无法在this之前加上const，因此，C++给出的解决方案是在函数声明后加上const关键字：

~~~cpp
class A {
    int num;
public:
    void setNum(int n) {
        num = n;
    }
    int getNum() const {
        return num;
    }
};

// const的使用
A a1;
a1.setNum(10);

const A a2 = a1;
a2.getNum();
a2.setNum(10); // 错误，const对象无法调用非const方法
~~~

### 特殊用法

当this为空指针时，只要this不发生解引用，程序仍能正常运行

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
    A* pa = nullptr;
    pa->print();
    return 0;
}
~~~

this指针也可以作为返回值使用。比如返回对象指针或者对象本身，如下面的add方法。

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
    a.add().add(); // a_ 变成 2
    return 0;
}
~~~

## 4. static关键字

### 静态成员变量

在C语言中，用static修饰可以将局部变量存储在全局区，将全局变量限制在当前文件。

在C++中，使用static修饰类的成员，也会使其存储在全局区，而不占用对象的内存空间。静态成员是该类类型所有对象共享的。

~~~cpp
// 在类中声明静态成员变量
class A {
public:
    static int a_;
private:
    int i_;
    static int b_;
};
~~~

静态成员变量需要在类内声明，在类外定义，定义时需要指明类域

~~~cpp
int A::a_ = 10;
int A::b_ = 20;
~~~

### 静态成员方法

static也可以用于修饰成员方法。静态成员方法的参数表中没有this指针，因此静态成员函数不能访问非静态成员变量。

~~~cpp
class A {
public:
    static void print() {
        cout << a_ << endl;
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

## 5. 友元

### 友元方法

类外的函数无法访问类中非公有成员。如果要让类外方法能访问，需要在类中声明该方法为**友元方法**。即在函数声明前加上关键字friend，使该方法能访问类的私有和保护成员。

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

友元函数是定义在类外的**普通函数**，不属于任何类的成员，没有this指针，因此不能使用const修饰。它可以同时是多个类的友元，可以在类定义的任何地方声明，不会受到访问限定符的限制。

友元函数会破坏类的封装，增大耦合度，所以不宜多用。

### 友元类

在一个类中，如果用friend修饰声明另一个类，则称另一个类是这个类的友元类。友元类使用 `friend class` 声明。

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
        // B类中访问A的私有成员
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

### 内部类

如果一个类定义在另一个类的内部，则这个类天生就是另一个类的友元。

~~~cpp
class A {
    int a_;
    static int i_;
public:
    //B定义在A的内部
    class B {
        int b_;
    public:
        void fun() {
            cout << i_ << endl;
            A a1;
            //B是A的友元
            a1.a_ = 1;
        }
    };
};
~~~
