---
title: 查询结果切片
date: 2024-01-12
isOriginal: true
icon: section
category:
  - MySQL
tag:
  - SQL
excerpt: 使用 LIMIT 和 OFFSET 对查询结果切片
order: 5
---

关键字 `LIMIT` 可以单独使用，也和 `OFFSET` 配合使用。其作用为对查询结果进行切片。`LIMIT` 设置最多显示的记录条数，`OFFSET` 指定开始位置。

构建下面的表和数据进行测试。

~~~sql:no-line-numbers
CREATE TABLE limit_test ( n int );
INSERT INTO limit_test VALUES (0),(1),(2),(3),(4),(5),(6),(7),(8),(9);
~~~

查询所有记录，但最多显示3条。

~~~sql:no-line-numbers
SELECT * FROM limit_test LIMIT 3;
~~~

    +------+
    | n    |
    +------+
    |    0 |
    |    1 |
    |    2 |
    +------+

查询所有记录，最多显示3条，且从第5条开始显示。

~~~sql:no-line-numbers
SELECT * FROM limit_test LIMIT 5, 3;
SELECT * FROM limit_test LIMIT 3 OFFSET 5;
~~~

    +------+
    | n    |
    +------+
    |    5 |
    |    6 |
    |    7 |
    +------+
