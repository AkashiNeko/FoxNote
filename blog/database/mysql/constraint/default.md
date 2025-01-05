---
title: 默认值约束
date: 2023-12-24
isOriginal: true
icon: section
category:
  - MySQL
tag:
  - 表约束
excerpt: 表的默认值约束（Default）
order: 1
---

::: info 默认值约束

默认值约束（Default Value Constraint）用于在插入记录未提供值时，使用默认值填充。默认值约束有助于确保数据的完整性。

:::

关键字 `DEFAULT` 可以为列设置默认值约束。如果在插入记录时未指定该列的值，则会自动使用该默认值填充。下面的示例中，给 `age` 列赋予默认值 `18`。

~~~sql {3}
CREATE TABLE student1 (
    name varchar(64),
    age int DEFAULT 18
);
INSERT INTO student1 (name,age) VALUES ('cat',20);
INSERT INTO student1 (name) VALUES ('fox'),('rabbit');
~~~

查询数据，可以发现插入时没有给 `age` 值的 `fox` 和 `rabbit`，自动填充了默认值 `18`。

~~~sql:no-line-numbers
SELECT * FROM student1;
~~~

    +--------+------+
    | name   | age  |
    +--------+------+
    | cat    |   20 |
    | fox    |   18 |
    | rabbit |   18 |
    +--------+------+

可以发现 `age` 列设置默认值后，在省略列的情况下，它使用了默认值 `18`。

使用 `DESC` 关键字查看表结构。

~~~sql:no-line-numbers
DESC student1;
~~~

    +-------+-------------+------+-----+---------+-------+
    | Field | Type        | Null | Key | Default | Extra |
    +-------+-------------+------+-----+---------+-------+
    | name  | varchar(64) | YES  |     | NULL    |       |
    | age   | int         | YES  |     | 18      |       |
    +-------+-------------+------+-----+---------+-------+

在 `Default` 列中，可以看到每一列的默认值，没有设置默认值的列为 `NULL`。
