---
title: 创建数据表
date: 2023-12-21
isOriginal: true
icon: section
category:
  - MySQL
tag:
  - SQL
excerpt: 创建MySQL数据表
order: 1
---

## 创建表语法

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

## 创建表示例

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
