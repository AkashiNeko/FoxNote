---
title: 查询结果排序
date: 2024-01-12
isOriginal: true
icon: section
category:
  - MySQL
tag:
  - SQL
excerpt: 使用 ORDER BY 对查询结果排序
order: 4
---

关键字 `ORDER` 用于对结果进行排序，其后可以接 `ASC` 进行升序排序，接 `DESC` 进行降序排序，默认为升序。

假设要排序的列名为 `id`，对该列进行升序排序。

~~~sql:no-line-numbers
SELECT ... ORDER BY id
SELECT ... ORDER BY id ASC
~~~

降序排序。

~~~sql:no-line-numbers
SELECT ... ORDER BY id DESC
~~~

对之前的 `student` 表进行查询。

查询所有学生的信息，并按年龄排序。

~~~sql:no-line-numbers
SELECT * FROM student ORDER BY age;
~~~

    +-------+------+--------+
    | name  | age  | gender |
    +-------+------+--------+
    | David |   18 | M      |
    | Chloe |   19 | F      |
    | Alice |   20 | M      |
    | Brian |   20 | M      |
    | Emma  |   20 | F      |
    | Faith |   21 | F      |
    +-------+------+--------+

查询所有学生的信息，先按性别升序排序，同时按性别降序排序。

~~~sql:no-line-numbers
SELECT * FROM student ORDER BY gender ASC, age DESC;
~~~

    +-------+------+--------+
    | name  | age  | gender |
    +-------+------+--------+
    | Faith |   21 | F      |
    | Emma  |   20 | F      |
    | Chloe |   19 | F      |
    | Alice |   20 | M      |
    | Brian |   20 | M      |
    | David |   18 | M      |
    +-------+------+--------+
