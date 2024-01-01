---
title: MySQL数据类型
date: 2023-12-23
isOriginal: true
icon: "/icon/db_mysql_post.svg"
category:
  - MySQL
tag:
  - 数据类型
excerpt: 在MySQL的数据表中，数据类型决定了每一列能够存储的数据种类和范围。
order: 5
---

## 1. 数据类型

类似于结构体或对象，在创建MySQL表时，字段名后需要指名列的数据类型。MySQL的数据类型有很多种，大致可以分为以下五大类：**数值类型**、**字符串类型**、**日期和时间类型**、**枚举与集合类型**和**空间数据类型**。

## 2. 数值类型

### 整数类型

MySQL提供了5种整数类型，它们分别占用1~8字节。同编程语言类似，它们也有无符号类型，需要用 `UNSIGNED` 关键字修饰。

| 类型 | 字节 | 范围（有符号） | 范围（无符号） |
| :--: | :--: | :--: | :--: |
| `TINYINT` | $1$ | $[-2^{7}, 2^{7}-1]$ | $[0, 2^{8}-1]$ |
| `SMALLINT` | $2$ | $[-2^{15}, 2^{15}-1]$ | $[0, 2^{16}-1]$ |
| `MEDIUMINT` | $3$ | $[-2^{23}, 2^{23}-1]$ | $[0, 2^{24}-1]$ |
| `INT` | $4$ | $[-2^{31}, 2^{31}-1]$ | $[0, 2^{32}-1]$ |
| `BIGINT` | $8$ | $[-2^{63}, 2^{63}-1]$ | $[0, 2^{64}-1]$ |

`TINYINT` 类似于编程语言的 `char`，占一个字节，表示范围为 $-127$ 到 $128$；`SMALLINT` 占两个字节，类似于 `short`，`INT` 和普通的 `int` 相同，都是四个字节；`BIGINT` 类似于 `long long`，是一个八字节的长整数类型。

::: tip 范围限制

`MySQL` 在数据类型上有严格的范围限制，不同于编程语言的截断操作，`MySQL` 不允许超过范围的数据插入到表中。

:::

::: info ZEROFILL

`MySQL` 在设置列为整数类型时，类型之后可以加上 `(n)`，比如 `INT(10)`。

值得注意的是，加上 `()` 之后，并不会对这些类型的底层存储有任何影响，比如 `INT`、`INT(1)` 和 `INT(10)` 类型，它们在底层仍是四字节的空间，表示的范围也相同。它只会影响某些客户端的显示效果，比如下面例子。

~~~sql {3}
CREATE TABLE num (
    n int,
    n10 int(10) ZEROFILL
);
INSERT INTO num VALUES (123,123);
~~~

设置 `ZEROFILL` 后的显示效果。

~~~sql:no-line-numbers
SELECT * FROM num;
~~~

    +------+------------+
    | n    | n10        |
    +------+------------+
    |  123 | 0000000123 |
    +------+------------+

:::

### 布尔类型

`MySQL` 没有提供专门的布尔类型，但是可以使用 `TINYINT(1)` 当作布尔类型。`MySQL` 专门提供了关键字 `BOOL` 和 `BOOLEAN` 作为 `TINYINT(1)` 的别名。

~~~sql:no-line-numbers
CREATE TABLE bool_test ( val bool );
DESC bool_test;
~~~

    +-------+------------+------+-----+---------+-------+
    | Field | Type       | Null | Key | Default | Extra |
    +-------+------------+------+-----+---------+-------+
    | val   | tinyint(1) | YES  |     | NULL    |       |
    +-------+------------+------+-----+---------+-------+

可以发现，`BOOL` 类型的本质其实是 `TINYINT(1)`。

### 浮点数类型

