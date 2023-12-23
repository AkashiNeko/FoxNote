---
title: 数据库的操作
date: 2023-12-20
isOriginal: true
icon: "/icon/db_mysql_post.svg"
category:
  - 数据库
tag:
  - MySQL
  - SQL
excerpt: 数据库是MySQL最顶层的数据组织单元，它提供了逻辑和物理的隔离空间，用来存储和管理数据。
order: 2
---

## 1. 创建数据库

### 创建库语法

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

### 创建库示例

创建一个名为 `mydb` 的数据库。

~~~sql:no-line-numbers
CREATE DATABASE mydb;
~~~

创建一个名为 `mydb` 的数据库，如果它不存在。

~~~sql:no-line-numbers
CREATE DATABASE IF NOT EXISTS mydb;
~~~

### 查看创建结果

使用 `SHOW` 关键字查看创建结果。

~~~sql:no-line-numbers
SHOW CREATE DATABASE mydb;
~~~

~~~text:no-line-numbers
+----------+--------------------------------------------------------------------------------------------------------------------------------+
| Database | Create Database                                                                                                                |
+----------+--------------------------------------------------------------------------------------------------------------------------------+
| mydb     | CREATE DATABASE `mydb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */ |
+----------+--------------------------------------------------------------------------------------------------------------------------------+
~~~

::: info 表格显示异常问题

在交互式的客户端下，如果 `SQL` 语句以字符 `;`（或 `\g`） 结尾，那么返回的查询结果会以一个表格的形式呈现。如果返回的表格太宽，在终端上可能会不正常地换行显示，这时候可以使用 `\G` 作为 `SQL` 语句的结尾，它会将每一列拆成行进行显示。

~~~text:no-line-numbers
mysql> SHOW CREATE DATABASE mydb\G
*************************** 1. row ***************************
       Database: mydb
Create Database: CREATE DATABASE `mydb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */
~~~

:::

## 2. 字符集和校验规则

### MySQL字符集

在MySQL中，字符集（Character Set）用于定义存储和处理文本数据的字符编码规则。字符集决定了 `MySQL` 如何解释和处理不同字符的存储和比较操作。它对于确保数据的正确性、一致性和可移植性非常重要。

在创建数据库时，如果不指定字符集和校验规则，那么 `MySQL` 会帮我们自动选择默认的字符集和校验规则。

查看默认的字符集。

~~~sql:no-line-numbers
SHOW variables LIKE 'character_set_database';
~~~

~~~text:no-line-numbers
+------------------------+---------+
| Variable_name          | Value   |
+------------------------+---------+
| character_set_database | utf8mb4 |
+------------------------+---------+
~~~

查看默认的校验规则。

~~~sql:no-line-numbers
SHOW variables LIKE 'collation_database';
~~~

~~~text:no-line-numbers
+--------------------+--------------------+
| Variable_name      | Value              |
+--------------------+--------------------+
| collation_database | utf8mb4_0900_ai_ci |
+--------------------+--------------------+
~~~

查看当前支持的所有字符集。

~~~sql:no-line-numbers
SHOW charset;
~~~

查看当前支持的所有校验规则。

~~~sql:no-line-numbers
SHOW collation;
~~~

::: details MySQL8.0支持的所有字符集

~~~text:no-line-numbers
mysql> SHOW charset;
+----------+---------------------------------+---------------------+--------+
| Charset  | Description                     | Default collation   | Maxlen |
+----------+---------------------------------+---------------------+--------+
| armscii8 | ARMSCII-8 Armenian              | armscii8_general_ci |      1 |
| ascii    | US ASCII                        | ascii_general_ci    |      1 |
| big5     | Big5 Traditional Chinese        | big5_chinese_ci     |      2 |
| binary   | Binary pseudo charset           | binary              |      1 |
| cp1250   | Windows Central European        | cp1250_general_ci   |      1 |
| cp1251   | Windows Cyrillic                | cp1251_general_ci   |      1 |
| cp1256   | Windows Arabic                  | cp1256_general_ci   |      1 |
| cp1257   | Windows Baltic                  | cp1257_general_ci   |      1 |
| cp850    | DOS West European               | cp850_general_ci    |      1 |
| cp852    | DOS Central European            | cp852_general_ci    |      1 |
| cp866    | DOS Russian                     | cp866_general_ci    |      1 |
| cp932    | SJIS for Windows Japanese       | cp932_japanese_ci   |      2 |
| dec8     | DEC West European               | dec8_swedish_ci     |      1 |
| eucjpms  | UJIS for Windows Japanese       | eucjpms_japanese_ci |      3 |
| euckr    | EUC-KR Korean                   | euckr_korean_ci     |      2 |
| gb18030  | China National Standard GB18030 | gb18030_chinese_ci  |      4 |
| gb2312   | GB2312 Simplified Chinese       | gb2312_chinese_ci   |      2 |
| gbk      | GBK Simplified Chinese          | gbk_chinese_ci      |      2 |
| geostd8  | GEOSTD8 Georgian                | geostd8_general_ci  |      1 |
| greek    | ISO 8859-7 Greek                | greek_general_ci    |      1 |
| hebrew   | ISO 8859-8 Hebrew               | hebrew_general_ci   |      1 |
| hp8      | HP West European                | hp8_english_ci      |      1 |
| keybcs2  | DOS Kamenicky Czech-Slovak      | keybcs2_general_ci  |      1 |
| koi8r    | KOI8-R Relcom Russian           | koi8r_general_ci    |      1 |
| koi8u    | KOI8-U Ukrainian                | koi8u_general_ci    |      1 |
| latin1   | cp1252 West European            | latin1_swedish_ci   |      1 |
| latin2   | ISO 8859-2 Central European     | latin2_general_ci   |      1 |
| latin5   | ISO 8859-9 Turkish              | latin5_turkish_ci   |      1 |
| latin7   | ISO 8859-13 Baltic              | latin7_general_ci   |      1 |
| macce    | Mac Central European            | macce_general_ci    |      1 |
| macroman | Mac West European               | macroman_general_ci |      1 |
| sjis     | Shift-JIS Japanese              | sjis_japanese_ci    |      2 |
| swe7     | 7bit Swedish                    | swe7_swedish_ci     |      1 |
| tis620   | TIS620 Thai                     | tis620_thai_ci      |      1 |
| ucs2     | UCS-2 Unicode                   | ucs2_general_ci     |      2 |
| ujis     | EUC-JP Japanese                 | ujis_japanese_ci    |      3 |
| utf16    | UTF-16 Unicode                  | utf16_general_ci    |      4 |
| utf16le  | UTF-16LE Unicode                | utf16le_general_ci  |      4 |
| utf32    | UTF-32 Unicode                  | utf32_general_ci    |      4 |
| utf8mb3  | UTF-8 Unicode                   | utf8mb3_general_ci  |      3 |
| utf8mb4  | UTF-8 Unicode                   | utf8mb4_0900_ai_ci  |      4 |
+----------+---------------------------------+---------------------+--------+
~~~

