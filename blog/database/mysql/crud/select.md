---
title: 查询记录
date: 2023-12-22
isOriginal: true
icon: section
category:
  - MySQL
tag:
  - SQL
excerpt: 从数据表中查询记录
order: 2
---

关键字 `SELECT` 可以执行语句或执行函数，比如：

数学运算。

~~~sql:no-line-numbers
SELECT 1 + 2 + 3;
~~~

    +-----------+
    | 1 + 2 + 3 |
    +-----------+
    |         6 |
    +-----------+

设置别名，使用 `AS` 关键字，可以省略不写。

~~~sql:no-line-numbers
SELECT 114 * 514 AS result;
~~~

    +--------+
    | result |
    +--------+
    |  58596 |
    +--------+

执行函数：

~~~sql:no-line-numbers
SELECT UPPER('hello') AS uppercase;
~~~

    +-----------+
    | uppercase |
    +-----------+
    | HELLO     |
    +-----------+

关键字 `SELECT` 可以用于选择列名，`FROM` 关键字后接要查询的表。

~~~sql:no-line-numbers
SELECT field1, field2, ...
FROM table_name
~~~

使用下面的数据进行测试。

| name | age | gender |
| :-: | :-: | :-: |
| David | 18 | M |
| Chloe | 19 | F |
| Alice | 20 | M |
| Faith | 21 | F |
| Brian | 20 | M |
| Emma | 20 | F |

~~~sql
CREATE TABLE student (
    name varchar(64) COMMENT '姓名',
    age smallint COMMENT '年龄',
    gender char(4) COMMENT '性别'
);
INSERT INTO student (name, age, gender) VALUES
('David', 18, 'M'),('Chloe', 19, 'F'),('Alice', 20, 'M'),
('Faith', 21, 'F'),('Brian', 20, 'M'),('Emma', 20, 'F');
~~~

全列查询，`*` 表示选中所有列。

~~~sql:no-line-numbers
SELECT * FROM student;
~~~

    +-------+------+--------+
    | name  | age  | gender |
    +-------+------+--------+
    | David |   18 | M      |
    | Chloe |   19 | F      |
    | Alice |   20 | M      |
    | Faith |   21 | F      |
    | Brian |   20 | M      |
    | Emma  |   20 | F      |
    +-------+------+--------+

查询姓名和年龄。

~~~sql:no-line-numbers
SELECT name, age FROM student;
~~~

    +-------+------+
    | name  | age  |
    +-------+------+
    | David |   18 |
    | Chloe |   19 |
    | Alice |   20 |
    | Faith |   21 |
    | Brian |   20 |
    | Emma  |   20 |
    +-------+------+

查询平均年龄，使用内置函数 `AVG` 取平均值。

~~~sql:no-line-numbers
SELECT AVG(age) average FROM student;
~~~

    +---------+
    | average |
    +---------+
    | 19.6667 |
    +---------+

查询结果去重，使用 `DISTINCT` 关键字。

~~~sql:no-line-numbers
SELECT DISTINCT age FROM student;
~~~

    +------+
    | age  |
    +------+
    |   18 |
    |   19 |
    |   20 |
    |   21 |
    +------+

查询姓名和年龄，并将所有姓名大写，将年龄显示为新增一岁。

~~~sql:no-line-numbers
SELECT UPPER(name), age+1 FROM student;
~~~

    +-------------+-------+
    | UPPER(name) | age+1 |
    +-------------+-------+
    | DAVID       |    19 |
    | CHLOE       |    20 |
    | ALICE       |    21 |
    | FAITH       |    22 |
    | BRIAN       |    21 |
    | EMMA        |    21 |
    +-------------+-------+
