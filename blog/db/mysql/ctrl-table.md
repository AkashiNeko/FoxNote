---
title: MySQL表的操作
date: 2023-12-20
isOriginal: true
icon: "/icon/db_mysql_post.svg"
category:
  - 数据库
tag:
  - MySQL
  - SQL
excerpt: 数据表是数据库中的一个基本组成单位，数据以表的形式进行组织和存储。
order: 3
---

## 1. 创建数据表

与创建数据库相似，创建数据表需要用到关键字 `CREATE TABLE`。一个表中可以有多个列，每个列可以有不同的数据类型和约束条件。

~~~sql:no-line-numbers
CREATE [TEMPORARY] TABLE [IF NOT EXISTS] table_name (
    field1 datatype1 [...],
    field2 datatype2 [...],
    field3 datatype3 [...],
    ...
) [CHARACTER SET charset_name] [COLLATE collation_name] [ENGINE engine_name];
~~~

使用 `TEMPORARY` 关键字用于创建一个临时表，临时表在当前会话结束后会自动被删除。

要创建数据表，首先需要选择使用的数据库。

~~~sql:no-line-numbers
use mydb;
~~~

创建一个名为 `user` 的表。其中包含三个列：`name`、`age` 和 `gender`。

~~~sql:no-line-numbers
create table user (
    name char(20),
    age int,
    gender bool
);
~~~

创建一个名为 `user2` 的表，如果它不存在。其中包含两个列：`uid` 和 `password`，且使用 `MyISAM` 存储引擎。

~~~sql:no-line-numbers
create table if not exists user2 (
    uid char(20) primary key comment '用户的ID',
    password char(32) not null comment '密码的MD5值'
) engine MyISAM;
~~~

## 2. 查看数据表

查看当前使用的数据库中的所有数据表。

~~~text:no-line-numbers
mysql> show tables;
+----------------+
| Tables_in_mydb |
+----------------+
| user           |
| user2          |
+----------------+
2 rows in set (0.00 sec)
~~~

使用 `DESC` 关键字查看表结构。

~~~text:no-line-numbers
mysql> desc user;
+--------+------------+------+-----+---------+-------+
| Field  | Type       | Null | Key | Default | Extra |
+--------+------------+------+-----+---------+-------+
| name   | char(20)   | YES  |     | NULL    |       |
| age    | int        | YES  |     | NULL    |       |
| gender | tinyint(1) | YES  |     | NULL    |       |
+--------+------------+------+-----+---------+-------+
3 rows in set (0.00 sec)

mysql> desc user2;
+----------+----------+------+-----+---------+-------+
| Field    | Type     | Null | Key | Default | Extra |
+----------+----------+------+-----+---------+-------+
| uid      | char(20) | NO   | PRI | NULL    |       |
| password | char(32) | NO   |     | NULL    |       |
+----------+----------+------+-----+---------+-------+
2 rows in set (0.00 sec)
~~~

同数据库一样，可以使用 `SHOW` 查看创建表的结果。

~~~text:no-line-numbers
mysql> show create table user\G
*************************** 1. row ***************************
       Table: user
Create Table: CREATE TABLE `user` (
  `name` char(20) DEFAULT NULL,
  `age` int DEFAULT NULL,
  `gender` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.00 sec)

mysql> show create table user2\G
*************************** 1. row ***************************
       Table: user2
Create Table: CREATE TABLE `user2` (
  `uid` char(20) NOT NULL COMMENT '用户的ID',
  `password` char(32) NOT NULL COMMENT '密码的MD5值',
  PRIMARY KEY (`uid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.00 sec)
~~~

## 3. 删除数据表

和删除数据库类似，使用 `DROP TABLE` 关键字删除数据表。

~~~sql:no-line-numbers
DROP [TEMPORARY] TABLE [IF EXISTS] table_name [, table_name2 ...]
~~~

删除 `user2` 数据表。

~~~sql:no-line-numbers
drop table user2;
~~~

删除 `user2` 数据表，如果它存在。

~~~sql:no-line-numbers
drop table if exists user2;
~~~

## 4. 修改表结构

对表结构的修改，需要使用 `ALTER` 关键字。

### 增加列

增加列时，括号里的字段与创建表时的类似。

~~~sql:no-line-numbers
ALTER TABLE table_name ADD (
    field1 datatype1 [...],
    field2 datatype2 [...],
    ...
);
~~~

在 `user` 表中新增一列 `birthday`。

~~~sql:no-line-numbers
alter table user add (
    birthday date
);
~~~

### 删除列

与增加列类似，将 `ADD` 改为 `DROP`。

~~~sql:no-line-numbers
ALTER TABLE table_name DROP field;
~~~

删除 `user` 表中的 `birthday` 列。

~~~sql:no-line-numbers
alter table user drop birthday;
~~~

### 修改列属性

TODO

### 修改列名

TODO
