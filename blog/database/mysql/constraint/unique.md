---
title: 唯一键约束
date: 2023-12-24
isOriginal: true
icon: section
category:
  - MySQL
tag:
  - 约束
excerpt: 表的唯一键约束（Unique）
order: 3
---

::: info 唯一键

唯一键约束（Unique Key Constraint）用于确保列中的值是唯一的。唯一键约束可以约束一个或**多个**列，用于防止重复值的插入或更新。

:::

关键字 `UNIQUE` 或 `UNIQUE KEY` 可以为列设置唯一键约束，让该列的值相互独立。下面的示例中，将 `name` 列设为唯一键，尝试插入两个相同的 `name`。

~~~sql: {2}
CREATE TABLE student3 (
    name varchar(64) UNIQUE KEY,
    age int DEFAULT 18
);

INSERT INTO student3 (name) VALUES ('akashi');
-- OK
INSERT INTO student3 (name) VALUES ('akashi');
-- ERROR 1062 (23000): Duplicate entry 'akashi' for key 'student3.name'
~~~

可以发现在唯一键的约束下，`name` 列无法插入一个已经存在的值。

使用 `DESC` 关键字查看表结构。

~~~sql:no-line-numbers
DESC student3;
~~~

    +-------+-------------+------+-----+---------+-------+
    | Field | Type        | Null | Key | Default | Extra |
    +-------+-------------+------+-----+---------+-------+
    | name  | varchar(64) | YES  | UNI | NULL    |       |
    | age   | int         | YES  |     | 18      |       |
    +-------+-------------+------+-----+---------+-------+

在 `Key` 列中，设有唯一键的列会显示为 `UNI`。

此外，唯一键约束允许空值 `NULL`，空值之间不会互相排斥，允许同时存在多个空值。

~~~sql
INSERT INTO student3 (age) VALUES (10);
INSERT INTO student3 (name,age) VALUES (NULL,10);
~~~

~~~sql:no-line-numbers
SELECT * FROM student3;
~~~

    +--------+------+
    | name   | age  |
    +--------+------+
    | akashi |   18 |
    | NULL   |   10 |
    | NULL   |   10 |
    +--------+------+
