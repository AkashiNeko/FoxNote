---
title: 进程的优先级
date: 2022-08-21
isOriginal: true
icon: section
category:
  - Linux
tag:
  - 进程
  - 优先级
excerpt: 优先级是指在多任务系统中，为了决定进程或线程在竞争CPU时间时的相对权重和执行顺序而设定的相对值或级别。
order: 6
---

进程的优先级指的是，操作系统调度进程时，给予每个进程的优先顺序。优先级较高的进程在竞争有限系统资源时，更有可能被调度执行。

在Linux系统中，进程的优先级是通过Nice值来表示的。Nice值是一个整数，范围通常是从-20到+19，其中-20表示最高优先级，+19表示最低优先级。

Nice值越低，进程的优先级越高。通常，普通用户的进程的Nice值范围是0到+19，而具有超级用户权限（root）的进程可以使用负值，即-20到-1。

编译运行下面的代码，使用 `ps -al` 命令查看进程的优先级。

~~~c
#include <stdio.h>
#include <unistd.h>

int main() {
    while (1) {
        printf("hello\n");
        sleep(1);
    }
    return 0;
}
~~~

~~~text:no-line-numbers
$ ps -al
F S   UID     PID    PPID  C PRI  NI ADDR SZ WCHAN  TTY          TIME CMD
0 S  1000    6823    6218  0  80   0 -   664 hrtime pts/4    00:00:00 main
~~~

命令输出了程序的 `PRI` 和 `NI` 值，`PRI`（priority）表示的是程序的优先级，`NI`（nice）是优先级的修改数值（偏移量），`PRI` 的默认值为80。`PRI` 的值越小，表示优先级越高。

可以使用 `renice` 命令修改进程的优先级。

~~~text:no-line-numbers
$ renice 10 -p 6823
6823 (process ID) 旧优先级为 0，新优先级为 10

$ ps -al
F S   UID     PID    PPID  C PRI  NI ADDR SZ WCHAN  TTY          TIME CMD
0 S  1000    6823    6218  0  90  10 -   664 hrtime pts/4    00:00:00 main
~~~

将 `NI` 值从0改成10，那么 `PRI` 会变为 80 + 10 = 90。

如果要将 `NI` 改为负值，则需要 `root` 权限。

~~~text:no-line-numbers
$ renice -10 -p 6823 # 直接设置
renice: 设置 6823 的优先级失败(process ID): 权限不够

$ sudo renice -10 -p 6823 # 使用root权限
6823 (process ID) 旧优先级为 10，新优先级为 -10

$ ps -al
F S   UID     PID    PPID  C PRI  NI ADDR SZ WCHAN  TTY          TIME CMD
0 S  1000    6823    6218  0  70 -10 -   664 hrtime pts/4    00:00:00 main
~~~

将 `NI` 值从0改成-10，那么 `PRI` 会变为 80 + (-10) = 70。

`NI` 的取值范围是-20到19，不能超出这个范围。

~~~text:no-line-numbers
$ sudo renice -20 -p 6823
6823 (process ID) 旧优先级为 -10，新优先级为 -20

$ sudo renice -21 -p 6823 # 无法设为小于-20的值
6823 (process ID) 旧优先级为 -20，新优先级为 -20

$ renice 19 -p 6823
6823 (process ID) 旧优先级为 -20，新优先级为 19

$ renice 20 -p 6823 # 无法设为大于19的值
6823 (process ID) 旧优先级为 19，新优先级为 19
~~~
