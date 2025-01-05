---
title: 动静态库的使用
date: 2023-02-13
isOriginal: true
icon: section
category:
  - Note
tag:
  - 动态库
  - 静态库
  - gcc
excerpt: 在程序中动态链接动态库，以及编译时静态链接静态库。
order: 2
---

## 1. 动态库和静态库

动态库是在运行时加载和链接的库文件，可以被多个应用程序共享和更新。适合共享代码和资源、运行时灵活性和插件机制。

静态库是在编译时与程序链接的库文件，被复制到可执行文件中，使程序更独立和可移植，但是会增加代码的体积。适合独立性和可移植性、编译时优化和发布分发的需求。

### 测试代码

创建 `lib` 目录，将之前生成的库文件 `libcalc.so` 和 `libcalc.a` 移入其中，并删除之前编译的二进制 `.o` 文件。

~~~bash:no-line-numbers
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

~~~text:no-line-numbers
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

## 2. 库的链接

### 链接动态库

使用下面的命名将 `main.c` 编译为可执行文件 `app`，同时链接上动态库 `libcalc.so` 文件。

~~~bash:no-line-numbers
gcc -o app main.c -I ./include/ -L ./lib/ -lcalc
~~~

这样就成功在 `root` 目录下生成了可执行文件 `app`，但是当我们尝试运行它的时候：

::: caution 运行程序

./app: error while loading shared libraries: libcalc.so: cannot open shared object file: No such file or directory

:::

使用 `ldd` 命令查看文件依赖的动态库：

~~~text:no-line-numbers
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

~~~bash:no-line-numbers
# 相对路径
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:./lib/

# 绝对路径
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$(pwd)/lib/
~~~

之后再使用 `ldd` 命令查看可执行文件 `app` 所需的动态库，发现动态库已被正确链接。

~~~text:no-line-numbers
$ ldd ./app
linux-vdso.so.1 (0x00007fffdabaa000)
libcalc.so => ./lib/libcalc.so (0x00007f03df010000)
libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007f03dec00000)
/lib64/ld-linux-x86-64.so.2 (0x00007f03df01c000)
~~~

尝试使用 `./app` 运行可执行文件，程序就可以被正确执行。

~~~text:no-line-numbers
$ ./app
10 + 20 = 30
~~~

### 链接静态库

静态链接与动态链接使用的命令相同，如果 `-L` 参数指定的目录下存在 `.so` 文件，则会发生动态链接。我们可以移除 `.so` 文件，让程序链接 `.a` 静态库。

~~~bash:no-line-numbers
mv ./lib/libcalc.so ./lib/libcalc.so.disable
gcc -o app main.c -I ./include/ -L ./lib/ -lcalc
~~~

使用 `ldd` 命令查看，可以发现程序中已经没有 `libcalc` 相关的库了，说明静态链接是成功的，同时程序可以正常运行。

~~~text:no-line-numbers
$ ldd ./app
linux-vdso.so.1 (0x00007ffcefdfd000)
libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007feee5a00000)
/lib64/ld-linux-x86-64.so.2 (0x00007feee5d5c000)

$ ./app
10 + 20 = 30
~~~

除了上面的方法，也可以使用 `-static` 参数强制使用静态链接，这样会将程序依赖的所有的库进行静态链接。

~~~bash:no-line-numbers
gcc -o app main.c -I ./include/ -L ./lib/ -lcalc -static
~~~

使用 `ldd` 命令查看，我们的可执行程序已经不需要任何动态库了，程序也可以正常运行。

~~~text:no-line-numbers
$ ldd ./app
不是动态可执行文件
~~~

需要注意的是，使用静态链接会增大文件的体积。下面是两种方法生成的可执行文件大小对比。

::: info 只静态链接当前所需的库

~~~text:no-line-numbers
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

~~~text:no-line-numbers
$ gcc -o app main.c -I ./include/ -L ./lib/ -lcalc -static
$ du -sh app
776K    app
~~~

可执行文件大小为**776KB**。

:::

具体如何选择库的链接，还是需要根据具体的情况分析。
