---
title: 非空约束
date: 2023-12-24
isOriginal: true
icon: section
category:
  - MySQL
tag:
  - 约束
excerpt: 表的非空约束（Not Null）
order: 2
---

::: info 非空约束

非空约束（NOT NULL Constraint）用于确保数据库表中的列不接受 `NULL` 值。当为列添加非空约束后，该列在插入或更新数据时必须提供一个非空值。

:::

关键字 `NOT NULL` 可以为列设置非空约束，防止在插入或更新数据时将 `NULL` 值赋给该列。下面的示例中，给 `name` 列加上非空约束，防止它接受一个 `NULL` 值。

~~~sql {2}
CREATE TABLE student2 (
    name varchar(64) NOT NULL,
    age int DEFAULT 18
);

INSERT INTO student2 (name,age) VALUES ('Steve', 15);
-- OK
INSERT INTO student2 (name) VALUES ('Alex');
-- OK
INSERT INTO student2 (age) VALUES (20);
-- ERROR 1364 (HY000): Field 'name' doesn't have a default value
INSERT INTO student2 (name,age) VALUES (NULL,20);
-- ERROR 1048 (23000): Column 'name' cannot be null
~~~

在插入记录时，如果省略被 `NOT NULL` 约束的列，或试图插入空数据，都是无法正常插入的。

使用 `DESC` 关键字查看表结构。

~~~sql:no-line-numbers
mysql> DESC student2;
~~~

    +-------+-------------+------+-----+---------+-------+
    | Field | Type        | Null | Key | Default | Extra |
    +-------+-------------+------+-----+---------+-------+
    | name  | varchar(64) | NO   |     | NULL    |       |
    | age   | int         | YES  |     | 18      |       |
    +-------+-------------+------+-----+---------+-------+

在 `Null` 列中，可以看到设置了非空约束的列为 `NO`，表示该列不允许为空。
