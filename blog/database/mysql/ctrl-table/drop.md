---
title: 删除数据表
date: 2023-12-21
isOriginal: true
icon: section
category:
  - MySQL
tag:
  - SQL
excerpt: 删除MySQL数据表
order: 3
---

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
