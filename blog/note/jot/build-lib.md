---
title: 动静态库的制作
date: 2023-02-12
isOriginal: true
icon: section
category:
  - Note
tag:
  - 编译
  - 动态库
  - 静态库
  - gcc
excerpt: 使用gcc编译器，将源文件编译为动态库和静态库，并在程序中使用。
order: 1
---

## 1. 准备工作

### 安装gcc

如果你还没有安装gcc编译器，请先安装。

~~~bash:no-line-numbers
# RedHat CentOS ...
sudo yum install gcc -y

# Debian Ubuntu ...
sudo apt install gcc -y

# 其他发行版自行上网查找教程，此处不作赘述
~~~

阅读本文前，默认你已经了解 `gcc` 常见的编译参数，如 `-o`、`-c`、`-I`、`-L` 等，如果对这些常用编译参数不熟悉，请自行查阅相关资料。

### 准备源代码

以计算器库为例子，将加减乘除四个函数编译成一个库。

为了方便表述，以下将当前目录（ `.` ）称为 `root` 目录。

~~~text:no-line-numbers
root
├── include
│   └── calc.h
└── src
    ├── add.c
    ├── div.c
    ├── mul.c
    └── sub.c
~~~

在 `root` 目录下建立 `src` 和 `include` 目录，分别添加以下源代码和头文件。

::: details root/include目录下

calc.h

~~~c
#pragma once

int add(int a, int b);
int sub(int a, int b);
int mul(int a, int b);
int div(int a, int b);
~~~

:::

::: details root/src目录下

add.c

~~~c
#include "calc.h"

int add(int a, int b) {
    return a + b;
}
~~~

sub.c

~~~c
#include "calc.h"

int sub(int a, int b) {
    return a - b;
}
~~~

mul.c

~~~c
#include "calc.h"

int mul(int a, int b) {
    return a * b;
}
~~~

div.c

~~~c
#include "calc.h"

int div(int a, int b) {
    return a / b;
}
~~~

:::

## 2. 生成库文件

在 `root` 目录下执行命令。

### 生成动态库

使用以下的命令，会在 `root` 目录下生成名为 `libcalc.so` 的动态库文件。

~~~bash:no-line-numbers
gcc -shared -fPIC -I ./include/ src/*.c -o libcalc.so
~~~

::: info gcc参数说明

`-shared`：选项告诉编译器生成一个共享库，也被称为动态链接库或共享对象。共享库是一种可被多个程序共享和重用的二进制代码和数据集合。与静态库相比，共享库在运行时动态加载到内存中，可以在多个进程之间共享，从而减少内存消耗并提高系统的效率。

`-fPIC`：选项是为了生成位置无关代码（Position Independent Code，PIC）。位置无关代码是一种可在内存中的任意位置加载和执行的代码。在共享库中使用位置无关代码是很重要的，因为共享库可能被加载到内存中的任意位置，而不同进程的内存布局可能会不同。使用 `-fPIC` 选项生成的代码可以通过使用相对地址访问数据和函数，而不是使用绝对地址。这使得共享库可以在内存的不同位置加载，并且可以与其他代码和共享库进行正确的链接和重定位。

:::

### 打包静态库

使用以下的命令，会在 `root` 目录下生成名为 `libcalc.a` 的静态库文件。

~~~bash:no-line-numbers
gcc -c -I ./include/ src/*.c
ar -rc libcalc.a *.o
~~~

要制作一个静态库，需要先使用 `gcc -c` 将源文件先编译成二进制 `.o` 文件，然后再用 `ar` 命令进行打包。

::: info ar命令说明

`ar`："Archiver"的缩写，是GNU工具链中的一个工具，用于创建、修改和提取静态库（Archive）文件。

`-r`：表示插入（Replace），即将新的目标文件添加到库中，如果库中已存在同名的目标文件，则替换它。

`-c`：创建静态库（Create Archive），即如果库不存在，则创建一个新的静态库文件。

:::
