---
title: 删除数据库
date: 2023-12-20
isOriginal: true
icon: section
category:
  - MySQL
tag:
  - SQL
excerpt: 删除MySQL数据库
order: 5
---

`DROP DATABASE` 用于删除数据库。

~~~sql:no-line-numbers
DROP DATABASE [IF EXISTS] db_name;
~~~

删除名为 `mydb` 的数据库。

~~~sql:no-line-numbers
DROP DATABASE mydb;
~~~

删除名为 `mydb` 的数据库，如果它存在。

~~~sql:no-line-numbers
DROP DATABASE IF EXISTS mydb; 
~~~
