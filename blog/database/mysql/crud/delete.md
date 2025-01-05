---
title: 删除记录
date: 2023-12-22
isOriginal: true
icon: section
category:
  - MySQL
tag:
  - SQL
excerpt: 删除数据表中已存在的记录
order: 7
---

使用关键字 `DELETE FROM` 删除表中的记录。

~~~sql:no-line-numbers
DELETE FROM table_name
WHERE condition;
~~~

继续对之前的 `person` 表进行操作。

删除姓名为 `James` 的记录。

~~~sql:no-line-numbers
DELETE FROM person WHERE name='James';
-- Query OK, 1 row affected
~~~

删除年龄小于30的记录。

~~~sql:no-line-numbers
DELETE FROM person WHERE age<30;
-- Query OK, 4 rows affected
~~~

删除所有记录。

~~~sql:no-line-numbers
DELETE FROM person;
-- Query OK, 5 rows affected
~~~
