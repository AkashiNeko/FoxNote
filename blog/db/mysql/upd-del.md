---
title: 修改和删除记录
date: 2023-12-22
isOriginal: true
icon: "/icon/db_mysql_post.svg"
category:
  - 数据库
tag:
  - MySQL
  - SQL
excerpt: 对已存在的数据库表中的记录进行更改或更新，以及删除不再需要的数据。
order: 8
---

## 1. 修改记录

### UPDATE关键字

关键字 `UPDATE` 可以修改表中已存在的记录，配合 `WHERE` 选中要修改的值，`SET` 设置新的值。

~~~sql
UPDATE table_name
SET field1=value1,field2=value2,...
WHERE condition;
~~~

这里关键字 `WHERE` 的用法和 `SELECT` 查询数据时的用法完全相同，用于筛选特定的数据。

### 修改记录示例

首先创建下面的数据表 `person`，插入一些测试数据。

~~~sql
CREATE TABLE person (
    name varchar(64) COMMENT '姓名',
    age smallint COMMENT '年龄',
    gender char(4) COMMENT '性别'
);

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

## 2. 删除记录

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
