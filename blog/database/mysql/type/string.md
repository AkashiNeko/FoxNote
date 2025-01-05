---
title: 字符串类型
date: 2023-12-23
isOriginal: true
icon: section
category:
  - MySQL
tag:
  - 数据类型
excerpt: 字符串和文本类型
order: 2
---

## 定长和变长字符串

`CHAR` 和 `VARCHAR` 是常见的用于存储字符数据的数据类型，它们分别是**定长**和**可变长**的：

::: info CHAR 和 VARCHAR

- `CHAR`：每个列都占用固定长度的存储空间，对于存储较短的数据可能会浪费一些存储空间。
- `VARCHAR`：存储空间根据实际存储的字符数动态分配，因此对于存储较短的数据，它可能更加节省存储空间。

:::

在使用类型时，需要写成 `CHAR(n)` 或 `VARCHAR(n)` 的形式，其中 `n` 表示可存储的最多**字符**数。

~~~sql
CREATE TABLE str ( s char(3) );
INSERT INTO str VALUES ('abc'),('123'),('SQL'),('汉字'),('数据库');
-- Query OK, 5 rows affected (0.01 sec)
-- Records: 5  Duplicates: 0  Warnings: 0
~~~

请注意，这里的**字符与字节不同**，一个字符可能由多个字节组成。比如在 `utf8` 编码下，一个汉字字符占 $3$ 个字节，$3$ 个汉字字符需要 $9$ 个字节的空间才能存储；而在 `gbk` 编码下，一个汉字占 $2$ 个字节，存储 $3$ 个汉字字符只需要 $6$ 个字节的空间。

| 类型 | 最大长度 |
| :--: | :--: |
| `CHAR` | $255$ 字符 |
| `VARCHAR` | $65535$ 字节 |

`CHAR` 是定长的，在存储数据时，它使用的空间是固定的。而 `VARCHAR` 是可变长度的，它使用的空间取决于存储的数据长度。比如在下面的的 `strs` 表中，`s1` 列无论存什么数据，都会固定占用 $10$ 个字节的空间，而 `s2` 列则是存多少数据占多少空间。

~~~sql
CREATE TABLE strs (
    s1 char(10),
    s2 varchar(20)
);
~~~

::: info VARCHAR长度的存储

由于 `VARCHAR` 是可变长的，`MySQL` 在存储时需要知道数据的长度，`VARCHAR` 通常会占用 $1$ ~ $2$ 个字节来记录数据长度。由于存在记录长度的空间，所以 `VARCHAR` 最大能存储的有效数据的字节数为 $65535-2=65533$ 个。当数据长度为 $0$ ~ $255$ 时，需要额外使用 $1$ 个字节的空间记录数据长度，长度为 $256$ ~ $65533$ 时使用 $2$ 个字节的空间。

:::

在 `MySQL 8.0` 默认的 `utf8mb4` 编码下，一个字符最长可以占用 $4$ 个字节，所以该编码下的 `VARCHAR` 最长只能存储 $\lfloor 65533/4 \rfloor = 16383$ 个字符。

~~~sql:no-line-numbers
CREATE TABLE vc16383 ( s varchar(16383) );
-- Query OK, 0 rows affected (0.02 sec)

CREATE TABLE vc16384 ( s varchar(16384) );
-- ERROR 1074 (42000): Column length too big for column 's' (max = 16383); use BLOB or TEXT instead
~~~

## 文本和二进制类型

TODO
