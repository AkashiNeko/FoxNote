---
title: 数据类型
date: 2023-12-21
isOriginal: true
icon: "/icon/db_mysql_post.svg"
category:
  - 数据库
tag:
  - MySQL
  - 数据类型
excerpt: MySQL数据表中，每一列都有一种数据类型，决定了该列能够存储的数据种类和范围。
order: 4
---

## 1. 数据类型

类似于结构体或对象，在创建MySQL表时，字段名后需要指名列的数据类型。MySQL的数据类型有很多种，大致可以分为以下五大类：

::: info 数值类型

数值类型用于存储各种数值数据，常见的数值类型包括：

- **整数**：`INT`、`TINYINT`、`BIGINT` 等，用于存储整数值。
- **浮点数**：`FLOAT`、`DOUBLE`、`DECIMAL` 等，用于存储浮点数值。
- **定点数**：`DECIMAL`，用于存储精确的小数值。

:::

::: info 字符串类型

字符串类型用于存储文本数据和二进制数据，常见的字符串类型包括：

- **文本字符串**：`CHAR`、`VARCHAR`、`TEXT` 等，用于存储文本数据。
- **二进制串**：`BINARY`、`VARBINARY`、`BLOB` 等，用于存储二进制数据。

:::

::: info 日期和时间类型

日期和时间类型用于存储日期、时间和时间戳数据，常见的日期与时间类型包括：

- **日期**：`DATE`，用于存储日期值（年、月、日）。
- **时间**：`TIME`，用于存储时间值（小时、分钟、秒）。
- **时间戳**：`TIMESTAMP`，用于存储时间戳值，通常与日期和时间相关联。

:::

::: info 枚举与集合类型

枚举与集合类型允许在预定义的值列表中选择一个或多个值。

- **枚举**：`ENUM` 可以存储从预定义值列表中选择的单个值。
- **集合**：`SET` 可以存储从预定义值列表中选择的多个值。

:::

::: info 空间数据类型

用于存储和操作空间数据（地理和几何对象）的一组数据类型，这些类型允许存储和查询与空间位置相关的数据。

- **集合**：`GEOMETRY` 可以存储任意类型的几何对象，如点、线、多边形等。
- **坐标**：`POINT` 用于存储二维空间中的点坐标。

:::

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

::: info INT(n)

`MySQL` 在定义列类型时，整数类型之后可以加上括号 `()` 和非负整数，比如 `INT(10)`。

值得注意的是，加上 `()` 之后，并不会对这些类型的底层存储有任何影响，比如 `INT`、`INT(1)` 和 `INT(10)` 类型，它们在底层仍是四字节的空间，表示的范围也相同。它只会影响某些客户端的显示效果，比如下面例子。

~~~text:no-line-numbers
mysql> CREATE TABLE num (
    ->  n int,
    ->  n10 int(10) ZEROFILL
    -> );
Query OK, 0 rows affected, 2 warnings (0.02 sec)

mysql> INSERT INTO num VALUES (123,123);
Query OK, 1 row affected (0.00 sec)

mysql> SELECT * FROM num;
+------+------------+
| n    | n10        |
+------+------------+
|  123 | 0000000123 |
+------+------------+
1 row in set (0.00 sec)
~~~

:::

### 浮点数类型

与编程语言相同，`MySQL` 提供了四字节的单精度浮点数类型 `FLOAT` 和八字节的双精度浮点数类型 `DOUBLE`。

| 类型 | 字节 |
| :--: | :--: |
| `FLOAT` | $4$ |
| `DOUBLE` | $8$ |

在使用 `FLOAT` 或 `DOUBLE` 类型时，除了直接使用类型名外，还可以指定存储的位数。

`FLOAT(m,n)` 类型用于指定浮点数最多可存储的位数和小数位。其中 `m` 为最多可存储的数字位数，`n` 为最多可存储的小数部分位数。

比如类型 `FLOAT(5,3)`，它表示最多存储 $5$ 个数字，其中小数部分最多为 $3$ 位，所以整数部分最多为 $5-3=2$ 位数。即可存储的小数范围为 $0$ ~ $99.999$，精度最小为 $0.001$。

~~~text:no-line-numbers
mysql> CREATE TABLE num (f float(5,3));
Query OK, 0 rows affected, 1 warning (0.02 sec)

mysql> INSERT INTO num VALUES (12.345);
Query OK, 1 row affected (0.01 sec)

mysql> INSERT INTO num VALUES (0.001);
Query OK, 1 row affected (0.01 sec)

mysql> INSERT INTO num VALUES (99.999);
Query OK, 1 row affected (0.01 sec)

mysql> INSERT INTO num VALUES (100.000);
ERROR 1264 (22003): Out of range value for column 'f' at row 1
mysql> INSERT INTO num VALUES (12.3456789);
Query OK, 1 row affected (0.01 sec)

mysql> SELECT * FROM num;
+--------+
| f      |
+--------+
| 12.345 |
|  0.001 |
| 99.999 |
| 12.346 |
+--------+
4 rows in set (0.00 sec)
~~~

如果输入了更高精度的小数，`MySQL` 会自动对数据进行四舍五入。比如上面的 `12.3456789` 被储存为 `12.346`。

### 定点数类型

同编程语言一样，`FLOAT` 和 `DOUBLE` 也是将小数位转为二进制存储，所以对于高精度的小数，也会发生精度丢失的问题。

为了解决浮点数精度丢失的问题，`MySQL` 提供了更精确的定点数类型 `DECIMAL`，可以看下面的例子进行对比。

~~~text:no-line-numbers
mysql> CREATE TABLE float_and_decimal (
    ->  float_val float(10,8),
    ->  decimal_val decimal(10,8)
    -> );
Query OK, 0 rows affected, 1 warning (0.02 sec)

mysql> INSERT INTO float_and_decimal VALUES (10.23456789,10.23456789);
Query OK, 1 row affected (0.01 sec)

mysql> SELECT * FROM float_and_decimal;
+-------------+-------------+
| float_val   | decimal_val |
+-------------+-------------+
| 10.23456764 | 10.23456789 |
+-------------+-------------+
1 row in set (0.00 sec)
~~~

可以看到，对于高精度的小数，`FLOAT` 在存储时发生了精度丢失，而 `DECIMAL` 没有问题。

与 `FLOAT` 类型不同，`DECIMAL` 类型使用一种固定的精度存储和表示小数值，这意味着它不会发生舍入误差。它以字符串形式存储小数值，并且每个数字都以固定的精度进行存储，而不依赖于二进制表示。

由于 `DECIMAL` 存储和表示的精度是固定的，它适合于需要精确计算和存储货币金额、精确度要求高的金融数据或进行精确计算的应用程序。然而 `DECIMAL` 类型也有一些缺点：

::: info DECIMAL的缺点

- **存储占用更大**：由于每个数字都以字符串形式，并且具有固定的精度，因此它在存储空间上比较消耗资源。与 `FLOAT` 或 `DOUBLE` 类型相比，它需要更多的存储空间来表示相同的值。

- **计算效率更低**：由于 `DECIMAL` 类型的计算是基于字符串的，而不是二进制，因此在进行算术运算时，它的计算效率可能会降低。对于大规模的计算或复杂的查询，使用 `DECIMAL` 类型可能会导致性能下降。

:::

## 3. 字符串类型

TODO

## 4. 日期和时间类型

TODO
