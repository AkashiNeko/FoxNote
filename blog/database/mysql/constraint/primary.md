---
title: 主键约束
date: 2023-12-24
isOriginal: true
icon: section
category:
  - MySQL
tag:
  - 约束
excerpt: 主键约束（Primary Key），单一主键和复合主键
order: 4
---

::: info 主键

主键约束（Primary Key Constraint）用于唯一标识数据表中的每一条记录（每一行）。主键约束要求在指定的列或列组合上具有唯一的值，并且不允许为空值 `NULL`。

:::

## 单一主键

主键约束结合了唯一键约束和非空约束的特性，用关键字 `PRIMARY KEY` 设置。

~~~sql {2}
CREATE TABLE student4 (
    name varchar(64) PRIMARY KEY,
    age int DEFAULT 18
);

INSERT INTO student4 VALUES ('cat',18),('fox',19),('rabbit',20);
~~~

如果一个列被设为主键，那么通过这个列可以唯一指定一条记录，而且可以保证该记录不为空。

~~~sql:no-line-numbers
SELECT * FROM student4 WHERE name='cat';
~~~

    +------+------+
    | name | age  |
    +------+------+
    | cat  |   18 |
    +------+------+

使用 `DESC` 关键字查看表结构。

~~~sql:no-line-numbers
DESC student4;
~~~

    +-------+-------------+------+-----+---------+-------+
    | Field | Type        | Null | Key | Default | Extra |
    +-------+-------------+------+-----+---------+-------+
    | name  | varchar(64) | NO   | PRI | NULL    |       |
    | age   | int         | YES  |     | 18      |       |
    +-------+-------------+------+-----+---------+-------+

在 `Key` 列中，设有主键的列会显示为 `PRI`。

## 主键的增删

对于一个已经存在的表，可以用下面的方式删除和添加主键。

删除表 `student4` 的主键。

~~~sql:no-line-numbers
ALTER TABLE student4 DROP PRIMARY KEY;
~~~

为表 `student4` 添加主键为 `name` 列。

~~~sql:no-line-numbers
ALTER TABLE student4 ADD PRIMARY KEY (name);
~~~

## 复合主键

`MySQL` **不允许**同时定义**多个主键**，比如：

::: caution 对于已经存在主键的表，在其他列添加主键。

~~~sql:no-line-numbers
ALTER TABLE student4 ADD PRIMARY KEY (age);
-- ERROR 1068 (42000): Multiple primary key defined
~~~

:::

::: caution 创建表时设置多个主键。

~~~sql:no-line-numbers
CREATE TABLE student (
    name varchar(64) PRIMARY KEY,
    age int DEFAULT 18 PRIMARY KEY
);
-- ERROR 1068 (42000): Multiple primary key defined
~~~

:::

然而，`MySQL` 提供了复合主键（Composite Primary Key）的概念。下面的表 `sc` 中，单独使用 `sname` 或 `cname` 作为主键都无法唯一标识一条记录，而必须用二者的组合。使用 `PRIMARY KEY (...)` 可以将多个列设为复合主键。

~~~sql {5}
CREATE TABLE sc (
    sname varchar(64) COMMENT '学生姓名',
    cname varchar(64) COMMENT '课程名称',
    score tinyint COMMENT '成绩得分',
    PRIMARY KEY (sname, cname)
);
~~~

尝试插入以下的数据进行测试。

| sname | cname | score |
| - | - | - |
| 张三 | 数学 | 97 |
| 张三 | 英语 | 89 |
| 张三 | 语文 | 85 |
| 李四 | 数学 | 86 |
| 李四 | 英语 | 95 |
| 李四 | 语文 | 93 |

~~~sql:no-line-numbers
INSERT INTO sc VALUES
('张三','语文',85),('张三','数学',97),('张三','英语',89),
('李四','语文',93),('李四','数学',86),('李四','英语',95);
-- Query OK, 6 rows affected
-- Records: 6  Duplicates: 0  Warnings: 0
~~~

复合主键使用多个列同时表示唯一记录。这些列本身允许重复值，比如 `sname` 列可以有多个重复的 `张三`，`cname` 列可有多个重复的 `语文`，但是两个列组合在一起的值都是唯一的。
