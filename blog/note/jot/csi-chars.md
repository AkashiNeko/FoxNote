---
title: CSI控制字符
date: 2023-02-16
isOriginal: true
icon: section
category:
 - Note
tag:
 - 终端
excerpt: Shell终端的特殊控制字符，用于修改光标位置，屏幕显示以及打印颜色等。
order: 3
---

## 1. 使用方法

在支持彩色文字和背景的终端下，可以使用以下控制字符改变文字的颜色以及背景颜色。

::: tip 使用方法
`\033[n1;n2;...m`

以下的代码会输出一个红色的

<p style="color: red">Hello world</p>

::: code-tabs

@tab C

~~~c
#include <stdio.h>

int main() {
    printf("\033[31mHello world\n");
    return 0;
}
~~~

@tab C++

~~~cpp
#include <iostream>

int main() {
    std::cout << "\033[31mHello world" << std::endl;
    return 0;
}
~~~

@tab Java

~~~java
public class Main {
    public static void main(String[] args) {
        System.out.println("\033[31mHello world");
    }
}
~~~

@tab Python

~~~python
print('\033[31mHello world')
~~~

@tab JavaScript

~~~js
console.log('\033[31mHello world')
~~~

@tab bash

~~~bash:no-line-numbers
echo -e '\033[31mHello world'
~~~

:::

## 2. 控制字符表

::: info 是否可用取决于终端，可能只有部分可用。

:::

::: details 位置控制

| 字符 | 说明 |
| -- | -- |
| `\033[X;YH` | 将光标移至第 X 行，第 Y 列的位置 |
| `\033[nA` | 光标上移 n 列 屏幕顶端无效 |
| `\033[nB` | 光标下移 n 列 屏幕底端无效 |
| `\033[nC` | 光标向右 n 行 屏幕右端无效 |
| `\033[nD` | 光标向左 n 行 屏幕左端无效 |
| `\033[6n` | 报告光标位置 |
| `\033[s` | 保存目前的光标位置 |
| `\033[u` | 取出保存的光标位置来使用 |
| `\033[?25l` | 隐藏光标  |
| `\033[?25h` | 显示光标  |
| `\033[2J` | 清除屏幕 |
| `\033[K` | 清除光标后的本行所有字符 |
| `\033[0I` | 恢复正常字体 |
| `\033[1I` | 宋体 |
| `\033[2I` | 黑体 |
| `\033[3I` | 楷体 |

:::

::: details 样式控制

| 字符 | 意义 |
| -- | -- |
| `\033[0m` | 设为默认样式 (Normal) |
| `\033[1m` | 高亮度显示 (Bright) |
| `\033[4m` | 加下划线 (Underline) |
| `\033[5m` | 闪烁显示 (Flash) |
| `\033[7m` | 反相显示 (Inverse) |
| `\033[8m` | 不可见 (Invisable) |

:::

::: details 颜色控制

| 文字 | 背景 | 颜色 |
| -------- | -------- | ------ |
| `\033[30m` | `\033[40m` | 黑色 |
| `\033[31m` | `\033[41m` | 红色 |
| `\033[32m` | `\033[42m` | 绿色 |
| `\033[33m` | `\033[43m` | 黄色 |
| `\033[34m` | `\033[44m` | 蓝色 |
| `\033[35m` | `\033[45m` | 紫红色 |
| `\033[36m` | `\033[46m` | 青蓝色 |
| `\033[37m` | `\033[47m` | 白色 |

:::

::: tip 组合使用

使用颜色和高亮组合，可使文字高亮显示，如

`\033[32;1m亮绿色`

:::

Github:  [AkashiNeko/CSI](https://github.com/AkashiNeko/CSI)
