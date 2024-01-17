---
title: 登录MySQL
date: 2023-12-19
isOriginal: true
icon: "/icon/db_mysql_post.svg"
category:
  - MySQL
tag:
  - 数据库
excerpt: 登录到MySQL
order: 1
---

本系列的 `MySQL` 使用目前（2023.12）最新的 8.0.35 版本，在 Ubuntu 23.10 上，可以直接安装该版本。

~~~bash:no-line-numbers
sudo apt install mysql-server mysql-client
~~~

`MySQL` 数据库系统采用了C/S架构，它的服务端是一个网络服务器，负责管理和处理数据库的存储、查询和事务处理等任务。`MySQL` 服务端接收来自客户端的请求，并执行相应的操作。

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
