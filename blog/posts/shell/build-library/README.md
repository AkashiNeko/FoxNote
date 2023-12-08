---
title: gcc生成动静态库
date: 2023-02-12
isOriginal: true
icon: "/icon/library.svg"
category:
  - Shell
tag:
  - gcc
  - Compile
  - Library
excerpt: 使用gcc编译器，将源文件分别编译为动态库和静态库，并在其他程序中使用。
---

## 1. 准备工作

### 安装gcc

如果你还没有安装gcc编译器，请先安装。

~~~bash
# REDHAT CentOS ...
sudo yum install gcc -y

# Debian Ubuntu ...
sudo apt install gcc -y

# 其他发行版自行上网查找教程，此处不多赘述
~~~

阅读本文前，默认你已经了解 `gcc` 常用的编译参数，如 `-o`、`-c`、`-I`、`-L` 等，如果对这些常用编译参数不熟悉，请自行查阅相关资料。

### 准备源代码

以计算器库为例子，将加减乘除四个函数编译成一个库。

为了方便表述，以下将当前目录（ `.` ）称为 `root` 目录。

~~~text
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

~~~bash
gcc -shared -fPIC -I ./include/ src/*.c -o libcalc.so
~~~

::: info gcc参数说明

`-shared`：选项告诉编译器生成一个共享库，也被称为动态链接库或共享对象。共享库是一种可被多个程序共享和重用的二进制代码和数据集合。与静态库相比，共享库在运行时动态加载到内存中，可以在多个进程之间共享，从而减少内存消耗并提高系统的效率。

`-fPIC`：选项是为了生成位置无关代码（Position Independent Code，PIC）。位置无关代码是一种可在内存中的任意位置加载和执行的代码。在共享库中使用位置无关代码是很重要的，因为共享库可能被加载到内存中的任意位置，而不同进程的内存布局可能会不同。使用 `-fPIC` 选项生成的代码可以通过使用相对地址访问数据和函数，而不是使用绝对地址。这使得共享库可以在内存的不同位置加载，并且可以与其他代码和共享库进行正确的链接和重定位。

:::

### 打包静态库

使用以下的命令，会在 `root` 目录下生成名为 `libcalc.a` 的静态库文件。

~~~bash
gcc -c -I ./include/ src/*.c
ar -rc libcalc.a *.o
~~~

要制作一个静态库，需要先使用 `gcc -c` 将源文件先编译成二进制 `.o` 文件，然后再用 `ar` 命令进行打包。

::: info ar命令说明

`ar`："Archiver"的缩写，是GNU工具链中的一个工具，用于创建、修改和提取静态库（Archive）文件。

`-r`：表示插入（Replace），即将新的目标文件添加到库中，如果库中已存在同名的目标文件，则替换它。

`-c`：创建静态库（Create Archive），即如果库不存在，则创建一个新的静态库文件。

:::

## 3. 库的使用

动态库是在运行时加载和链接的库文件，可以被多个应用程序共享和更新。适合共享代码和资源、运行时灵活性和插件机制。

静态库是在编译时与程序链接的库文件，被复制到可执行文件中，使程序更独立和可移植，但是会增加代码的体积。适合独立性和可移植性、编译时优化和发布分发的需求。

### 测试代码

创建 `lib` 目录，将之前生成的库文件 `libcalc.so` 和 `libcalc.a` 移入其中，并删除之前编译的二进制 `.o` 文件。

~~~bash
rm *.o -f
mkdir lib
mv libcalc.* lib/
~~~

创建 `main.c` 文件，写入以下内容。

~~~c
#include <stdio.h>
#include "calc.h"

int main() {
    int a = 10, b = 20;
    int c = add(a, b);
    printf("%d + %d = %d\n", a, b, c);
    return 0;
}
~~~

此时，目录结构应该是这样的：

~~~text
root
├── include
│   └── calc.h
├── lib
│   ├── libcalc.a
│   └── libcalc.so
├── main.c
└── src
    ├── add.c
    ├── div.c
    ├── mul.c
    └── sub.c
~~~

### 链接动态库

使用下面的命名将 `main.c` 编译为可执行文件 `app`，同时链接上动态库 `libcalc.so` 文件。

~~~bash
gcc -o app main.c -I ./include/ -L ./lib/ -lcalc
~~~

这样就成功在 `root` 目录下生成了可执行文件 `app`，但是当我们尝试运行它的时候：

::: caution 运行程序

./app: error while loading shared libraries: libcalc.so: cannot open shared object file: No such file or directory

:::

使用 `ldd` 命令查看文件依赖的动态库：

~~~text
$ ldd ./app
linux-vdso.so.1 (0x00007fff11fd5000)
libcalc.so => not found
libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007fc11c800000)
/lib64/ld-linux-x86-64.so.2 (0x00007fc11cbdc000)
~~~

可以发现它依赖的 `libcalc.so` 是 `not found` 的，也就是说程序并不知道我们的动态库文件在哪里。

这是因为程序运行时，默认从 `/usr/lib` 或 `/usr/local/lib` 目录下寻找动态库，如果找不到，就会出现以上的报错。

为了解决这个问题，我们当然可以将我们生成的库文件直接移入这些存放系统运行库的目录，但是这样做可能会造成对系统库的污染。除非你明确地知道自己在做什么，否则不推荐这种做法。

更好的做法是使用环境变量 `LD_LIBRARY_PATH` 来设置动态库的搜索路径。使用 `export` 命令设置该环境变量，推荐使用绝对路径。

~~~bash
# 相对路径
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:./lib/

# 绝对路径
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$(pwd)/lib/
~~~

之后再使用 `ldd` 命令查看可执行文件 `app` 所需的动态库，发现动态库已被正确链接。

~~~text
$ ldd ./app
linux-vdso.so.1 (0x00007fffdabaa000)
libcalc.so => ./lib/libcalc.so (0x00007f03df010000)
libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007f03dec00000)
/lib64/ld-linux-x86-64.so.2 (0x00007f03df01c000)
~~~

尝试使用 `./app` 运行可执行文件，程序就可以被正确执行。

~~~text
$ ./app
10 + 20 = 30
~~~

### 链接静态库

静态链接与动态链接使用的命令相同，如果 `-L` 参数指定的目录下存在 `.so` 文件，则会发生动态链接。我们可以移除 `.so` 文件，让程序链接 `.a` 静态库。

~~~bash
mv ./lib/libcalc.so ./lib/libcalc.so.disable
gcc -o app main.c -I ./include/ -L ./lib/ -lcalc
~~~

使用 `ldd` 命令查看，可以发现程序中已经没有 `libcalc` 相关的库了，说明静态链接是成功的，同时程序可以正常运行。

~~~text
$ ldd ./app
linux-vdso.so.1 (0x00007ffcefdfd000)
libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007feee5a00000)
/lib64/ld-linux-x86-64.so.2 (0x00007feee5d5c000)

$ ./app
10 + 20 = 30
~~~

除了上面的方法，也可以使用 `-static` 参数强制使用静态链接，这样会将程序依赖的所有的库进行静态链接。

~~~bash
gcc -o app main.c -I ./include/ -L ./lib/ -lcalc -static
~~~

使用 `ldd` 命令查看，我们的可执行程序已经不需要任何动态库了，程序也可以正常运行。

~~~text
$ ldd ./app
不是动态可执行文件
~~~

需要注意的是，使用静态链接会增大文件的体积。下面是两种方法生成的可执行文件大小对比。

::: info 只静态链接当前所需的库

~~~text
$ mv lib/libcalc.so lib/libcalc.so.disable
$ gcc -o app main.c -I ./include/ -L ./lib/ -lcalc
$ ldd app
linux-vdso.so.1 (0x00007fff4f303000)
libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007f18b5200000)
/lib64/ld-linux-x86-64.so.2 (0x00007f18b5513000)

$ du -sh app
16K     app
~~~

可执行文件大小为**16KB**。

:::

::: info 静态链接所有需要的库

~~~text
$ gcc -o app main.c -I ./include/ -L ./lib/ -lcalc -static
$ du -sh app
776K    app
~~~

可执行文件大小为**776KB**。

:::

具体如何选择库的链接，还是需要根据具体的情况分析。
