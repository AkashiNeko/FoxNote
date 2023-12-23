---
title: 列属性和约束
date: 2023-12-23
isOriginal: true
icon: "/icon/db_mysql_post.svg"
category:
  - 数据库
tag:
  - MySQL
  - 主键
excerpt: 列属性和约束是用于定义和限制列的特性和行为的元素，确保数据的完整性和一致性。
order: 6
---

## 1. 默认值约束

::: info 默认值约束

默认值约束（Default Value Constraint）用于在插入记录未提供值时，使用默认值填充。默认值约束有助于确保数据的完整性。

:::

### 设置默认值

关键字 `DEFAULT` 可以为列设置默认值约束。如果在插入记录时未指定该列的值，则会自动使用该默认值填充。下面的示例中，给 `age` 列赋予默认值 `18`。

~~~sql:no-line-numbers
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

### 查看默认值

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

### 设置非空约束

关键字 `NOT NULL` 可以为列设置非空约束，防止在插入或更新数据时将 `NULL` 值赋给该列。下面的示例中，给 `name` 列加上非空约束，防止它接受一个 `NULL` 值。

~~~sql:no-line-numbers
CREATE TABLE student2 (
    name varchar(64) NOT NULL,
    age int DEFAULT 18
);
INSERT INTO student2 (name,age) VALUES ('Steve', 15);
INSERT INTO student2 (name) VALUES ('Alex');
INSERT INTO student2 (age) VALUES (20);
-- 错误: ERROR 1364 (HY000): Field 'name' doesn't have a default value
INSERT INTO student2 (name,age) VALUES (NULL,20);
-- 错误: ERROR 1048 (23000): Column 'name' cannot be null
~~~

在插入记录时，如果省略被 `NOT NULL` 约束的列，或试图插入空数据，都是无法正常插入的。

### 查看非空约束

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

~~~sql:no-line-numbers
CREATE TABLE student3 (
    name varchar(64) UNIQUE KEY,
    age int DEFAULT 18
);
INSERT INTO student3 (name) VALUES ('akashi');
INSERT INTO student3 (name) VALUES ('akashi');
~~~

~~~text:no-line-numbers
mysql> INSERT INTO student3 (name) VALUES ('akashi');
Query OK, 1 row affected (0.01 sec)

mysql> INSERT INTO student3 (name) VALUES ('akashi');
ERROR 1062 (23000): Duplicate entry 'akashi' for key 'student3.name'
~~~

可以发现在唯一键的约束下，`name` 列无法插入一个已经存在的值。

### 唯一键的空值

此外，唯一键约束允许空值 `NULL`，空值之间不会互相排斥，允许同时存在多个空值。

~~~sql:no-line-numbers
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

### 查看唯一键

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

## 4. 主键约束

### 单一主键

::: info 主键

主键约束（Primary Key Constraint）用于唯一标识数据表中的每一条记录（每一行）。主键约束要求在指定的列或列组合上具有唯一的值，并且不允许为空值 `NULL`。

:::

主键约束结合了唯一键约束和非空约束的特性，用关键字 `PRIMARY KEY` 设置。

~~~sql:no-line-numbers
CREATE TABLE student4 (
    name varchar(64) PRIMARY KEY,
    age int DEFAULT 18
);
INSERT INTO student4 VALUES ('张三',18),('李四',19),('王五',20);
~~~

如果一个列被设为主键，那么通过这个列可以唯一指定一条记录，而且可以保证该记录不为空。

~~~text:no-line-numbers
mysql> SELECT * FROM student4 WHERE name='张三';
+------+------+
| name | age  |
+------+------+
| 张三 |   18 |
+------+------+

mysql> SELECT * FROM student4 WHERE name='李四';
+------+------+
| name | age  |
+------+------+
| 李四 |   19 |
+------+------+
~~~

### 添加和删除主键

对于一个已经存在的表，可以用下面的方式删除和添加主键。

删除表 `student4` 的主键。

~~~sql:no-line-numbers
ALTER TABLE student4 DROP PRIMARY KEY;
~~~

为表 `student4` 添加主键为 `name` 列。

~~~sql:no-line-numbers
ALTER TABLE student4 ADD PRIMARY KEY (name);
~~~

### 复合主键

`MySQL` 不允许同时定义多个主键，比如：

~~~sql:no-line-numbers
ALTER TABLE student4 ADD PRIMARY KEY (age);
-- ERROR 1068 (42000): Multiple primary key defined

CREATE TABLE student (
    name varchar(64) PRIMARY KEY,
    age int DEFAULT 18 PRIMARY KEY
);
-- ERROR 1068 (42000): Multiple primary key defined
~~~

然而，`MySQL` 提供了复合主键（Composite Primary Key）的概念。下面的表 `sc` 中，单独使用 `sname` 或 `cname` 作为主键都无法唯一标识一条记录，而必须用二者的组合。使用 `PRIMARY KEY (...)` 可以将多个列设为复合主键。

~~~sql {5}
CREATE TABLE sc (
    sname varchar(64) COMMENT '学生姓名',
    cname varchar(64) COMMENT '课程名称',
    score tinyint COMMENT '成绩得分',
    PRIMARY KEY (sname, cname)
);
INSERT INTO sc VALUES
('张三','语文',85),('张三','数学',97),('张三','英语',89),
('李四','语文',93),('李四','数学',86),('李四','英语',95);
~~~

~~~text:no-line-numbers
mysql> SELECT * FROM sc;
+-------+-------+-------+
| sname | cname | score |
+-------+-------+-------+
| 张三  | 数学  |    97 |
| 张三  | 英语  |    89 |
| 张三  | 语文  |    85 |
| 李四  | 数学  |    86 |
| 李四  | 英语  |    95 |
| 李四  | 语文  |    93 |
+-------+-------+-------+
~~~

### 查看主键

使用 `DESC` 关键字查看表结构。

~~~text:no-line-numbers
mysql> DESC student4;
+-------+-------------+------+-----+---------+-------+
| Field | Type        | Null | Key | Default | Extra |
+-------+-------------+------+-----+---------+-------+
| name  | varchar(64) | NO   | PRI | NULL    |       |
| age   | int         | YES  |     | 18      |       |
+-------+-------------+------+-----+---------+-------+

mysql> DESC sc;
+-------+-------------+------+-----+---------+-------+
| Field | Type        | Null | Key | Default | Extra |
+-------+-------------+------+-----+---------+-------+
| sname | varchar(64) | NO   | PRI | NULL    |       |
| cname | varchar(64) | NO   | PRI | NULL    |       |
| score | tinyint     | YES  |     | NULL    |       |
+-------+-------------+------+-----+---------+-------+
~~~

在 `Key` 列中，设有唯一键的列会显示为 `PRI`，同时 `Null` 列为 `NO`，表示主键是自带非空约束的。如果有多个列被设为复合主键，则会显示多个 `PRI`。

## 5. 外键

TODO
