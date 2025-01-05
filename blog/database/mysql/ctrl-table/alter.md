---
title: 修改表结构
date: 2023-12-21
isOriginal: true
icon: section
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

~~~sql:no-line-numbers
SHOW TABLES;
~~~

    +----------------+
    | Tables_in_mydb |
    +----------------+
    | user1          |
    | user2          |
    +----------------+

### 查看表结构

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

### 查看创建结果

同数据库一样，可以使用 `SHOW` 查看创建表的结果。

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

## 4. 修改表结构

对表结构的修改，需要使用 `ALTER` 关键字。

### 增加和删除列

增加列时，使用 `ADD` 关键字。要增加的列的写法与创建表时相似。

~~~sql:no-line-numbers
ALTER TABLE table_name ADD (
    field1 datatype1 [...],
    field2 datatype2 [...],
    ...
);
~~~

在 `user1` 表中新增一列 `birthday`。

~~~sql:no-line-numbers
ALTER TABLE user1 ADD ( birthday date );
~~~

要删除列，只要将 `ADD` 关键字变为 `DROP`，后接要删除的列名。

~~~sql:no-line-numbers
ALTER TABLE table_name DROP field;
~~~

删除 `user1` 表中的 `birthday` 列。

~~~sql:no-line-numbers
ALTER TABLE user1 DROP birthday;
~~~

### 修改列属性

关键字 `MODIFY` 可以修改列的类型和约束条件。后接要修改的列名，且必须是已经存在的列。

~~~sql:no-line-numbers
ALTER TABLE table_name MODIFY field new_datatype [...];
~~~

将 `user1` 表中 `name` 的类型由 `char(20)` 改为 `char(40)`，且不为空。

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
ALTER TABLE user1 MODIFY name char(40) NOT NULL;
~~~

~~~sql:no-line-numbers
mysql> DESC user1;
~~~

    +--------+------------+------+-----+---------+-------+
    | Field  | Type       | Null | Key | Default | Extra |
    +--------+------------+------+-----+---------+-------+
    | name   | char(40)   | NO   |     | NULL    |       |
    | age    | int        | YES  |     | NULL    |       |
    | gender | tinyint(1) | YES  |     | NULL    |       |
    +--------+------------+------+-----+---------+-------+

## 5. 修改名称

### 修改表名

修改表名需要用到 `RENAME` 关键字，其后的 `TO` 可以省略不写，对表名的修改不影响表的结构。

~~~sql:no-line-numbers
ALTER TABLE old_table_name RENAME [TO] new_table_name;
~~~

::: info 参数说明

- `old_table_name`：被修改的旧表名。
- `new_table_name`：修改后的新表名。

:::

将 `user1` 表改名为 `users`。

~~~sql:no-line-numbers
SHOW TABLES;
~~~

    +----------------+
    | Tables_in_mydb |
    +----------------+
    | user1          |
    +----------------+

~~~sql:no-line-numbers
ALTER TABLE user1 RENAME TO users;
SHOW TABLES;
~~~

    +----------------+
    | Tables_in_mydb |
    +----------------+
    | users          |
    +----------------+

### 修改列名

修改列名使用关键字 `CHANGE`，语法与 `MODIFY` 修改列属性基本一致，它也可以修改列属性。唯一的区别是 `CHANGE` 指定的列名后需要填写新的列名称。

~~~sql:no-line-numbers
ALTER TABLE table_name CHANGE old_field new_field datatype [...];
~~~

::: info 参数说明

- `old_field`：被修改的旧列名。
- `new_field`：修改后的新列名。

:::

修改 `user1` 表中 `name` 列的名称为 `username`。

~~~sql:no-line-numbers
ALTER TABLE users CHANGE name username char(40) NOT NULL;
~~~
