---
title: 列属性和约束
date: 2023-12-24
isOriginal: true
icon: "/icon/db_mysql_post.svg"
category:
  - 数据库
tag:
  - MySQL
  - 主键
  - 外键
  - 唯一键
excerpt: 列属性和约束是用于定义和限制列的特性和行为的元素，确保数据的完整性和一致性。
order: 6
---

## 1. 默认值约束

::: info 默认值约束

默认值约束（Default Value Constraint）用于在插入记录未提供值时，使用默认值填充。默认值约束有助于确保数据的完整性。

:::

### 设置默认值

关键字 `DEFAULT` 可以为列设置默认值约束。如果在插入记录时未指定该列的值，则会自动使用该默认值填充。下面的示例中，给 `age` 列赋予默认值 `18`。

~~~sql {3}
CREATE TABLE student1 (
    name varchar(64),
    age int DEFAULT 18
);
INSERT INTO student1 (name,age) VALUES ('张三',20);
INSERT INTO student1 (name) VALUES ('李四'),('王五');
~~~

~~~text:no-line-numbers
mysql> SELECT * FROM student1;
+------+------+
| name | age  |
+------+------+
| 张三 |   20 |
| 李四 |   18 |
| 王五 |   18 |
+------+------+
~~~

可以发现 `age` 列设置默认值后，在省略列的情况下，它使用了默认值 `18`。

使用 `DESC` 关键字查看表结构。

~~~text:no-line-numbers
mysql> DESC student1;
+-------+-------------+------+-----+---------+-------+
| Field | Type        | Null | Key | Default | Extra |
+-------+-------------+------+-----+---------+-------+
| name  | varchar(64) | YES  |     | NULL    |       |
| age   | int         | YES  |     | 18      |       |
+-------+-------------+------+-----+---------+-------+
~~~

在 `Default` 列中，可以看到每一列的默认值，没有设置默认值的列为 `NULL`。

## 2. 非空约束

::: info 非空约束

非空约束（NOT NULL Constraint）用于确保数据库表中的列不接受 `NULL` 值。当为列添加非空约束后，该列在插入或更新数据时必须提供一个非空值。

:::

### 添加非空约束

关键字 `NOT NULL` 可以为列设置非空约束，防止在插入或更新数据时将 `NULL` 值赋给该列。下面的示例中，给 `name` 列加上非空约束，防止它接受一个 `NULL` 值。

~~~sql {2}
CREATE TABLE student2 (
    name varchar(64) NOT NULL,
    age int DEFAULT 18
);

INSERT INTO student2 (name,age) VALUES ('Steve', 15);
-- OK
INSERT INTO student2 (name) VALUES ('Alex');
-- OK
INSERT INTO student2 (age) VALUES (20);
-- ERROR 1364 (HY000): Field 'name' doesn't have a default value
INSERT INTO student2 (name,age) VALUES (NULL,20);
-- ERROR 1048 (23000): Column 'name' cannot be null
~~~

在插入记录时，如果省略被 `NOT NULL` 约束的列，或试图插入空数据，都是无法正常插入的。

使用 `DESC` 关键字查看表结构。

~~~text:no-line-numbers
mysql> DESC student2;
+-------+-------------+------+-----+---------+-------+
| Field | Type        | Null | Key | Default | Extra |
+-------+-------------+------+-----+---------+-------+
| name  | varchar(64) | NO   |     | NULL    |       |
| age   | int         | YES  |     | 18      |       |
+-------+-------------+------+-----+---------+-------+
~~~

在 `Null` 列中，可以看到设置了非空约束的列为 `NO`，表示该列不允许为空。

## 3. 唯一键约束

::: info 唯一键

唯一键约束（Unique Key Constraint）用于确保列中的值是唯一的。唯一键约束可以约束一个或**多个**列，用于防止重复值的插入或更新。

:::

### 设置唯一键

关键字 `UNIQUE` 或 `UNIQUE KEY` 可以为列设置唯一键约束，让该列的值相互独立。下面的示例中，将 `name` 列设为唯一键，尝试插入两个相同的 `name`。

