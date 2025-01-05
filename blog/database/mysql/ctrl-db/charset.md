---
title: 字符集和校验规则
date: 2023-12-20
isOriginal: true
icon: section
category:
  - MySQL
tag:
  - SQL
excerpt: MySQL支持的字符集和校验规则
order: 2
---

## MySQL字符集

在MySQL中，字符集（Character Set）用于定义存储和处理文本数据的字符编码规则。字符集决定了 `MySQL` 如何解释和处理不同字符的存储和比较操作。它对于确保数据的正确性、一致性和可移植性非常重要。

在创建数据库时，如果不指定字符集和校验规则，那么 `MySQL` 会帮我们自动选择默认的字符集和校验规则。

查看默认的字符集。

~~~sql:no-line-numbers
SHOW variables LIKE 'character_set_database';
~~~

    +------------------------+---------+
    | Variable_name          | Value   |
    +------------------------+---------+
    | character_set_database | utf8mb4 |
    +------------------------+---------+

查看默认的校验规则。

~~~sql:no-line-numbers
SHOW variables LIKE 'collation_database';
~~~

    +--------------------+--------------------+
    | Variable_name      | Value              |
    +--------------------+--------------------+
    | collation_database | utf8mb4_0900_ai_ci |
    +--------------------+--------------------+

查看当前支持的所有字符集。

~~~sql:no-line-numbers
SHOW charset;
~~~

查看当前支持的所有校验规则。

~~~sql:no-line-numbers
SHOW collation;
~~~

::: details MySQL8.0支持的所有字符集

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

:::

## 指定字符集和校验规则

创建一个名为 `mydb` 的数据库，字符集为 `gbk`，校验规则为 `gbk_chinese_ci`。

~~~sql:no-line-numbers
CREATE DATABASE mydb DEFAULT CHARACTER SET gbk COLLATE gbk_chinese_ci;
~~~

这里的 `DEFAULT CHARACTER SET` 也可以简写为 `CHARSET`。

~~~sql:no-line-numbers
CREATE DATABASE mydb CHARSET gbk COLLATE gbk_chinese_ci;
~~~

查看创建结果。

~~~sql:no-line-numbers
SHOW CREATE DATABASE mydb\G
~~~

    *************************** 1. row ***************************
        Database: mydb
    Create Database: CREATE DATABASE `mydb` /*!40100 DEFAULT CHARACTER SET gbk */ /*!80016 DEFAULT ENCRYPTION='N' */
