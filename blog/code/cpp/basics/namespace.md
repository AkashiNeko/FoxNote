---
title: 命名空间
date: 2022-07-02
isOriginal: true
icon: section
category:
  - C++
excerpt: namespace 关键字
order: 2
---

在C语言中，非static函数都是在全局作用域中的，随着项目规模的扩大，容易发生命名冲突。于是，C++引入了命名空间 `namespace` 的概念。

~~~cpp
namespace foo {
    int a = 10;
    void func() {
        std::cout << "func()" << std::endl;
    }
}
~~~

命名空间定义了一个作用域，要访问命名空间中的符号，需要使用命名空间名+作用域限定符 `::` 的形式访问，比如：

~~~cpp
int main() {
    std::cout << foo::a << std::endl;
    foo::func();
    return 0;
}
~~~

命名空间支持嵌套使用。

~~~cpp
#include <iostream>

namespace foo {
    int n1 = 0;
    namespace bar {
        int n2 = 0;
    }
}

int main() {
    std::cout << foo::n1 << std::endl;
    std::cout << foo::bar::n2 << std::endl;
    return 0;
}
~~~

使用 `using` 关键字可以展开命名空间到当前的作用域。

~~~cpp
#include <iostream>

namespace foo {
    void func() {
        std::cout << "func()" << std::endl;
    }
}

using namespace foo; // 展开命名空间 foo

int main() {
    func(); // 直接调用
    return 0;
}
~~~

也可以指定某个要展开到当前作用域的符号。

~~~cpp
using foo::func; // 从命名空间 foo 中展开符号 func
~~~

在C++标准库中，所有的标准库符号都处于命名空间 `std` 下。因此，可以使用 `using namespace std` 展开标准库命名空间。在实际项目中，展开 `std` 可能会造成命名空间污染，所以不推荐这样的做法。建议完成写出命名空间 `std::`，或单独对需要频繁使用的符号进行展开。

~~~cpp
#include <iostream>

// using namespace std;
using std::cout;
using std::endl;

int main() {
    cout << "Hello World" << std::endl;
    return 0;
}
~~~

如果定义了某些全局变量或函数，又不想让它们暴露给其他文件，可以使用匿名命名空间。顾名思义，即没有名字的命名空间，`namespace` 关键字后不指名名称，而是直接跟一对花括号。

~~~cpp
#include <iostream>

namespace {
    int global_var = 100; // 仅当前文件可见
}

int main() {
    std::cout << global_var << std::endl;
    return 0;
}
~~~

如果有一个全局变量和局部变量同名，想要访问全局变量时，就需要使用没有名称的作用域限定符，比如：

~~~cpp
#include <iostream>

int x = 10;

namespace foo {
    int x = 20;
}

int main() {
    int x = 30;
    
    std::cout << "::x = " << ::x << std::endl;       // 10
    std::cout << "foo::x = " << foo::x << std::endl; // 20
    std::cout << "x = " << x << std::endl;           // 30
    return 0;
}
~~~
