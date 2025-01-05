---
title: Redis 安装
date: 2024-04-06
isOriginal: true
icon: section
category:
  - Redis
tag:
  - Redis
excerpt: 开始使用 Redis
order: 1
---

## 1. 安装Redis

Redis 的全称是 Remote Dictionary Server，即远程字典服务器。

### 在Windows上安装

在 Windows操作系统上，可以在[Redis官网](https://redis.io/download/)上下载安装，Redis 官方提供了一个很方便的图形化客户端 [RedisInsight](https://redis.io/docs/connect/insight/)，你可以在[此处](https://redis.io/docs/connect/insight/#download-the-latest-redisinsight)下载它。

![Redis图标](/inset/Redis图标.svg =100x)

### 在Linux上安装

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

Redis 默认监听 localhost 的 6379 端口，可以在 `/etc/redis/redis.conf` 配置文件中修改。

~~~txt:no-line-numbers
$ netstat -antl | grep 6379
tcp        0      0 127.0.0.1:6379            0.0.0.0:*               LISTEN
~~~

## 2. 登录到 Redis

连接到本地 Redis 服务端。

~~~bash:no-line-numbers
redis-cli
~~~

刚安装好的 Redis，默认不需要密码即可使用。

~~~txt:no-line-numbers
$ redis-cli
127.0.0.1:6379> PING
PONG
127.0.0.1:6379>
~~~

如果需要连接远程客户端，可以使用以下参数。

~~~bash:no-line-numbers
redis-cli -h <hostname> -p <port> -a <password>
~~~

登录成功后，就可以使用命令和 Redis 服务端进行交互了。
