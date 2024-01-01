---
title: 记录的增删查改
date: 2023-12-22
isOriginal: true
icon: "/icon/db_mysql_post.svg"
category:
  - MySQL
tag:
  - SQL
excerpt: 记录的增删查改：插入（INSERT）、删除（DELETE）、查询（SELECT）和修改（UPDATE）。
order: 4
---

## 1. 插入记录

### INSERT关键字

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

### SELECT关键字

关键字 `SELECT` 可以用于选择列名，`FROM` 关键字后接要查看的表。

~~~sql:no-line-numbers
SELECT field1, field2, ...
FROM table_name
[WHERE condition]
[ORDER BY field [ASC|DESC]]
[LIMIT number];
~~~

::: info 参数说明

- `field..`：列属性名称。设为 `*` 表示选择所有列。
- `table_name`：数据表名称。
- `condition`：指定筛选条件。

:::

### 查看记录示例

以上面的 `student` 表举例，查看之前插入的记录。

查看所有学生的信息。

~~~sql:no-line-numbers
SELECT * FROM student;
~~~

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

查看所有男生的信息。

~~~sql:no-line-numbers
SELECT * FROM student WHERE gender='男';
~~~

    +------+------+--------+------------+
    | name | age  | gender | birthday   |
    +------+------+--------+------------+
    | 张三 |   18 | 男     | 2003-06-01 |
    | 王五 |   20 | 男     | NULL       |
    | 孙七 |   20 | 男     | NULL       |
    +------+------+--------+------------+

查看年龄大于 `19` 的学生的姓名和年龄。

~~~sql:no-line-numbers
SELECT name,age FROM student WHERE age>19;
~~~

    +------+------+
    | name | age  |
    +------+------+
    | 王五 |   20 |
    | 赵六 |   21 |
    | 孙七 |   20 |
    +------+------+

查看所有女生的信息，按年龄排序。

~~~sql:no-line-numbers
SELECT * FROM student WHERE gender='女' ORDER BY age;
~~~

    +------+------+--------+----------+
    | name | age  | gender | birthday |
    +------+------+--------+----------+
    | 李四 |   19 | 女     | NULL     |
    | 周八 |   20 | 女     | NULL     |
    | 赵六 |   21 | 女     | NULL     |
    +------+------+--------+----------+

查看年龄最小的前 $3$ 位学生的信息。

~~~sql:no-line-numbers
SELECT * FROM student ORDER BY age LIMIT 3;
~~~

    +------+------+--------+------------+
    | name | age  | gender | birthday   |
    +------+------+--------+------------+
    | 张三 |   18 | 男     | 2003-06-01 |
    | 李四 |   19 | 女     | NULL       |
    | 周八 |   19 | 女     | NULL       |
    +------+------+--------+------------+

## 3. 修改记录

### UPDATE关键字

关键字 `UPDATE` 可以修改表中已存在的记录，配合 `WHERE` 选中要修改的值，`SET` 设置新的值。

~~~sql
UPDATE table_name
SET field1=value1,field2=value2,...
WHERE condition;
~~~

这里关键字 `WHERE` 的用法和 `SELECT` 查询数据时的用法完全相同，用于筛选特定的数据。

### 修改记录示例

首先创建下面的数据表 `person`，插入一些数据用于测试。

~~~sql
CREATE TABLE person (
    name varchar(64) COMMENT '姓名',
    age smallint COMMENT '年龄',
    gender char(4) COMMENT '性别'
);
~~~

~~~sql
INSERT INTO person VALUES ('Emily',25,'F'),
('James',32,'M'),('Emma',18,'F'),('William',40,'M'),
('Olivia',27,'F'),('Benjamin',35,'M'),('Ava',22,'F'),
('Alexander',29,'M'),('Sophia',31,'F'),('Jacob',37,'M');
~~~

将 `Alexander` 的姓名修改为 `Alex`。

~~~sql:no-line-numbers
UPDATE person SET name='Alex' WHERE name='Alexander';
-- Query OK, 1 row affected
-- Rows matched: 1  Changed: 1  Warnings: 0
~~~

将所有人的年龄增加 $1$ 岁。

~~~sql:no-line-numbers
UPDATE person SET age=age+1;
-- Query OK, 10 rows affected (0.01 sec)
-- Rows matched: 10  Changed: 10  Warnings: 0
~~~

## 4. 删除记录

### DELETE关键字

使用关键字 `DELETE FROM` 删除表中的记录。

~~~sql:no-line-numbers
DELETE FROM table_name
WHERE condition;
~~~

### 删除记录示例

继续对之前的 `person` 表进行操作。

删除姓名为 `James` 的记录。

~~~sql:no-line-numbers
DELETE FROM person WHERE name='James';
-- Query OK, 1 row affected
~~~

删除年龄小于 $30$ 的记录。

~~~sql:no-line-numbers
DELETE FROM person WHERE age<30;
-- Query OK, 4 rows affected
~~~

删除所有记录。

~~~sql:no-line-numbers
DELETE FROM person;
-- Query OK, 5 rows affected
~~~
