---
title: 键和值
date: 2024-04-07
isOriginal: true
icon: section
category:
  - Redis
tag:
  - key
excerpt: Redis客户端
order: 2
---

Redis 是一个 Key-Value 类型的数据库，每个键（Key）对应一个唯一的值（Value）。键的类型都是字符串，值可以是不同的数据类型，比如 `string`（字符串），`hash`（哈希），`list`（列表），`set`（集合）以及 `zset`（有序集合）这些基本数据类型。


~~~redis:no-line-numbers
命令名 键名 ...
~~~

比如 `SET name akashi` 这条命令，`name` 为键，`akashi` 为值，这里的值是字符串类型。

`KEYS` 命令可以用来查找符合条件的键，也可以用 `KEYS *` 查看所有存在的键。

~~~txt:no-line-numbers
127.0.0.1:6379> KEYS name
1) "name"
127.0.0.1:6379> KEYS qwq
(empty array)
127.0.0.1:6379> KEYS *
1) "name"
2) "age"
~~~

`EXISTS` 可以判断一个键或多个键是否存在，返回值为存在的键的个数。

~~~txt:no-line-numbers
127.0.0.1:6379> EXISTS qwq
(integer) 0
127.0.0.1:6379> EXISTS age
(integer) 1
127.0.0.1:6379> EXISTS age name
(integer) 2
~~~

`DEL` 命令可以用于删除一个或多个键，返回值为成功删除的键的个数。

~~~txt:no-line-numbers
127.0.0.1:6379> DEL name age
(integer) 2
~~~

以下是 Redis 键相关的命令。

| 命令 | 描述 |
| :- | :- |
| [DEL](https://redis.com.cn/commands/del.html) | 删除指定的 key |
| [DUMP](https://redis.com.cn/commands/dump.html) | 序列化给定 key ，并返回被序列化的值 |
| [EXISTS](https://redis.com.cn/commands/exists.html) | 检查给定 key 是否存在 |
| [EXPIRE](https://redis.com.cn/commands/expire.html) | 为给定 key 设置过期时间 |
| [EXPIREAT](https://redis.com.cn/commands/expireat.html) | 用于为 key 设置过期时间，接受的时间参数是 UNIX 时间戳 |
| [PEXPIRE](https://redis.com.cn/commands/pexpire.html) | 设置 key 的过期时间，以毫秒计 |
| [PEXPIREAT](https://redis.com.cn/commands/pexpireat.html) | 设置 key 过期时间的时间戳（unix timestamp），以毫秒计 |
| [KEYS](https://redis.com.cn/commands/keys.html) | 查找所有符合给定模式的 key |
| [MOVE](https://redis.com.cn/commands/move.html) | 将当前数据库的 key 移动到给定的数据库中 |
| [PERSIST](https://redis.com.cn/commands/persist.html) | 移除 key 的过期时间，key 将持久保持 |
| [PTTL](https://redis.com.cn/commands/pttl.html) | 以毫秒为单位返回 key 的剩余的过期时间 |
| [TTL](https://redis.com.cn/commands/ttl.html) | 以秒为单位，返回给定 key 的剩余生存时间 |
| [RANDOMKEY](https://redis.com.cn/commands/randomkey.html) | 从当前数据库中随机返回一个 key |
| [RENAME](https://redis.com.cn/commands/rename.html) | 修改 key 的名称 |
| [RENAMENX](https://redis.com.cn/commands/renamenx.html) | 仅当 newkey 不存在时，将 key 改名为 newkey |
| [TYPE](https://redis.com.cn/commands/type.html) | 返回 key 所储存的值的类型 |
