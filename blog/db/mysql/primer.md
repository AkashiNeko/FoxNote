---
title: 数据库入门
date: 2023-12-19
isOriginal: true
icon: "/icon/db_mysql_post.svg"
category:
  - 数据库
tag:
  - MySQL
excerpt: 数据库是用于存储、管理和组织数据的软件，提供了数据的持久化存储、高效的数据访问和处理功能，广泛应用于各种领域。
order: 1
---

## 1. 什么是数据库

### 文件存储

数据可以存储在文件中，为什么还需要数据库呢？文件存储虽然方便，但是有以下的缺点。

::: info 文件存储的缺点

1. 文件存储通常是平面的，没有明确的数据结构，导致数据的访问和查询困难。
2. 数据以文件的形式存储在磁盘上。当多个程序需要访问和修改同一份数据时，可能会导致数据的冗余和不一致。
3. 缺乏对数据的安全性和权限控制。用户可以直接访问文件系统上的数据文件，无法限制数据的访问权限。
4. 当需要添加新的数据或修改现有的数据结构时，可能需要对文件进行复杂的操作，这会导致数据的维护困难。

:::

### 数据库的历史

数据库技术的发展一直在不断演进，以适应不断变化的数据需求和技术挑战。数据库的发展历史可以大致分为以下几个阶段。

1. **文件系统**：在计算机科学的早期阶段，数据以文件的形式存储在磁带或磁盘上。应用程序通过文件系统来管理和访问数据。然而，文件存储有之前所说的诸多缺点。

2. **层次数据库模型**：在1960年代，IBM提出了层次数据库模型。使用树状结构组织数据，其中每个节点都可以包含多个子节点，但每个节点只能有一个父节点。这种模型有效地解决了某些文件系统的限制，但它对数据的组织和查询有一定的限制。

3. **网状数据库模型**：在层次数据库模型之后，出现了网状数据库模型。网状数据库模型允许任意节点之间的关联，通过使用指针来实现。这种模型更加灵活，但仍然存在复杂的数据组织和查询难题。

4. **关系型数据库模型**：在1970年代，Edgar F. Codd 提出了关系型数据库模型的概念。这一模型基于关系代数和集合理论，将数据表示为二维表格（关系），并使用结构化查询语言（SQL）进行数据管理和查询。关系型数据库模型具有简洁的结构和严格的数据完整性，成为最流行的数据库模型之一。本节介绍的MySQL就是一种关系型数据库。

5. **非关系型数据库**：随着互联网的发展和大数据的兴起，非关系型数据库（NoSQL）出现了。NoSQL数据库是一类不使用传统关系型表格的数据库管理系统，它们更加灵活，适用于处理大规模、非结构化和分布式数据。

### 主流的数据库

