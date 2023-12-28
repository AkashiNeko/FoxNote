---
title: 修改数据表
date: 2023-12-21
isOriginal: true
icon: "/icon/db_mysql_post.svg"
category:
  - 数据库
tag:
  - MySQL
  - SQL
excerpt: 数据表建立好后，对已存在的数据表进行结构和属性的变更，包括添加、修改和删除列等操作。
order: 6
---

## 1. 修改表结构

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

~~~sql:no-line-numbers
ALTER TABLE user1 MODIFY name char(40) NOT NULL;
~~~

~~~text:no-line-numbers
mysql> DESC user1;
+--------+------------+------+-----+---------+-------+
| Field  | Type       | Null | Key | Default | Extra |
+--------+------------+------+-----+---------+-------+
| name   | char(40)   | NO   |     | NULL    |       |
| age    | int        | YES  |     | NULL    |       |
| gender | tinyint(1) | YES  |     | NULL    |       |
+--------+------------+------+-----+---------+-------+
~~~

## 2. 修改名称

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

~~~text:no-line-numbers
mysql> SHOW TABLES;
+----------------+
| Tables_in_mydb |
+----------------+
| user1          |
+----------------+
~~~

~~~sql:no-line-numbers
ALTER TABLE user1 RENAME TO users;
~~~

~~~text:no-line-numbers
mysql> SHOW TABLES;
+----------------+
| Tables_in_mydb |
+----------------+
| users          |
+----------------+
~~~

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
