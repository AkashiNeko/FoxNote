---
title: 查看数据库
date: 2023-12-20
isOriginal: true
icon: section
category:
  - MySQL
tag:
  - SQL
excerpt: 查看MySQL数据库
order: 3
---

查看所有数据库。

~~~sql:no-line-numbers
SHOW DATABASES;
~~~

    +--------------------+
    | Database           |
    +--------------------+
    | information_schema |
    | mysql              |
    | performance_schema |
    | sys                |
    | mydb               |
    +--------------------+

::: tip 注意

查看数据库使用的关键字是末尾带 `S` 的 `DATABASES`，而非 `DATABASE`。

:::

查看名为 `mydb` 的数据库是否存在。

~~~sql:no-line-numbers
SHOW DATABASES LIKE 'mydb';
~~~

    +--------------------+
    | Database           |
    +--------------------+
    | mydb               |
    +--------------------+