~~~sql: {2}
CREATE TABLE student3 (
    name varchar(64) UNIQUE KEY,
    age int DEFAULT 18
);

INSERT INTO student3 (name) VALUES ('akashi');
-- OK
INSERT INTO student3 (name) VALUES ('akashi');
-- ERROR 1062 (23000): Duplicate entry 'akashi' for key 'student3.name'
~~~

可以发现在唯一键的约束下，`name` 列无法插入一个已经存在的值。

使用 `DESC` 关键字查看表结构。

~~~text:no-line-numbers
mysql> DESC student3;
+-------+-------------+------+-----+---------+-------+
| Field | Type        | Null | Key | Default | Extra |
+-------+-------------+------+-----+---------+-------+
| name  | varchar(64) | YES  | UNI | NULL    |       |
| age   | int         | YES  |     | 18      |       |
+-------+-------------+------+-----+---------+-------+
~~~

在 `Key` 列中，设有唯一键的列会显示为 `UNI`。

### 唯一键的空值

此外，唯一键约束允许空值 `NULL`，空值之间不会互相排斥，允许同时存在多个空值。

~~~sql
INSERT INTO student3 (age) VALUES (10);
INSERT INTO student3 (name,age) VALUES (NULL,10);
~~~

~~~text:no-line-numbers
mysql> SELECT * FROM student3;
+--------+------+
| name   | age  |
+--------+------+
| akashi |   18 |
| NULL   |   10 |
| NULL   |   10 |
+--------+------+
~~~

## 4. 主键约束

::: info 主键

主键约束（Primary Key Constraint）用于唯一标识数据表中的每一条记录（每一行）。主键约束要求在指定的列或列组合上具有唯一的值，并且不允许为空值 `NULL`。

:::

### 单一主键

主键约束结合了唯一键约束和非空约束的特性，用关键字 `PRIMARY KEY` 设置。

~~~sql {2}
CREATE TABLE student4 (
    name varchar(64) PRIMARY KEY,
    age int DEFAULT 18
);

INSERT INTO student4 VALUES ('张三',18),('李四',19),('王五',20);
~~~

如果一个列被设为主键，那么通过这个列可以唯一指定一条记录，而且可以保证该记录不为空。

~~~text:no-line-numbers
mysql> SELECT * FROM student4 WHERE name='张三';
+------+------+
| name | age  |
+------+------+
| 张三 |   18 |
+------+------+
~~~

~~~text:no-line-numbers
mysql> SELECT * FROM student4 WHERE name='李四';
+------+------+
| name | age  |
+------+------+
| 李四 |   19 |
+------+------+
~~~

使用 `DESC` 关键字查看表结构。

~~~text:no-line-numbers
mysql> DESC student4;
+-------+-------------+------+-----+---------+-------+
| Field | Type        | Null | Key | Default | Extra |
+-------+-------------+------+-----+---------+-------+
| name  | varchar(64) | NO   | PRI | NULL    |       |
| age   | int         | YES  |     | 18      |       |
+-------+-------------+------+-----+---------+-------+
~~~

在 `Key` 列中，设有主键的列会显示为 `PRI`。

### 主键的增删

对于一个已经存在的表，可以用下面的方式删除和添加主键。

删除表 `student4` 的主键。

~~~sql:no-line-numbers
ALTER TABLE student4 DROP PRIMARY KEY;
~~~

为表 `student4` 添加主键为 `name` 列。

~~~sql:no-line-numbers
ALTER TABLE student4 ADD PRIMARY KEY (name);
~~~

### 复合主键

`MySQL` **不允许**同时定义**多个主键**，比如：

::: caution 对于已经存在主键的表，在其他列添加主键。

~~~sql
ALTER TABLE student4 ADD PRIMARY KEY (age);
-- ERROR 1068 (42000): Multiple primary key defined
~~~

:::

::: caution 创建表时设置多个主键。

~~~sql
CREATE TABLE student (
    name varchar(64) PRIMARY KEY,
    age int DEFAULT 18 PRIMARY KEY
);
-- ERROR 1068 (42000): Multiple primary key defined
~~~

