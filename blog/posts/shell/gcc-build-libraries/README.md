---
title: gcc生成静态库和动态库
date: 2022-02-12
isOriginal: true
icon: pen-to-square
category:
  - C++
tag:
  - IO
---

**要做成库的代码文件**

~~~
fun1.h
fun1.cpp
fun2.h
fun2.cpp
~~~

##### 生成动态库

~~~bash
g++ -shared -fPIC fun1.cpp fun2.cpp -o libfuns.so
~~~

##### 生成静态库

~~~bash
g++ -c fun1.cpp -o fun1.o
g++ -c fun2.cpp -o fun2.o
ar -rc libfuns.a fun1.o fun2.o
~~~

## 项目结构

~~~
.
├── fun1.cpp
├── fun2.cpp
├── libfuns
│   ├── include
│   │   ├── fun1.h
│   │   └── fun2.h
│   └── lib
│       ├── libfuns.a
│       └── libfuns.so
└── out
    ├── fun1.o
    └── fun2.o
~~~

## 编译

包含`main`函数的文件：

~~~
main.cpp
~~~

##### 使用动态库，动态编译：

~~~bash
g++ main.cpp -I <头文件所在路径> -L <库文件所在路径> -o main -lfuns
~~~

##### 使用静态库，静态编译：

~~~bash
g++ main.cpp -I <头文件所在路径> -L <库文件所在路径> -o main -lfuns -static
~~~

## 使用

##### 动态库

查看可执行程序`main`所需的动态库

~~~bash
ldd ./main
~~~

此时会提示找不到动态库

~~~
libfuns.so => not found
~~~

因为这时候，我们只告诉了`gcc`动态库的位置，而没有告诉操作系统。

解决方案：

1. 添加到环境变量

~~~bash
echo LD_LIBRARY_PATH=$LD_LIBRARY_PATH:<你的库所在的绝对路径>
~~~

2. 添加到系统配置文件（需要root权限）
~~~bash
sudo vim /etc/ld.so.conf.d/<任意文件名>.conf # 把动态库的绝对路径写进去
sudo ldconfig # 刷新
~~~

3. 将软链接放进系统库目录

~~~bash
sudo ln -s <你的库所在的绝对路径> /lib64/libfuns.so
~~~