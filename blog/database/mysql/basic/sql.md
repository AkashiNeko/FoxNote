---
title: SQL 语句
date: 2023-12-19
isOriginal: true
icon: section
category:
  - MySQL
tag:
  - 数据库
excerpt: 结构化查询语言
order: 2
---

为了操作 MySQL 数据库，需要使用名为 **SQL** 的语言与它进行交互。

::: info SQL

结构化查询语言（Structured Query Language，SQL）是一种用于管理和操作关系型数据库的标准化语言。`SQL`提供了一种简洁、灵活和可扩展的方式来访问和处理数据库中的数据。`MySQL` 的 `SQL` 语句分为以下三类：

1. **数据操作语言（DML）**：允许用户使用查询语句 `SELECT` 检索数据、插入新数据 `INSERT`、更新数据 `UPDATE` 和删除数据 `DELETE`。这些操作可以根据指定的条件对数据库中的数据进行选择性操作。

2. **数据定义语言（DDL）**：定义数据库结构的语句，如创建表 `CREATE TABLE`、修改表结构 `ALTER TABLE` 和删除表 `DROP TABLE`。用于创建、修改和删除数据库对象，如表、索引、视图等。

3. **数据控制语言（DCL）**：数据访问和安全性控制。这包括授权用户对数据库对象的访问权限、定义用户角色和权限、以及在数据库中实施数据完整性和安全性约束。

:::

下面使用 `SQL` 语句简单地创建一个数据库 `mydb`，在其中的表 `user` 中插入一条记录。

`MySQL` 的关键字不区分大小写，比如关键字 `CREATE` 和 `create` 的作用是完全相同的。

~~~sql
CREATE DATABASE mydb;
USE mydb;
CREATE TABLE user (name char(20), age int, birthday date);
INSERT INTO user (name, age, birthday) VALUES ('akashi', 20, '2004-01-01');
SELECT * FROM user;
~~~

需要注意的是，这里输入的 `SQL` 语句需要以 `;`、`\g` 或 `\G` 结尾，`mysql` 命令的交互界面支持换行输入。

~~~text:no-line-numbers
mysql> CREATE DATABASE mydb;
Query OK, 1 row affected (0.00 sec)
~~~

~~~text:no-line-numbers
mysql> USE mydb;
Database changed
mysql> CREATE TABLE user (
    ->  name char(20),
    ->  age int,
    ->  birthday date
    -> );
Query OK, 0 rows affected (0.02 sec)
~~~

~~~text:no-line-numbers
mysql> SHOW TABLES;
+----------------+
| Tables_in_mydb |
+----------------+
| user           |
+----------------+
1 row in set (0.00 sec)
~~~

~~~text:no-line-numbers
mysql> INSERT INTO user (name, age, birthday) VALUES ('akashi', 20, '2004-01-01');
Query OK, 1 row affected (0.01 sec)
~~~

~~~text:no-line-numbers
mysql> SELECT * FROM user;
+--------+------+------------+
| name   | age  | birthday   |
+--------+------+------------+
| akashi |   20 | 2004-01-01 |
+--------+------+------------+
1 row in set (0.00 sec)
~~~

**数据库**和**数据表**是 `MySQL` 中的重要概念。它们的关系是：一个 `MySQL` 服务器可以包含多个数据库，一个数据库可以包含多个数据表。

![MySQL数据库和数据表](/inset/MySQL数据库和数据表.svg)
