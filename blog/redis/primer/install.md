---
title: 安装Redis
date: 2024-04-06
isOriginal: true
icon: book
category:
  - Redis
tag:
  - Redis
excerpt: Redis的安装和使用
order: 1
---

Redis 的全称是 Remote Dictionary Server，即远程字典服务器。和 MySQL 类似，它的服务端也是一个网络服务器程序。

## 1. 在Windows上安装

在 Windows操作系统上，可以在[Redis官网](https://redis.io/download/)上下载安装，Redis 官方提供了一个很方便的图形化客户端 [RedisInsight](https://redis.io/docs/connect/insight/)，你可以在[此处](https://redis.io/docs/connect/insight/#download-the-latest-redisinsight)下载它。

![Redis图标](/inset/Redis图标.svg =100x)

## 2. 在Linux上安装

在 Linux 操作系统上，可以使用软件包管理器很方便地安装 Redis。

- Debian/Ubuntu

~~~bash:no-line-numbers
sudo apt install redis-server
~~~

- Red Hat/CentOS

~~~bash:no-line-numbers
sudo yum install redis
sudo dnf install redis
~~~

- Arch Linux

~~~bash:no-line-numbers
sudo pacman -Sy redis
~~~

- SUSE Linux

~~~bash:no-line-numbers
sudo zypper install redis
~~~

安装完成后，可以用 `systemctl` 管理 Redis 服务器。

~~~bash:no-line-numbers
sudo systemctl status redis-server.service # 查看 Redis 的状态
sudo systemctl start redis-server.service  # 启动 Redis 服务
sudo systemctl stop redis-server.service   # 停止 Redis 服务
~~~
