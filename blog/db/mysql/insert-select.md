---
title: 数据的插入和查询
date: 2023-12-22
isOriginal: true
icon: "/icon/db_mysql_post.svg"
category:
  - 数据库
tag:
  - MySQL
  - 数据类型
excerpt: 关键字INSERT将新的记录添加到表中，关键字SELECT从数据库中检索已存储的记录。
order: 4
---

## 1. 插入记录

### 插入记录语法

在 `MySQL` 数据表中，每一行都是以**元组**的形式存储，一行数据也称为一条**记录**。插入新的记录需要使用 `INSERT` 关键字。

~~~sql:no-line-numbers
INSERT [INTO] table_name [(field1, field2, ...)] VALUES (value1, value2, ...) [,(value1, value2, ...) ...];
~~~

::: info 参数说明

- `table_name`：数据表名称。
- `field..`：列属性名。
- `value..`：插入的值。

其中列名 `field` 与数据 `value` 需要一一对应。

:::

如果指定了列名，则插入的记录的元组需要与之一一对应。如果要对所有列插入记录，可以省略列名。

### 插入记录示例

创建以下的学生表 `student`，在其中插入记录。

~~~sql
CREATE TABLE student (
    name varchar(64) COMMENT '姓名',
    age smallint COMMENT '年龄',
    gender char(4) COMMENT '性别',
    birthday date COMMENT '出生日期'
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
('赵六', 21, '女'),('孙七', 20, '男'),('周八', 20, '女');
~~~

## 2. 查看记录

### 查看记录语法

关键字 `SELECT` 可以用于选择列名，`FROM` 关键字后接要查看的表。

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
- `condition`：指定筛选条件。

:::

### 查看记录示例

以上面的 `student` 表举例，查看之前插入的记录。

查看所有学生的信息。

~~~sql:no-line-numbers
SELECT * FROM student;
~~~

~~~text:no-line-numbers
+------+------+--------+------------+
| name | age  | gender | birthday   |
+------+------+--------+------------+
| 张三 |   18 | 男     | 2003-06-01 |
| 李四 |   19 | 女     | NULL       |
| 王五 |   20 | 男     | NULL       |
| 赵六 |   21 | 女     | NULL       |
| 孙七 |   20 | 男     | NULL       |
| 周八 |   20 | 女     | NULL       |
+------+------+--------+------------+
~~~

查看所有男生的信息。

~~~sql:no-line-numbers
SELECT * FROM student WHERE gender='男';
~~~

~~~text:no-line-numbers
+------+------+--------+------------+
| name | age  | gender | birthday   |
+------+------+--------+------------+
| 张三 |   18 | 男     | 2003-06-01 |
| 王五 |   20 | 男     | NULL       |
| 孙七 |   20 | 男     | NULL       |
+------+------+--------+------------+
~~~

查看年龄大于 `19` 的学生的姓名和年龄。

~~~sql:no-line-numbers
SELECT name,age FROM student WHERE age>19;
~~~

~~~text:no-line-numbers
+------+------+
| name | age  |
+------+------+
| 王五 |   20 |
| 赵六 |   21 |
| 孙七 |   20 |
+------+------+
~~~

查看所有女生的信息，按年龄排序。

~~~sql:no-line-numbers
SELECT * FROM student WHERE gender='女' ORDER BY age;
~~~

~~~text:no-line-numbers
+------+------+--------+----------+
| name | age  | gender | birthday |
+------+------+--------+----------+
| 李四 |   19 | 女     | NULL     |
| 周八 |   20 | 女     | NULL     |
| 赵六 |   21 | 女     | NULL     |
+------+------+--------+----------+
~~~

查看年龄最小的前 $3$ 位学生的信息。

~~~sql:no-line-numbers
SELECT * FROM student ORDER BY age LIMIT 3;
~~~

~~~text:no-line-numbers
+------+------+--------+------------+
| name | age  | gender | birthday   |
+------+------+--------+------------+
| 张三 |   18 | 男     | 2003-06-01 |
| 李四 |   19 | 女     | NULL       |
| 周八 |   19 | 女     | NULL       |
+------+------+--------+------------+
~~~
