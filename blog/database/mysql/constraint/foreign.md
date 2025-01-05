---
title: 外键约束
date: 2023-12-24
isOriginal: true
icon: section
category:
  - MySQL
tag:
  - 约束
excerpt: 表的外键约束（Foreign Key）
order: 5
---

## 什么是外键

当多个表之间存在关联关系时，外键（Foreign Key）用于建立这些表之间的引用和关系。外键是指一个表中的列，其值对应于**另一个表的主键或唯一键**的值。

~~~sql {9}
CREATE TABLE table1 (
    field1 datatype PRIMARY KEY,
    field2 datatype,
);

CREATE TABLE table2 (
    field3 datatype PRIMARY KEY,
    field4 datatype,
    FOREIGN KEY (field3) REFERENCES table1(field1)
);
~~~

在上面的表 `table2` 中，`field3` 的值必须来自表 `table1` 中 `field1` 的值，否则无法添加记录。同时，因为表 `table2` 中需要引用表 `table1` 的数据，如果要删除表 `table1`，就必须先删除表 `table2`。

## 外键应用场景

假设有一个记录学生选课的场景：学生们有自己的学号、姓名、年龄等属性，课程也有自己的课程号、课程名、学分等属性。每个学生可以选多门课，每门课也可以被多个学生选，同时，每个学生选的每门课都有一个成绩。

我们可以建立以下的学生表 `student` 和课程表 `course`，学生表以学号 `sid` 作为主键，课程表以课程号 `cid` 作为主键。

~~~sql {2,8}
CREATE TABLE IF NOT EXISTS student (
    sid int PRIMARY KEY COMMENT '学号（Student ID）',
    name varchar(64) NOT NULL COMMENT '姓名',
    age int NOT NULL COMMENT '年龄'
);

CREATE TABLE IF NOT EXISTS course (
    cid int PRIMARY KEY COMMENT '课程号（Course ID）',
    name varchar(128) NOT NULL COMMENT '课程名',
    credit float(3,1) NOT NULL COMMENT '学分'
);
~~~

插入一些测试数据。

~~~sql:no-line-numbers
INSERT student VALUES (10001,'张三',18),(10002,'李四',19),(10003,'王五',20),(10004,'赵六',21);
~~~

| sid | name | age |
| :-: | :-: | :-: |
| 10001 | 张三 | 18 |
| 10002 | 李四 | 19 |
| 10003 | 王五 | 20 |
| 10004 | 赵六 | 21 |

~~~sql:no-line-numbers
INSERT course VALUES (1,'高等数学',5.0),(2,'数据结构',3.0),(3,'操作系统',4.0),(4,'数据库',3.5);
~~~

| cid | name | credit |
| :-: | :-: | :-: |
|  1 | 高等数学 | 5.00 |
|  2 | 数据结构 | 3.00 |
|  3 | 操作系统 | 4.00 |
|  4 | 数据库 | 3.50 |

接下来，我们建立学生的选课成绩表 `sc`，它以学号 `sid` 和课程号 `cid` 作为复合主键。

由于 `sc` 表中的 `sid` 来自学生表中的学号，`cid` 来自课程表中的课程号，因此，可以将二者设为外键，以保证 `sc` 表中的学生都是存在于学生表中的，课程都是存在于课程表中的。

~~~sql {5-6}
CREATE TABLE IF NOT EXISTS sc (
    sid int COMMENT '学号',
    cid int COMMENT '课程号',
    grade tinyint COMMENT '成绩',
    FOREIGN KEY (sid) REFERENCES student(sid),
    FOREIGN KEY (cid) REFERENCES course(cid),
    PRIMARY KEY (sid,cid)
);
~~~

现在，尝试向 `sc` 表中插入一些记录。

~~~sql
-- 同一个学生选不同课 OK
INSERT INTO sc VALUES (10001,1,95),(10001,2,93),(10001,3,96);
-- 不同学生选同一门课 OK
INSERT INTO sc VALUES (10002,2,90),(10003,2,92),(10004,2,97);
~~~

~~~sql:no-line-numbsers
SELECT * FROM sc;
~~~

    +-------+-----+-------+
    | sid   | cid | grade |
    +-------+-----+-------+
    | 10001 |   1 |    95 |
    | 10001 |   2 |    93 |
    | 10001 |   3 |    96 |
    | 10002 |   2 |    90 |
    | 10003 |   2 |    92 |
    | 10004 |   2 |    97 |
    +-------+-----+-------+

随后，我们尝试插入一些不存在于学生表中的学生或不存在于选课表中的课程。

~~~sql
INSERT INTO sc VALUES (10012,1,90);
-- ERROR 1452 (23000): Cannot add or update a child row: a foreign key constraint fails (`mydb`.`sc`, CONSTRAINT `sc_ibfk_1` FOREIGN KEY (`sid`) REFERENCES `student` (`sid`))
INSERT INTO sc VALUES (10001,10,90);
-- ERROR 1452 (23000): Cannot add or update a child row: a foreign key constraint fails (`mydb`.`sc`, CONSTRAINT `sc_ibfk_2` FOREIGN KEY (`cid`) REFERENCES `course` (`cid`))
~~~

可以发现，由于外键约束的存在，`MySQL` 拒绝了这些不合法记录的插入。

## 外键的作用

外键用于建立表与表之间的关系和连接。通过引用其他表的主键或唯一键，外键实现了数据之间的关联性。这种关联性使得在多个表之间进行查询和操作更加方便和有效。

::: info 外键约束的作用

- **维护数据一致性**：外键约束强制要求引用表中的外键值必须是被引用表中的主键或唯一键值。这样可以避免在引用表中插入或更新引用值不存在的情况，保持数据的一致性。

- **保证数据完整性**：防止在删除引用表中的行时，引用表中的关联行变为孤立的情况。通过定义级联操作，可以自动对相关的引用行进行相应的操作，如级联删除或级联更新。

:::
