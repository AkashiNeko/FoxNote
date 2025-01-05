---
title: 创建数据库
date: 2023-12-20
isOriginal: true
icon: section
category:
  - MySQL
tag:
  - SQL
excerpt: 创建MySQL数据库
order: 1
---

## 创建库语法

创建数据库需要用到 `CREATE` 和 `DATABASE` 两个关键字，同时可以加上一些附加选项。

~~~sql:no-line-numbers
CREATE DATABASE [IF NOT EXISTS] db_name
[CHARACTER SET charset_name] [COLLATE collation_name];
~~~

::: info 参数说明

- `db_name`：要创建的数据库名称。
- `charset_name`：字符集名称。
- `collation_name`：校验规则名称。

:::

其中 `[]` 中的内容表示可选语句，可以不添加。比如 `IF NOT EXISTS` 语句，如果添加该语句表示仅当要创建的数据库不存在时才创建。

## 创建库示例

创建一个名为 `mydb` 的数据库。

~~~sql:no-line-numbers
CREATE DATABASE mydb;
~~~

创建一个名为 `mydb` 的数据库，如果它不存在。

~~~sql:no-line-numbers
CREATE DATABASE IF NOT EXISTS mydb;
~~~

## 查看创建结果

使用 `SHOW` 关键字查看创建结果。

~~~sql:no-line-numbers
SHOW CREATE DATABASE mydb;
~~~

    +----------+--------------------------------------------------------------------------------------------------------------------------------+
    | Database | Create Database                                                                                                                |
    +----------+--------------------------------------------------------------------------------------------------------------------------------+
    | mydb     | CREATE DATABASE `mydb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */ |
    +----------+--------------------------------------------------------------------------------------------------------------------------------+

::: info 表格显示异常问题

在交互式的客户端下，如果 `SQL` 语句以字符 `;`（或 `\g`） 结尾，那么返回的查询结果会以一个表格的形式呈现。如果返回的表格太宽，在终端上可能会不正常地换行显示，这时候可以使用 `\G` 作为 `SQL` 语句的结尾，它会将每一列拆成行进行显示。

~~~sql:no-line-numbers
SHOW CREATE DATABASE mydb\G
~~~

    *************************** 1. row ***************************
        Database: mydb
    Create Database: CREATE DATABASE `mydb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */

:::