目前有各种各样的流行的数据库，以下是一些主流的数据库 [[wiki]](https://zh.wikipedia.org/wiki/%E6%95%B0%E6%8D%AE%E5%BA%93)。

::: info 关系型数据库

[**MySQL**](https://www.mysql.com/)：广泛使用的关系型数据库，适用于中小型企业和Web应用程序。它可以处理大量的事务处理和并发用户，并支持各种应用程序的开发。

[**Microsoft SQL Server**](https://www.microsoft.com/sql-server/)：微软的关系型数据库管理系统，适用于Windows环境下的企业应用程序。它提供了广泛的功能集，包括高性能数据处理、商业智能和数据分析。

[**Oracle Database**](https://www.oracle.com/database/)：功能强大的关系型数据库管理系统，适用于大型企业应用程序和数据密集型场景，如金融、电信和供应链管理。

[**PostgreSQL**](https://www.postgresql.org/)：一种强大的开源关系型数据库，适用于各种应用程序和规模。提供了高级的数据完整性和一致性控制，适合于数据安全性要求较高的场景。

[**SQLite**](https://www.sqlite.org/)：开源的嵌入式关系型数据库管理系统，以其简单易用和零配置而受到广泛欢迎。与传统的C/S模型不同，SQLite 不需要独立的服务器进程，而是直接将数据库存储在单个文件中。

:::

::: info 非关系型数据库（NoSQL）

[**MongoDB**](https://www.mongodb.com/)：一个流行的文档数据库，适用于处理大量非结构化和半结构化数据。适用于Web应用程序、日志记录和实时分析等场景。

[**Redis**](https://redis.io/)：快速的键值存储数据库，适用于缓存、会话管理和实时数据处理等场景。它也可以用作消息队列和发布以及订阅系统。

[**Cassandra**](https://cassandra.apache.org/)：一种高度可扩展的分布式列族数据库，适用于需要大规模数据存储和高吞吐量的应用程序，如物联网（IoT）和实时分析。

[**Neo4j**](https://neo4j.com/)：一种图数据库，适用于处理复杂的关系网络和图结构数据。它在社交网络分析、推荐系统和知识图谱等领域具有广泛的应用。

:::

## 2. 数据库的使用

本系列的 `MySQL` 使用目前（2023.12）最新的 8.0.35 版本，在 Ubuntu 23.10 上，使用 `apt` 命令可以直接安装该版本。

~~~bash:no-line-numbers
sudo apt install mysql-server mysql-client
~~~

### 登录到MySQL

`MySQL` 数据库系统采用了 `C/S` 架构，它的服务端是一个网络服务器，负责管理和处理数据库的存储、查询和事务处理等任务。`MySQL` 服务端接收来自客户端的请求，并执行相应的操作。

启动 `MySQL` 服务后，使用 `netstat` 命令可以查询到它正在监听 `3306` 端口，这是 `MySQL` 的默认网络通信端口。

~~~text:no-line-numbers
$ sudo systemctl start mysql
$ netstat -ntl | grep 3306
tcp    0    0 0.0.0.0:3306    0.0.0.0:*    LISTEN
~~~

使用 `mysql` 命令登录，连接到 `MySQL` 服务端。`mysql` 命令有下面几个常见的选项。

::: info mysql命令的选项

- `-u`：后接指定的用户名。
- `-p`：指定登录密码，建议不要将密码明文输入在命令中。
- `-h`：指定服务端的 `host`，默认为 `127.0.0.1`。
- `-P`：指定服务端的端口，默认为 `3306`。
- `--help`：查看命令帮助。

:::

我们用 `root` 用户登录到 `MySQL`。

~~~text:no-line-numbers
$ mysql -u root -p
Enter password:
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 11
Server version: 8.0.35-0ubuntu0.23.10.1 (Ubuntu)

Copyright (c) 2000, 2023, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql>
~~~

### SQL语句示例

成功登录到一个可交互的界面后，就可以开始用 `SQL` 语句和 `MySQL` 进行交互了。

下面用 `SQL` 语句简单地创建一个数据库 `mydb`，在其中的表 `user` 中插入一条记录。

~~~sql
create database mydb;
use mydb;
create table user (name char(20), age int, birthday date);
insert into user (name, age, birthday) values ('akashi', '20', '2004-01-01');
~~~

需要注意的是，标准的 `SQL` 语句需要以 `;` 结尾，`mysql` 命令的交互界面支持换行输入。

~~~text:no-line-numbers
mysql> create database mydb;
Query OK, 1 row affected (0.00 sec)

mysql> use mydb;
Database changed
mysql> create table user (
    -> name char(20),
    -> age int,
    -> birthday date
    -> );
Query OK, 0 rows affected (0.02 sec)

mysql> show tables;
+----------------+
| Tables_in_mydb |
+----------------+
| user           |
+----------------+
1 row in set (0.00 sec)

mysql> insert into user (name, age, birthday) values ('akashi', '20', '2004-01-01');
Query OK, 1 row affected (0.01 sec)

mysql> select * from user;
+--------+------+------------+
| name   | age  | birthday   |
+--------+------+------------+
| akashi |   20 | 2004-01-01 |
+--------+------+------------+
1 row in set (0.00 sec)
~~~

### MySQL的库和表

**数据库**和**数据表**是 `MySQL` 中的重要概念。它们的关系是：一个 `MySQL` 服务器可以包含多个数据库，一个数据库可以包含多个数据表。

![MySQL数据库和数据表](/inset/MySQL数据库和数据表.svg)
