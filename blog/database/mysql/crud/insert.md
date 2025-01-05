---
title: 插入记录
date: 2023-12-22
isOriginal: true
icon: section
category:
  - MySQL
tag:
  - SQL
excerpt: 向数据表中插入数据
order: 1
---

在 `MySQL` 数据表中，每一行都是以**元组**的形式存储，一行数据也称为一条**记录**。插入新的记录需要使用 `INSERT` 关键字。

~~~sql:no-line-numbers
INSERT [INTO] table_name [(field1, field2, ...)] VALUES (value1, value2, ...) [,(value1, value2, ...) ...];
~~~

::: info 参数说明

- `table_name`：数据表名称。
- `field..`：列属性名称。
- `value..`：插入的值。

其中列名 `field` 与数据 `value` 需要一一对应。

:::

如果指定了列名，则插入的记录的元组需要与之一一对应。如果要对所有列插入记录，可以省略列名。

创建以下的学生表 `student`，在其中插入记录。

~~~sql
CREATE TABLE student (
    name varchar(64) COMMENT '姓名',
    age smallint COMMENT '年龄',
    gender char(4) COMMENT '性别',
    birthday date COMMENT '出生日期'
);
~~~

插入一条记录。

~~~sql:no-line-numbers
INSERT INTO student VALUES ('张三', 18, '男', '2003-06-01');
~~~

只对 `name`、`age` 和 `gender` 列进行插入。

~~~sql:no-line-numbers
INSERT INTO student (name, age, gender) VALUES ('李四', 19, '女');
~~~

自定义元组中插入的列的顺序。

~~~sql:no-line-numbers
INSERT INTO student (age, gender, name) VALUES (20, '男', '王五');
~~~

一条语句中也可以同时插入多条记录。

~~~sql:no-line-numbers
INSERT INTO student (name, age, gender) VALUES
('赵六', 21, '女'),('孙七', 20, '男'),('周八', 20, '女');
~~~
