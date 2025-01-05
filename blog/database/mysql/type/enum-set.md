---
title: 枚举和集合类型
date: 2023-12-23
isOriginal: true
icon: section
category:
  - MySQL
tag:
  - 数据类型
excerpt: 枚举类型和集合类型
order: 4
---

## ENUM枚举

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

## SET集合

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
