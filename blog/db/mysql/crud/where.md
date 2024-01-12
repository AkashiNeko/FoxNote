---
title: 查询条件和约束
date: 2024-01-12
isOriginal: true
icon: "/icon/db_mysql_post.svg"
category:
  - MySQL
tag:
  - SQL
excerpt: 指定SELECT查询的条件
order: 3
---

在 `SELECT` 语句后，可以接一些额外的语句。

~~~sql:no-line-numbers {3-5}
SELECT field1, field2, ...
FROM table_name
[WHERE condition]
[ORDER BY field [ASC|DESC]]
[LIMIT max [OFFSET page]];
~~~

## 指定查询条件

`WHERE` 用于指定查询条件，它支持以下的运算符。（假设有 $x$、$y$、$z$ 三个整数）

下面的语句中，如果条件为真则结果为1，否则为0，可以配合 `SELECT` 语句进行测试。

| 运算符语句 | 意义 |
| :-: | :-: |
| x > y | $x$ 大于 $y$ |
| x < y | $x$ 小于 $y$ |
| x >= y | $x$ 大于等于 $y$ |
| x <= y | $x$ 小于等于 $y$ |
| x = y | $x$ 等于 $y$（`NULL = NULL` 的结果为 `NULL`） |
| x <=> y | $x$ 等于 $y$（`NULL = NULL` 的结果为 1） |
| x and y | $x$ 逻辑且 $y$ |
| x or y | $x$ 逻辑或 $y$ |
| x IS NULL | $x$ 是 `NULL` |
| x IS NOT NULL | $x$ 不是 `NULL` |
| z in (x, y, ...) | $z \in (x, y, \ldots)$ 。比如 `2 in (1,2,3)` 的结果为1 |
| z BETWEEN x AND y | $z$ 在区间 $[x,y]$ 内。比如 `3 BETWEEN 2 AND 5` 的结果为1 |
| 'abc123456' LIKE 'a_c123%' | 字符串模糊匹配，`_` 匹配单个字符，`%` 匹配任意个字符 |

对之前的 `student` 表进行查询。

查看所有男生的信息。

~~~sql:no-line-numbers
SELECT * FROM student WHERE gender='M';
~~~

    +-------+------+--------+
    | name  | age  | gender |
    +-------+------+--------+
    | David |   18 | M      |
    | Alice |   20 | M      |
    | Brian |   20 | M      |
    +-------+------+--------+

查看年龄大于 `19` 的学生的姓名和年龄。

~~~sql:no-line-numbers
SELECT name,age FROM student WHERE age>19;
~~~

    +-------+------+
    | name  | age  |
    +-------+------+
    | Alice |   20 |
    | Faith |   21 |
    | Brian |   20 |
    | Emma  |   20 |
    +-------+------+

## 查询结果排序

`ORDER` 用于对结果进行排序，其后可以接 `ASC` 进行升序排序，接 `DESC` 进行降序排序，默认为升序。

假设要排序的列名为 `id`，对该列进行升序排序。

~~~sql:no-line-numbers
SELECT ... ORDER BY id
SELECT ... ORDER BY id ASC
~~~

降序排序。

~~~sql:no-line-numbers
SELECT ... ORDER BY id DESC
~~~

对之前的 `student` 表进行查询。

查询所有学生的信息，并按年龄排序。

~~~sql:no-line-numbers
SELECT * FROM student ORDER BY age;
~~~

    +-------+------+--------+
    | name  | age  | gender |
    +-------+------+--------+
    | David |   18 | M      |
    | Chloe |   19 | F      |
    | Alice |   20 | M      |
    | Brian |   20 | M      |
    | Emma  |   20 | F      |
    | Faith |   21 | F      |
    +-------+------+--------+

查询所有学生的信息，先按性别升序排序，同时按性别降序排序。

~~~sql:no-line-numbers
SELECT * FROM student ORDER BY gender ASC, age DESC;
~~~

    +-------+------+--------+
    | name  | age  | gender |
    +-------+------+--------+
    | Faith |   21 | F      |
    | Emma  |   20 | F      |
    | Chloe |   19 | F      |
    | Alice |   20 | M      |
    | Brian |   20 | M      |
    | David |   18 | M      |
    +-------+------+--------+

## 查询结果切片

关键字 `LIMIT` 可以单独使用，也和 `OFFSET` 配合使用，对查询结果进行切片。`LIMIT` 设置最多显示的记录条数，`OFFSET` 指定开始位置。

构建下面的表和数据进行测试。

~~~sql:no-line-numbers
CREATE TABLE limit_test ( n int );
INSERT INTO limit_test VALUES (0),(1),(2),(3),(4),(5),(6),(7),(8),(9);
~~~

查询所有记录，但最多显示3条。

~~~sql:no-line-numbers
SELECT * FROM limit_test LIMIT 3;
~~~

    +------+
    | n    |
    +------+
    |    0 |
    |    1 |
    |    2 |
    +------+

查询所有记录，最多显示3条，且从第5条开始显示。

~~~sql:no-line-numbers
SELECT * FROM limit_test LIMIT 5, 3;
SELECT * FROM limit_test LIMIT 3 OFFSET 5;
~~~

    +------+
    | n    |
    +------+
    |    5 |
    |    6 |
    |    7 |
    +------+
