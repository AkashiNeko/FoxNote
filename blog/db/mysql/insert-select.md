---
title: 查看和插入数据
date: 2023-12-23
isOriginal: true
icon: "/icon/db_mysql_post.svg"
category:
  - 数据库
tag:
  - MySQL
  - 数据类型
excerpt: MySQL数据表中，每一列都有一种数据类型，决定了该列能够存储的数据种类和范围。
order: 5
---

## 1. 插入记录

### 插入记录语法

在 `MySQL` 数据表中，每一行都是以**元组**的形式存储，称为一条**记录**。增加一条新的记录需要使用 `INSERT INTO` 关键字。

~~~sql:no-line-numbers
INSERT INTO table_name [(field1, field2, ...)] VALUES (value1, value2, ...) [,(value1, value2, ...) ...];
~~~

::: info 参数说明

- `table_name`：数据表名称。
- `field..`：列属性名。
- `value..`：插入的值。

:::

如果指定了列名，则插入的记录的元组需要与之一一对应。如果要对所有列插入记录，可以省略列名。

### 插入记录示例

创建以下的 `student` 表，在其中插入记录。

~~~sql:no-line-numbers
CREATE TABLE student (
    name varchar(64),
    age smallint,
    gender char(4),
    birthday date
);
~~~

插入一条完整的记录。

~~~sql:no-line-numbers
INSERT INTO student VALUES ('张三', 18, '男', '2003-06-01');
~~~

只插入 `name`、`age` 和 `gender` 属性。

~~~sql:no-line-numbers
INSERT INTO student (name, age, gender) VALUES ('李四', 19, '女');
~~~

自定义元组中插入属性的顺序。

~~~sql:no-line-numbers
INSERT INTO student (age, gender, name) VALUES (20, '男', '王五');
~~~

### 插入多条记录

在 `VALUES` 之后，可以指定多个元组，同时插入多个数据。

~~~sql:no-line-numbers
INSERT INTO student (name, age, gender) VALUES
('赵六', 21, '女'),('孙七', 20, '男'),('周八', 19, '女');
~~~

## 2. 查看记录

### 查看记录语法

关键字 `SELECT` 用于选择列属性，`FROM` 关键字后接要查看的表。

~~~sql:no-line-numbers
SELECT field1, field2, ...
FROM table_name
[WHERE condition]
[ORDER BY field [ASC|DESC]]
[LIMIT number];
~~~

::: info 参数说明

- `field..`：列属性名。设为 `*` 表示选择所有列。
- `table_name`：表名
- `WHERE condition`：指定筛选条件。
- `ORDER BY field`：根据 `field` 列进行排序。

:::