与编程语言相同，`MySQL` 提供了四字节的单精度浮点数类型 `FLOAT` 和八字节的双精度浮点数类型 `DOUBLE`。与C/C++的 `float` 和 `double` 一样，遵循[IEEE 754](https://zh.wikipedia.org/wiki/IEEE_754)标准。

| 类型 | 字节 | 范围 |
| :--: | :--: | :--: |
| `FLOAT` | $4$ | $7$ 位十进制有效数字 |
| `DOUBLE` | $8$ | $15$ 位十进制有效数字 |

在使用 `FLOAT` 或 `DOUBLE` 类型时，除了直接使用类型名外，还可以指定存储的位数。

`FLOAT(m,n)` 类型用于指定浮点数最多可存储的位数和小数位。其中 `m` 为最多可存储的数字位数，`n` 为最多可存储的小数部分位数。

比如类型 `FLOAT(5,3)`，它表示最多存储 $5$ 个数位（十进制），其中小数部分最多为 $3$ 位，所以整数部分最多为 $5-3=2$ 位。即可存储的小数范围为 $0$ ~ $99.999$，精度最小为 $0.001$。

~~~sql:no-line-numbers {5-6}
CREATE TABLE num ( val float(5,3) );
INSERT INTO num VALUES (12.345);
INSERT INTO num VALUES (0.001);
INSERT INTO num VALUES (99.999);
INSERT INTO num VALUES (100.000);
-- ERROR 1264 (22003): Out of range value for column 'val' at row 1
INSERT INTO num VALUES (12.3456789);
~~~

~~~sql:no-line-numbers
SELECT * FROM num;
~~~

    +--------+
    | val    |
    +--------+
    | 12.345 |
    |  0.001 |
    | 99.999 |
    | 12.346 |
    +--------+

如果输入了更高精度的小数，`MySQL` 会自动对数据进行四舍五入。比如上面的 `12.3456789` 被储存为 `12.346`。

### 定点数类型

同编程语言一样，`FLOAT` 和 `DOUBLE` 也是将小数位转为二进制存储，所以对于高精度的小数，也会发生精度丢失的问题。

为了解决浮点数精度丢失的问题，`MySQL` 提供了更精确的定点数类型 `DECIMAL`，我们可以进行如下对比。

~~~sql {5}
CREATE TABLE float_and_decimal (
    float_val float(10,8),
    decimal_val decimal(10,8)
);
INSERT INTO float_and_decimal VALUES (10.23456789,10.23456789);
SELECT * FROM float_and_decimal;
~~~

    +-------------+-------------+
    | float_val   | decimal_val |
    +-------------+-------------+
    | 10.23456764 | 10.23456789 |
    +-------------+-------------+

可以看到，对于高精度的小数，`FLOAT` 在存储时发生了精度丢失，而 `DECIMAL` 没有问题。

与 `FLOAT` 类型不同，`DECIMAL` 类型使用一种固定的精度存储和表示小数值，这意味着它不会发生舍入误差。它以字符串形式存储小数值，并且每个数字都以固定的精度进行存储，而不依赖于二进制表示。

由于 `DECIMAL` 存储和表示的精度是固定的，它适合于需要精确计算和存储货币金额、精确度要求高的金融数据或进行精确计算的应用程序。然而 `DECIMAL` 类型也有一些缺点：

::: warning DECIMAL的缺点

- **存储占用更大**：由于每个数字都以字符串形式，并且具有固定的精度，因此它在存储空间上比较消耗资源。与 `FLOAT` 或 `DOUBLE` 类型相比，它需要更多的存储空间来表示相同的值。

- **计算效率更低**：由于 `DECIMAL` 类型的计算是基于字符串的，而不是二进制，因此在进行算术运算时，它的计算效率可能会降低。对于大规模的计算或复杂的查询，使用 `DECIMAL` 类型可能会导致性能下降。

:::

## 3. 字符串类型

### 定长和变长字符串

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

### 文本和二进制类型

TODO

## 4. 日期和时间类型

### 日期和时间

表示日期的类型有 `YEAR` 和 `DATE`，分别表示**年**（`YYYY`）和**年月日**（`YYYY-MM-DD`）；表示时间的类型有 `TIME`，以**时分秒**（`HH:MM:SS`）的形式存储。除此之外，还有 `DATETIME` 类型用于存储日期和时间的混合类型（`YYYY-MM-DD hh:mm:ss`）。

| 类型 | 字节 | 范围 |
| :--: | :--: | :--: |
| `YEAR` | $1$ | `1901` ~ `2155` |
| `DATE` | $3$ | `1000-01-01` ~ `9999-12-31` |
| `TIME` | $3$ | `-838:59:59` ~ `838:59:59` |
| `DATETIME` | $8$ | `1000-01-01 00:00:00` ~ `9999-12-31 23:59:59` |

### 时间戳

`MySQL` 中的时间戳 `TIMESTAMP` 是一个整数，表示从1970年1月1日的8:00:00开始到该时间，所经过的秒数。老版本的 `MySQL` 使用4字节的时间戳，由于4字节有符号整数能表示的最大值为 `2147483647`，所以会引发著名的[2038问题](https://zh.wikipedia.org/wiki/2038%E5%B9%B4%E9%97%AE%E9%A2%98)。

| 类型 | 字节 | 最大值 |
| :--: | :--: | :--: |
| `TIMESTAMP` | $4$ | `2038-01-19 11:14:07` |

## 5. 集合和枚举类型

### ENUM枚举

枚举类型 `ENUM` 可以看作一个下标从 $1$ 开始的数组，尝试以下示例。

~~~sql
CREATE TABLE enum_t ( info varchar(128), val enum('AA','BB','CC') );
INSERT INTO enum_t VALUES ('AA','AA'),('BB','BB'),('CC','CC');
INSERT INTO enum_t VALUES ('1',1),('2',2),('3',3);
~~~

可以发现，`1` 等价于第 $1$ 个元素 `AA`，`2` 等价于第 $2$ 个元素 `BB`，依此类推。

~~~sql:no-line-numbers
SELECT * From enum_t;
~~~

    +------+------+
    | info | val  |
    +------+------+
    | AA   | AA   |
    | BB   | BB   |
    | CC   | CC   |
    | 1    | AA   |
    | 2    | BB   |
    | 3    | CC   |
    +------+------+

### SET集合

集合类型 `SET` 可以看作一个位图结构，用二进制位选择元素，比如十进制数 $5$（二进制 `101`）可以选中集合中的第 $1$ 和第 $3$ 个元素。尝试以下示例。

~~~sql
CREATE TABLE set_t ( info varchar(128), val set('AA','BB','CC','DD') );
INSERT INTO set_t VALUES ('AA','AA'),('CC','CC');
INSERT INTO set_t VALUES ('AA,BB,CC','AA,BB,CC');
INSERT INTO set_t VALUES ('0',0),('1',1),('2',2),('4',4);
INSERT INTO set_t VALUES ('3',3),('5',5);
~~~

查看数据。

~~~sql:no-line-numbers
SELECT * FROM set_t;
~~~

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
