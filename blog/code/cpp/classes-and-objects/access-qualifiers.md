---
title: 访问限定符
date: 2022-08-09
isOriginal: true
icon: section
category:
  - C++
tag:
  - class
excerpt: 
order: 2
---

C++类使用了**访问限定符**，限制从类外部对成员访问的权限，从而达到封装的目的。访问限定符有以下3种：

> | 关键字 | 说明 | 访问权限 |
> | :--: | :--: | :--: |
> | `public` | 公有的✔️ | 从类外可以直接访问 |
> | `private` | 私有的🔒 | 只能被类中的成员访问，类外不可见 |
> | `protected` | 保护的🔑 | 能被类中和子类的成员访问，类外不可见 |

只有被 `public` 修饰的成员，才可以从类外直接访问，其他修饰的成员则对类外不可见。

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

在C++中，结构体的默认访问权限为 `public`，类则为 `private`，类的成员默认无法从外部访问。