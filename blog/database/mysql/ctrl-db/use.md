---
title: 选择使用数据库
date: 2023-12-20
isOriginal: true
icon: section
category:
  - MySQL
tag:
  - SQL
excerpt: 选择使用数据库
order: 4
---

### 使用数据库

关键字 `USE` 用于选择要使用的数据库。

~~~sql:no-line-numbers
USE db_name;
~~~

在实际的应用场景中，通常是对一个数据库中的某些表进行频繁操作。使用 `USE` 指定要操作的数据库，可以将多次重复输入数据库名称的步骤简化为一次。一旦选中了数据库，后续的SQL语句中就不需要再显式地指定数据库名称了。

### 使用中的数据库

使用 `SELECT DATABASE()` 语句可以查看当前 `USE` 的数据库，未使用任何数据库时为 `NULL`。

~~~sql:no-line-numbers
SELECT database();
~~~

    +------------+
    | database() |
    +------------+
    | NULL       |
    +------------+

~~~sql:no-line-numbers
USE mydb;
SELECT database();
~~~

    +------------+
    | database() |
    +------------+
    | mydb       |
    +------------+

### 查看所有连接

使用 `SHOW processlist` 可以查看当前连接到数据库的所有用户，以及他们当前正在使用的数据库。

~~~sql:no-line-numbers
SHOW processlist;
~~~

    +----+-----------------+---------------+------+---------+------+------------------------+------------------+
    | Id | User            | Host          | db   | Command | Time | State                  | Info             |
    +----+-----------------+---------------+------+---------+------+------------------------+------------------+
    |  5 | event_scheduler | localhost     | NULL | Daemon  | 5782 | Waiting on empty queue | NULL             |
    |  8 | akashi          | akashipc:9423 | mydb | Query   |    0 | init                   | SHOW processlist |
    +----+-----------------+---------------+------+---------+------+------------------------+------------------+
