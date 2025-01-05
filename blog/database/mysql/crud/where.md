---
title: 指定查询条件
date: 2024-01-12
isOriginal: true
icon: section
category:
  - MySQL
tag:
  - SQL
excerpt: 使用 WHERE 指定查询条件
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
