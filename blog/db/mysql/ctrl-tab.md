---
title: 数据表的操作
date: 2023-12-21
isOriginal: true
icon: "/icon/db_mysql_post.svg"
category:
  - MySQL
tag:
  - SQL
excerpt: 数据表是数据库中的一个基本组成单位，数据以表的形式进行组织和存储。
order: 4
---

## 1. 创建数据表

### 创建表语法

与创建数据库相似，创建数据表需要用到关键字 `CREATE TABLE`。一个表中可以有多个列，每个列可以有不同的数据类型和约束条件。

~~~sql:no-line-numbers
CREATE [TEMPORARY] TABLE [IF NOT EXISTS] table_name (
    field1 datatype1 [...],
    field2 datatype2 [...],
    field3 datatype3 [...],
    ...
) [CHARACTER SET charset_name] [COLLATE collation_name] [ENGINE engine_name];
~~~

::: info 参数说明

- `table_name`：要创建的数据表名称。
- `field..`：列属性名称。
- `datatype..`：列的数据类型。
- `charset_name`：字符集名称。
- `collation_name`：校验规则名称。
- `engine_name`：存储引擎名称。

:::

使用 `TEMPORARY` 关键字用于创建一个临时表，临时表在当前会话结束后会自动被删除。

创建表的语句也可以都写在同一行，为了方便展示，这里以多行的形式展示。

### 创建表示例

要创建数据表，首先需要选择使用的数据库。

~~~sql:no-line-numbers
USE mydb;
~~~

创建一个名为 `user1` 的表。其中包含三个列：`name`、`age` 和 `gender`。

~~~sql
CREATE TABLE user1 (
    name char(20),
    age int,
    gender bool
);
~~~

创建一个名为 `user2` 的表，如果它不存在。其中包含两个列：`uid` 和 `password`，添加相关说明，并且使用 `MyISAM` 存储引擎。

~~~sql
CREATE TABLE IF NOT EXISTS user2 (
    uid char(20) PRIMARY KEY COMMENT '用户的ID',
    password char(32) NOT NULL COMMENT '密码的MD5值'
) ENGINE MyISAM;
~~~

## 2. 查看数据表

### 查看所有表

使用 `SHOW` 关键字查看当前使用的数据库中的所有数据表。

~~~text:no-line-numbers
mysql> SHOW TABLES;
+----------------+
| Tables_in_mydb |
+----------------+
| user1          |
| user2          |
+----------------+
~~~

### 查看表结构

使用 `DESC` 关键字查看表结构。

~~~text:no-line-numbers
mysql> DESC user1;
+--------+------------+------+-----+---------+-------+
| Field  | Type       | Null | Key | Default | Extra |
+--------+------------+------+-----+---------+-------+
| name   | char(20)   | YES  |     | NULL    |       |
| age    | int        | YES  |     | NULL    |       |
| gender | tinyint(1) | YES  |     | NULL    |       |
+--------+------------+------+-----+---------+-------+
~~~

~~~text:no-line-numbers
mysql> DESC user2;
+----------+----------+------+-----+---------+-------+
| Field    | Type     | Null | Key | Default | Extra |
+----------+----------+------+-----+---------+-------+
| uid      | char(20) | NO   | PRI | NULL    |       |
| password | char(32) | NO   |     | NULL    |       |
+----------+----------+------+-----+---------+-------+
~~~

### 查看创建结果

同数据库一样，可以使用 `SHOW` 查看创建表的结果。

~~~text:no-line-numbers
mysql> SHOW CREATE TABLE user1\G
*************************** 1. row ***************************
       Table: user1
Create Table: CREATE TABLE `user1` (
  `name` char(20) DEFAULT NULL,
  `age` int DEFAULT NULL,
  `gender` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
~~~

~~~text:no-line-numbers
mysql> SHOW CREATE TABLE user2\G
*************************** 1. row ***************************
       Table: user2
Create Table: CREATE TABLE `user2` (
  `uid` char(20) NOT NULL COMMENT '用户的ID',
  `password` char(32) NOT NULL COMMENT '密码的MD5值',
  PRIMARY KEY (`uid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
~~~

## 3. 删除数据表

和删除数据库类似，使用 `DROP TABLE` 关键字删除数据表。

~~~sql:no-line-numbers
DROP [TEMPORARY] TABLE [IF EXISTS] table_name [, table_name2 ...]
~~~

删除 `user2` 数据表。

~~~sql:no-line-numbers
DROP TABLE user2;
~~~

删除 `user2` 数据表，如果它存在。

~~~sql:no-line-numbers
DROP TABLE IF EXISTS user2;
~~~

## 4. 修改记录

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

## 5. 删除记录

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
