---
title: 数据类型（二）
date: 2023-12-23
isOriginal: true
icon: "/icon/db_mysql_post.svg"
category:
  - 数据库
tag:
  - MySQL
  - 数据类型
excerpt: 数据类型的字符串类型、日期时间类型、枚举和集合类型。
order: 10
---

## 1. 字符串类型

### CHAR 和 VARCHAR

`CHAR` 和 `VARCHAR` 是常见的用于存储字符数据的数据类型，它们分别是定长和边长的：

::: info CHAR 和 VARCHAR

- CHAR类型在存储时，由于每个列都占用固定长度的存储空间，对于存储较短的数据可能会浪费一些存储空间。
- VARCHAR类型在存储时，它的存储空间根据实际存储的字符数动态分配，因此对于存储较短的数据，它可能更加节省存储空间。

:::

在使用类型时，需要写成 `CHAR(n)` 或 `VARCHAR(n)` 的形式，其中 `n` 表示可存储的最多**字符**数。

~~~sql
CREATE TABLE str ( s char(3) );
INSERT INTO str VALUES ('abc'),('123'),('SQL'),('汉字'),('数据库');
-- Query OK, 5 rows affected (0.01 sec)
-- Records: 5  Duplicates: 0  Warnings: 0
~~~

请注意，这里的字符和字节不同，一个字符可能由多个字节组成。比如在 `utf8` 编码下，一个汉字字符占 $3$ 个字节，$3$ 个汉字字符需要 $9$ 个字节的空间才能存储；而在 `gbk` 编码下，一个汉字占 $2$ 个字节，存储 $3$ 个汉字字符只需要 $6$ 个字节的空间。

| 类型 | 最大长度 |
| :--: | :--: |
| `CHAR` | $255$ 字符 |
| `VARCHAR` | $65535$ 字节 |

`CHAR` 是定长的，在存储数据时，它使用的空间是固定的。而 `VARCHAR` 是可变长度的，它使用的空间取决于存储的数据长度。比如在下面的的 `strs` 表中，`s1` 无论存什么数据，都会固定占用 $10$ 个字节的空间，而 `s2` 则是存多少数据占多少空间。

~~~sql
CREATE TABLE strs (
    s1 char(10),
    s2 varchar(20)
);
~~~

::: info VARCHAR长度的存储

由于 `VARCHAR` 是可变长的，`MySQL` 在存储时需要知道数据的长度，`VARCHAR` 通常会占用 $1$ ~ $2$ 个字节来记录数据长度。由于存在记录长度的空间，所以 `VARCHAR` 最大能存储的有效数据的字节数为 $65535-2=65533$ 个。当数据长度为 $0$ ~ $255$ 时，需要额外使用 $1$ 个字节的空间记录数据长度，长度为 $256$ ~ $65533$ 时使用 $2$ 个字节的空间。

:::

在 `MySQL 8.0` 默认的 `utf8mb4` 编码下，一个字符最长可以占用 $4$ 个字节，所以该编码下的 `VARCHAR` 最长只能存储 $\lfloor \frac{65533}{4} \rfloor = 16383$ 个字符。

~~~sql:no-line-numbers
CREATE TABLE vc16383 ( s varchar(16383) );
-- Query OK, 0 rows affected (0.02 sec)

CREATE TABLE vc16384 ( s varchar(16384) );
-- ERROR 1074 (42000): Column length too big for column 's' (max = 16383); use BLOB or TEXT instead
~~~

### TEXT 和 BLOB

TODO

## 2. 日期和时间类型

### 日期和时间

表示日期的类型有 `YEAR` 和 `DATE`，分别表示**年**（`YYYY`）和**年月日**（`YYYY-MM-DD`）；表示时间的类型有 `TIME`，以**时分秒**（`HH:MM:SS`）的形式存储。除此之外，还有 `DATETIME` 类型用于存储日期和时间的混合类型（`YYYY-MM-DD hh:mm:ss`）。

| 类型 | 字节 | 范围 |
| :--: | :--: | :--: |
| `YEAR` | $1$ | `1901` ~ `2155` |
| `DATE` | $3$ | `1000-01-01` ~ `9999-12-31` |
| `TIME` | $3$ | `-838:59:59` ~ `838:59:59` |
| `DATETIME` | $8$ | `1000-01-01 00:00:00` ~ `9999-12-31 23:59:59` |

### 时间戳

`MySQL` 中的时间戳 `TIMESTAMP` 是一个整数，表示从1970年1月1日的8:00开始到该时间经过的秒数。老版本的 `MySQL` 使用 $4$ 字节的时间戳，由于 $4$ 字节整数表示的最大值为 `2147483647`，所以会引发著名的[2038问题](https://zh.wikipedia.org/wiki/2038%E5%B9%B4%E9%97%AE%E9%A2%98)。

| 类型 | 字节 | 最大值 |
| :--: | :--: | :--: |
| `TIMESTAMP` | $4$ | `2038-01-19 11:14:07` |

## 3. 集合和枚举类型

### ENUM枚举

枚举类型 `ENUM` 可以看作一个下标从 $1$ 开始的数组，尝试以下示例。

~~~sql
CREATE TABLE enum_t ( val enum('AA','BB','CC') );
INSERT INTO enum_t VALUES ('AA'),('BB'),('CC');
INSERT INTO enum_t VALUES (1),(2),(3);
~~~

可以发现，`1` 等价于第 $1$ 个元素 `AA`，`2` 等价于第 $2$ 个元素 `BB`，依此类推。

~~~text:no-line-numbers
mysql> SELECT * From enum_t;
+------+
| val  |
+------+
| AA   |
| BB   |
| CC   |
| AA   |
| BB   |
| CC   |
+------+
~~~

### SET集合

集合类型 `SET` 可以看作一个位图结构，用二进制位选择元素，比如十进制数 $5$（二进制 `101`）可以选中集合中的第 $1$ 和第 $3$ 个元素。尝试以下示例。

~~~sql
CREATE TABLE set_t ( info varchar(128), val set('AA','BB','CC','DD') );
INSERT INTO set_t VALUES ('AA','AA'),('CC','CC');
INSERT INTO set_t VALUES ('AA,BB,CC','AA,BB,CC');
INSERT INTO set_t VALUES ('0',0),('1',1),('2',2),('4',4);
INSERT INTO set_t VALUES ('3',3),('5',5);
~~~

~~~text:no-line-numbers
mysql> SELECT * FROM set_t;
+----------+----------+
| info     | val      |
+----------+----------+
| AA       | AA       |
| CC       | CC       |
| AA,BB,CC | AA,BB,CC |
| 0        |          |
| 1        | AA       |
| 2        | BB       |
| 4        | CC       |
| 3        | AA,BB    |
| 5        | AA,CC    |
+----------+----------+
~~~
