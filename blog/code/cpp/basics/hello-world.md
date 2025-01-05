---
title: Hello C++
date: 2022-07-01
isOriginal: true
icon: section
category:
  - C++
excerpt: Hello World!
order: 1
---

C++ 是编译型语言，需要使用编译器将代码文本转换为 CPU 认识的二进制机器码才能执行。常见的 C++ 编译器有 GNU 的 g++、LLVM 的 clang++ 以及 Microsoft 的 MSVC 等。这里我们使用 g++。

~~~bash:no-line-numbers
# Debian, Ubuntu..
apt install g++

# CentOS, Fedora..
dnf install g++

# MacOS
brew install g++
~~~

接下来创建一份C++代码，它是拓展名为 `.cpp`、`.cc` 或 `.cxx` 的文本文件。这里我们创建 `main.cpp` 文件。

和C语言一样，C++的程序入口是 `main`。C++ 兼容几乎所有 C 的语法，因此可以使用 C 语言的写法：

~~~cpp
#include <cstdio> // 也可以使用 stdio.h，但是推荐使用 cstdio

int main() {
    printf("Hello World!\n");
    return 0;
}
~~~

当然，C++ 提供了其特别的流式打印方式。

~~~cpp
#include <iostream> // 输入输出流

int main() {
    std::cout << "Hello World" << std::endl;
    return 0;
}
~~~

使用 `g++` 命令编译代码。其中 `-o` 选项之后可以指定生成的可执行文件名。

~~~bash:no-line-numbers
g++ main.cpp -o main
~~~

编译完成后，当前目录会出现可执行文件 `main`（Windows下为 `main.exe`）。使用 `./main` 命令来执行它。

~~~txt:no-line-numbers
$ ./main
Hello World
~~~