:::

然而，`MySQL` 提供了复合主键（Composite Primary Key）的概念。下面的表 `sc` 中，单独使用 `sname` 或 `cname` 作为主键都无法唯一标识一条记录，而必须用二者的组合。使用 `PRIMARY KEY (...)` 可以将多个列设为复合主键。

~~~sql {5}
CREATE TABLE sc (
    sname varchar(64) COMMENT '学生姓名',
    cname varchar(64) COMMENT '课程名称',
    score tinyint COMMENT '成绩得分',
    PRIMARY KEY (sname, cname)
);

INSERT INTO sc VALUES
('张三','语文',85),('张三','数学',97),('张三','英语',89),
('李四','语文',93),('李四','数学',86),('李四','英语',95);
~~~

~~~text:no-line-numbers
mysql> SELECT * FROM sc;
+-------+-------+-------+
| sname | cname | score |
+-------+-------+-------+
| 张三  | 数学  |    97 |
| 张三  | 英语  |    89 |
| 张三  | 语文  |    85 |
| 李四  | 数学  |    86 |
| 李四  | 英语  |    95 |
| 李四  | 语文  |    93 |
+-------+-------+-------+
~~~

复合主键使用多个列同时表示唯一记录。这些列本身允许重复值，比如 `sname` 列可以有多个重复的 `张三`，`cname` 列可有多个重复的 `语文`，但是两个列组合在一起的值都是唯一的。

## 5. 外键约束

### 什么是外键

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

### 外键应用场景

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

~~~sql
INSERT student VALUES (10001,'张三',18),(10002,'李四',19),(10003,'王五',20),(10004,'赵六',21);
INSERT course VALUES (1,'高等数学',5.0),(2,'数据结构',3.0),(3,'操作系统',4.0),(4,'数据库',3.5);
~~~

~~~text:no-line-numbers
mysql> SELECT * FROM student;
+-------+------+-----+
| sid   | name | age |
+-------+------+-----+
| 10001 | 张三 |  18 |
| 10002 | 李四 |  19 |
| 10003 | 王五 |  20 |
| 10004 | 赵六 |  21 |
+-------+------+-----+
mysql> SELECT * FROM course;
+-----+----------+--------+
| cid | name     | credit |
+-----+----------+--------+
|   1 | 高等数学 |   5.00 |
|   2 | 数据结构 |   3.00 |
|   3 | 操作系统 |   4.00 |
|   4 | 数据库   |   3.50 |
+-----+----------+--------+
~~~

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

~~~text:no-line-numbsers
mysql> SELECT * FROM sc;
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
~~~

随后，我们尝试插入一些不存在于学生表中的学生或不存在于选课表中的课程。

~~~sql
INSERT INTO sc VALUES (10012,1,90);
-- ERROR 1452 (23000): Cannot add or update a child row: a foreign key constraint fails (`mydb`.`sc`, CONSTRAINT `sc_ibfk_1` FOREIGN KEY (`sid`) REFERENCES `student` (`sid`))
INSERT INTO sc VALUES (10001,10,90);
-- ERROR 1452 (23000): Cannot add or update a child row: a foreign key constraint fails (`mydb`.`sc`, CONSTRAINT `sc_ibfk_2` FOREIGN KEY (`cid`) REFERENCES `course` (`cid`))
~~~

可以发现，由于外键约束的存在，`MySQL` 拒绝了这些不合法记录的插入。

### 外键的作用

外键用于建立表与表之间的关系和连接。通过引用其他表的主键或唯一键，外键实现了数据之间的关联性。这种关联性使得在多个表之间进行查询和操作更加方便和有效。

::: info 外键约束的作用

- **维护数据一致性**：外键约束强制要求引用表中的外键值必须是被引用表中的主键或唯一键值。这样可以避免在引用表中插入或更新引用值不存在的情况，保持数据的一致性。

- **保证数据完整性**：防止在删除引用表中的行时，引用表中的关联行变为孤立的情况。通过定义级联操作，可以自动对相关的引用行进行相应的操作，如级联删除或级联更新。

:::