:::

### 指定字符集和校验规则

创建一个名为 `mydb` 的数据库，字符集为 `gbk`，校验规则为 `gbk_chinese_ci`。

~~~sql:no-line-numbers
CREATE DATABASE mydb DEFAULT CHARACTER SET gbk COLLATE gbk_chinese_ci;
CREATE DATABASE mydb CHARSET gbk COLLATE gbk_chinese_ci;
~~~

这里的 `DEFAULT CHARACTER SET` 可以简写为 `CHARSET`。

查看创建结果。

~~~sql:no-line-numbers
SHOW CREATE DATABASE mydb\G
~~~

~~~text:no-line-numbers
*************************** 1. row ***************************
       Database: mydb
Create Database: CREATE DATABASE `mydb` /*!40100 DEFAULT CHARACTER SET gbk */ /*!80016 DEFAULT ENCRYPTION='N' */
~~~

## 3. 查看数据库

查看所有数据库。

~~~sql:no-line-numbers
SHOW DATABASES;
~~~

~~~text:no-line-numbers
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
| mydb               |
| ...                |
+--------------------+
~~~

::: tip 注意

查看数据库使用的关键字是末尾带 `S` 的 `DATABASES`，而非 `DATABASE`。

:::

查看名为 `mydb` 的数据库是否存在。

~~~sql:no-line-numbers
SHOW DATABASES LIKE 'mydb';
~~~

~~~text:no-line-numbers
+--------------------+
| Database           |
+--------------------+
| mydb               |
+--------------------+
~~~

## 4. 删除数据库

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

## 5. 使用数据库

### 使用指定关键字

关键字 `USE` 用于选择要使用的数据库。

~~~sql:no-line-numbers
USE db_name;
~~~

在实际的应用场景中，通常是对一个数据库中的某些表进行频繁操作。使用 `USE` 指定要操作的数据库，可以将多次重复输入数据库名称的步骤简化为一次。一旦选中了数据库，后续的SQL语句中就不需要再显式地指定数据库名称了。

### 查看正在使用的数据库

使用 `SELECT DATABASE()` 语句可以查看当前 `USE` 的数据库。

~~~text:no-line-numbers
mysql> SELECT database();
+------------+
| database() |
+------------+
| NULL       |
+------------+
1 row in set (0.00 sec)

mysql> USE mydb;
Database changed

mysql> SELECT database();
+------------+
| database() |
+------------+
| mydb       |
+------------+
1 row in set (0.00 sec)
~~~

### 查看所有连接

使用 `SHOW processlist` 可以查看当前连接到数据库的所有用户，以及他们当前正在使用的数据库。

~~~sql:no-line-numbers
SHOW processlist;
~~~

~~~text:no-line-numbers
+----+-----------------+---------------+------+---------+------+------------------------+------------------+
| Id | User            | Host          | db   | Command | Time | State                  | Info             |
+----+-----------------+---------------+------+---------+------+------------------------+------------------+
|  5 | event_scheduler | localhost     | NULL | Daemon  | 5782 | Waiting on empty queue | NULL             |
|  8 | akashi          | akashipc:9423 | mydb | Query   |    0 | init                   | SHOW processlist |
+----+-----------------+---------------+------+---------+------+------------------------+------------------+
~~~
