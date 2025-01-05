---
title: 更新记录
date: 2023-12-22
isOriginal: true
icon: section
category:
  - MySQL
tag:
  - SQL
excerpt: 更改数据表中已存在的记录
order: 6
---

关键字 `UPDATE` 可以修改表中已存在的记录，配合 `WHERE` 选中要修改的值，`SET` 设置新的值。

~~~sql
UPDATE table_name
SET field1=value1,field2=value2,...
WHERE condition;
~~~

这里关键字 `WHERE` 的用法和 `SELECT` 查询数据时的用法完全相同，用于筛选特定的数据。

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

将所有人的年龄增加1岁。

~~~sql:no-line-numbers
UPDATE person SET age=age+1;
-- Query OK, 10 rows affected (0.01 sec)
-- Rows matched: 10  Changed: 10  Warnings: 0
~~~
