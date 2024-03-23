---
title: 第一个C++程序
date: 2022-07-01
isOriginal: true
icon: book
category:
  - C++
excerpt: 第一个C++程序
order: 1
---

## 1. 环境配置

C++是一种编译型的语言，由C++编译器将C++代码转换为CPU认识的二进制机器码运行。为了完成第一个C++代码，首先需要安装C++编译器，这里我们选择 `g++`。

Ubuntu下安装 `g++` 编译器。

~~~bash:no-line-numbers
sudo apt install g++
~~~

接下来，创建一份C++代码，它是以 `.cpp`（或 `.cc`、`.cxx`）为后缀名的文本文件。

和C语言一样，C++的程序入口是 `main` 函数。将文件命名为 `main.cpp`。

~~~cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Hello World" << endl;
    return 0;
}
~~~

使用 `g++` 命令编译代码。其中 `-o` 选项可以指定二进制文件的文件名。

~~~bash:no-line-numbers
g++ main.cpp -o main
~~~

编译成功后，当前目录会出现可执行文件 `main`（Windows下为 `main.exe`），使用 `./main` 命令来运行它。

~~~txt:no-line-numbers
$ ./main
Hello World
~~~
