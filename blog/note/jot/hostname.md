---
title: Linux修改主机名
date: 2024-03-24
isOriginal: true
icon: section
category:
  - Note
excerpt: 临时修改和永久修改
---

主机名配置文件保存于 `/etc/hostname` 文件中。

除了直接修改该文件，还可以使用 `hostnamectl` 命令：

~~~bash
sudo hostnamectl set-hostname <新名字>
~~~

重新登录后生效。

临时修改，重启后失效：

~~~bash
sudo hostname <新名字>
~~~
