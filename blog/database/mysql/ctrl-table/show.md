---
title: 查看数据表
date: 2023-12-21
isOriginal: true
icon: section
category:
  - MySQL
tag:
  - SQL
excerpt: 查看MySQL数据表
order: 2
---

## 查看所有表

使用 `SHOW` 关键字查看当前使用的数据库中的所有数据表。

~~~sql:no-line-numbers
SHOW TABLES;
~~~

    +----------------+
    | Tables_in_mydb |
    +----------------+
    | user1          |
    | user2          |
    +----------------+

## 查看表结构

使用 `DESC` 关键字查看表结构。

~~~sql:no-line-numbers
DESC user1;
~~~

    +--------+------------+------+-----+---------+-------+
    | Field  | Type       | Null | Key | Default | Extra |
    +--------+------------+------+-----+---------+-------+
    | name   | char(20)   | YES  |     | NULL    |       |
    | age    | int        | YES  |     | NULL    |       |
    | gender | tinyint(1) | YES  |     | NULL    |       |
    +--------+------------+------+-----+---------+-------+

~~~sql:no-line-numbers
DESC user2;
~~~

    +----------+----------+------+-----+---------+-------+
    | Field    | Type     | Null | Key | Default | Extra |
    +----------+----------+------+-----+---------+-------+
    | uid      | char(20) | NO   | PRI | NULL    |       |
    | password | char(32) | NO   |     | NULL    |       |
    +----------+----------+------+-----+---------+-------+

## 查看创建语句

同数据库一样，可以使用 `SHOW` 查看创建表的语句。

~~~sql:no-line-numbers
SHOW CREATE TABLE user1\G
~~~

    *************************** 1. row ***************************
        Table: user1
    Create Table: CREATE TABLE `user1` (
    `name` char(20) DEFAULT NULL,
    `age` int DEFAULT NULL,
    `gender` tinyint(1) DEFAULT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

~~~sql:no-line-numbers
mysql> SHOW CREATE TABLE user2\G
~~~

    *************************** 1. row ***************************
        Table: user2
    Create Table: CREATE TABLE `user2` (
    `uid` char(20) NOT NULL COMMENT '用户的ID',
    `password` char(32) NOT NULL COMMENT '密码的MD5值',
    PRIMARY KEY (`uid`)
    ) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
