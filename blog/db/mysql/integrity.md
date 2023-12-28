---
title: 完整性约束
date: 2023-12-24
isOriginal: true
icon: "/icon/db_mysql_post.svg"
category:
  - 数据库
tag:
  - MySQL
excerpt: 表约束是关系型数据库中对表的列或列组合施加的限制和规则。
order: 11
---

## 1. 默认值约束

::: info 默认值约束

默认值约束（Default Value Constraint）用于在插入记录未提供值时，使用默认值填充。默认值约束有助于确保数据的完整性。

:::

### 设置默认值

关键字 `DEFAULT` 可以为列设置默认值约束。如果在插入记录时未指定该列的值，则会自动使用该默认值填充。下面的示例中，给 `age` 列赋予默认值 `18`。

~~~sql {3}
CREATE TABLE student1 (
    name varchar(64),
    age int DEFAULT 18
);
INSERT INTO student1 (name,age) VALUES ('张三',20);
INSERT INTO student1 (name) VALUES ('李四'),('王五');
~~~

~~~text:no-line-numbers
mysql> SELECT * FROM student1;
+------+------+
| name | age  |
+------+------+
| 张三 |   20 |
| 李四 |   18 |
| 王五 |   18 |
+------+------+
~~~

可以发现 `age` 列设置默认值后，在省略列的情况下，它使用了默认值 `18`。

使用 `DESC` 关键字查看表结构。

~~~text:no-line-numbers
mysql> DESC student1;
+-------+-------------+------+-----+---------+-------+
| Field | Type        | Null | Key | Default | Extra |
+-------+-------------+------+-----+---------+-------+
| name  | varchar(64) | YES  |     | NULL    |       |
| age   | int         | YES  |     | 18      |       |
+-------+-------------+------+-----+---------+-------+
~~~

在 `Default` 列中，可以看到每一列的默认值，没有设置默认值的列为 `NULL`。

## 2. 非空约束

::: info 非空约束

非空约束（NOT NULL Constraint）用于确保数据库表中的列不接受 `NULL` 值。当为列添加非空约束后，该列在插入或更新数据时必须提供一个非空值。

:::

### 添加非空约束

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

~~~text:no-line-numbers
mysql> DESC student2;
+-------+-------------+------+-----+---------+-------+
| Field | Type        | Null | Key | Default | Extra |
+-------+-------------+------+-----+---------+-------+
| name  | varchar(64) | NO   |     | NULL    |       |
| age   | int         | YES  |     | 18      |       |
+-------+-------------+------+-----+---------+-------+
~~~

在 `Null` 列中，可以看到设置了非空约束的列为 `NO`，表示该列不允许为空。

## 3. 唯一键约束

::: info 唯一键

唯一键约束（Unique Key Constraint）用于确保列中的值是唯一的。唯一键约束可以约束一个或**多个**列，用于防止重复值的插入或更新。

:::

### 设置唯一键

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

~~~text:no-line-numbers
mysql> DESC student3;
+-------+-------------+------+-----+---------+-------+
| Field | Type        | Null | Key | Default | Extra |
+-------+-------------+------+-----+---------+-------+
| name  | varchar(64) | YES  | UNI | NULL    |       |
| age   | int         | YES  |     | 18      |       |
+-------+-------------+------+-----+---------+-------+
~~~

在 `Key` 列中，设有唯一键的列会显示为 `UNI`。

### 唯一键的空值

此外，唯一键约束允许空值 `NULL`，空值之间不会互相排斥，允许同时存在多个空值。

~~~sql
INSERT INTO student3 (age) VALUES (10);
INSERT INTO student3 (name,age) VALUES (NULL,10);
~~~

~~~text:no-line-numbers
mysql> SELECT * FROM student3;
+--------+------+
| name   | age  |
+--------+------+
| akashi |   18 |
| NULL   |   10 |
| NULL   |   10 |
+--------+------+
~~~
