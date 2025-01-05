---
title: 修改表名称
date: 2023-12-21
isOriginal: true
icon: section
category:
  - MySQL
tag:
  - SQL
excerpt: 数据表是数据库中的一个基本组成单位，数据以表的形式进行组织和存储。
order: 5
---

## 修改表名

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

## 修改列名

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
