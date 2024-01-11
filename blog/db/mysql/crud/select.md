---
title: 查询记录
date: 2023-12-22
isOriginal: true
icon: "/icon/db_mysql_post.svg"
category:
  - MySQL
tag:
  - SQL
excerpt: 从数据表中查询记录
order: 2
---

## SELECT关键字

关键字 `SELECT` 可以用于选择列名，`FROM` 关键字后接要查询的表。

~~~sql:no-line-numbers
SELECT field1, field2, ...
FROM table_name
[WHERE condition]
[ORDER BY field [ASC|DESC]]
[LIMIT number];
~~~

::: info 参数说明

- `field..`：列属性名称。设为 `*` 表示选择所有列。
- `table_name`：数据表名称。
- `condition`：指定筛选条件。

:::

## 查看记录示例

以上面的 `student` 表举例，查询之前插入的记录。

查看所有学生的信息。

~~~sql:no-line-numbers
SELECT * FROM student;
~~~

| name | age | gender | birthday |
| :-: | :-: | :-: | :-: |
| 张三 | 18 | 男 | 2003-06-01 |
| 李四 | 19 | 女 | NULL |
| 王五 | 20 | 男 | NULL |
| 赵六 | 21 | 女 | NULL |
| 孙七 | 20 | 男 | NULL |
| 周八 | 20 | 女 | NULL |

查看所有男生的信息。

~~~sql:no-line-numbers
SELECT * FROM student WHERE gender='男';
~~~

| name | age  | gender | birthday |
| :-: | :-: | :-: | :-: |
| 张三 | 18 | 男 | 2003-06-01 |
| 王五 | 20 | 男 | NULL |
| 孙七 | 20 | 男 | NULL |

查看年龄大于 `19` 的学生的姓名和年龄。

~~~sql:no-line-numbers
SELECT name,age FROM student WHERE age>19;
~~~

| name | age |
| :-: | :-: |
| 王五 | 20 |
| 赵六 | 21 |
| 孙七 | 20 |

查看所有女生的信息，按年龄排序。

~~~sql:no-line-numbers
SELECT * FROM student WHERE gender='女' ORDER BY age;
~~~

| name | age | gender | birthday |
| :-: | :-: | :-: | :-: |
| 李四 | 19 | 女 | NULL |
| 周八 | 20 | 女 | NULL |
| 赵六 | 21 | 女 | NULL |

查看年龄最小的前 $3$ 位学生的信息。

~~~sql:no-line-numbers
SELECT * FROM student ORDER BY age LIMIT 3;
~~~

| name | age  | gender | birthday   |
| :-: | :-: | :-: | :-: |
| 张三 |   18 | 男     | 2003-06-01 |
| 李四 |   19 | 女     | NULL       |
| 周八 |   19 | 女     | NULL       |
