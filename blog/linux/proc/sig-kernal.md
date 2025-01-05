---
title: 信号的内核结构
date: 2022-09-07
isOriginal: true
icon: section
category:
  - Linux
tag:
  - IPC
  - 信号
  - pending
excerpt: Linux中的进程信号是一种用于进程间通信的机制，它允许一个进程向另一个进程发送通知。
order: 17
---

下面是Linux内核 `task_struct` 中进程信号相关的字段。

~~~c
struct task_struct {
    ...
    /* Signal handlers: */
    struct signal_struct        *signal;
    struct sighand_struct __rcu *sighand;
    sigset_t                    blocked;
    sigset_t                    real_blocked;
    /* Restored if set_restore_sigmask() was used: */
    sigset_t                    saved_sigmask;
    struct sigpending           pending;
    ...
}
~~~

## 1. 信号回调函数

用 `signal()` 注册的信号处理函数，会被存储在 `sighand_struct` 结构体的 `action` 数组中，该数组存储了每个信号对应的回调操作。`__sighandler_t` 即是回调函数的类型 `void(int)`。

~~~c{5,9,15,20-21}
struct sighand_struct {
    spinlock_t          siglock;
    refcount_t          count;
    wait_queue_head_t   signalfd_wqh;
    struct k_sigaction  action[_NSIG];
};
...
struct k_sigaction {
    struct sigaction sa;
    ...
};
...
struct sigaction {
    ...
    __sighandler_t   sa_handler;
    unsigned long    sa_flags;
    ...
};
...
typedef void __signalfn_t(int);
typedef __signalfn_t __user *__sighandler_t;
~~~

## 2. 信号集 sigset_t

`sigset_t` 是一个位图结构，它用二进制的 0 和 1 标记信号是否有效。

~~~c{6-8}
#define __BITS_PER_LONG 64
...
#define _NSIG_BPW   __BITS_PER_LONG
#define _NSIG_WORDS (_NSIG / _NSIG_BPW)
...
typedef struct {
    unsigned long sig[_NSIG_WORDS];
} sigset_t;
~~~

`signal.h` 中提供了对该位图数据结构的操作方法。

~~~c
#include <signal.h>

int sigemptyset(sigset_t *set);                     // 将位图所有位复位为0
int sigfillset(sigset_t *set);                      // 将位图所有位置位位1
int sigaddset(sigset_t *set, int signum);           // 将signum信号设为有效（置位）
int sigdelset(sigset_t *set, int signum);           // 将signum信号设为无效（复位）
int sigismember(const sigset_t *set, int signum);   // 判断位图中signum信号是否有效
~~~

## 3. 待决信号集 pending

`pending` 是一个链表结构，记录了已经发送给进程但尚未处理的信号集。

~~~c
struct sigpending {
    struct list_head list;
    sigset_t signal;
};
...
struct list_head {
    struct list_head *next, *prev;
};
~~~

当进程接收到一个信号时，内核会将该信号添加到进程的挂起信号列表中，也就是将信号添加到 `pending` 链表中。这意味着该信号已经到达进程，但尚未被处理。

系统调用 `sigpending()` 可以获取当前进程的待决信号集 `pending`。

~~~c
#include <signal.h>

int sigpending(sigset_t *set);
~~~

当进程在处理一个信号时，如果另一个相同类型的信号到达，则该信号会被合并到挂起信号列表中，而不是立即触发新的信号处理。这样可以避免在短时间内多次触发相同类型的信号处理函数，从而提高效率。

## 4. 阻塞信号集 block

进程可以选择阻塞（block）某些信号，以防止它们被递送到进程。当信号被阻塞时，它们仍然会到达进程，但会被暂时挂起，直到解除阻塞为止。

进程可以使用系统调用 `sigprocmask()` 来获取或修改当前的进程屏蔽字。

~~~c
#include <signal.h>

/* Prototype for the glibc wrapper function */
int sigprocmask(int how, const sigset_t *_Nullable restrict set,
                           sigset_t *_Nullable restrict oldset);
~~~

如果 `set` 传入非空指针，它将会作为输入参数，改变进程当前的阻塞信号集为 `set`。当 `oldset` 传入非空指针时，它将作为输出参数，返回当前或修改前的阻塞信号集。

参数 `how` 指示了如何操作信号集。

::: info 参数how的取值

我们用 `block` 表示当前进程的阻塞信号集合。

- `SIG_BLOCK`：The set of blocked signals is the union of the current set and the set argument.

~~~txt:no-line-numbers
取并集：block |= set
~~~

- `SIG_UNBLOCK`：The signals in set are removed from the current set of blocked signals. It is permissible to attempt to unblock a signal which is not blocked.

~~~txt:no-line-numbers
移除：block &= ~set
~~~

- `SIG_SETMASK`：The set of blocked signals is set to the argument set.

~~~txt:no-line-numbers
直接替换：block = set
~~~

:::

## 5. 示例代码

我们可以编写以下的代码直观地感受信号是如何被阻塞的。

~~~cpp
#include <signal.h>
#include <iostream>

// 打印一个信号集
void print_sigset(sigset_t& sigset) {
    std::cout << "pending: [";
    const char* split = "";
    for (size_t i = 1; i < NSIG; ++i) {
        if (sigismember(&sigset, i)) {
            std::cout << split << i;
            split = ",";
        }
    }
    std::cout << "]" << std::endl;
}

int main() {
    // 阻塞所有信号
    sigset_t sigset;
    sigfillset(&sigset);
    sigprocmask(SIG_BLOCK, &sigset, nullptr);

    // 轮询检查pending信号集
    while (true) {
        sigset_t pending;
        sigpending(&pending);
        print_sigset(pending);
        sleep(1);
    }
    return 0;
}
~~~

编译运行代码。尝试按下 `CTRL` + `C` 以及 `CTRL` + `L`。（你需要使用 `kill` 命令发送 `SIGKILL` 信号来结束这个进程）

~~~txt:no-line-numbers
$ ./main 
pending: []
pending: []
^Cpending: [2]
pending: [2]
^\pending: [2,3]
pending: [2,3]
pending: [2,3]
...
~~~

可以发现，由于信号被阻塞了，所以待决信号集中出现了我们发送的信号。

我们也可以尝试在其他终端下使用 `kill` 命令发送其他信号。

~~~bash:no-line-numbers
kill -11 $(pidof main)
kill -45 $(pidof main)
kill -14 $(pidof main)
~~~

~~~txt:no-line-numbers
...
pending: [2,3]
...
pending: [2,3,11]
...
pending: [2,3,11,45]
...
pending: [2,3,11,14,45]
~~~

当信号解除阻塞时，`pending` 中待决的信号会立即被处理。我们可以在上面代码的死循环中加入以下内容，让其在第5次循环时解除所有信号的阻塞。

~~~cpp{3,8-12}
...
    // 轮询检查pending信号集
    size_t cnt = 0;
    while (true) {
        sigset_t pending;
        sigpending(&pending);
        print_sigset(pending);
        // 第五次循环时解除所有阻塞
        if (++cnt == 5) {
            std::cout << "解除阻塞" << std::endl;
            sigprocmask(SIG_UNBLOCK, &sigset, nullptr);
        }
        sleep(1);
    }
...
~~~

编译运行代码，在程序开始运行后的5秒内按下 `CTRL` + `C` 或 `CTRL` + `L` 发送信号，观察结果。

~~~txt:no-line-numbers
$ ./main 
pending: []
pending: []
^\pending: [3]
pending: [3]
pending: [3]
解除阻塞
退出 (核心已转储)

$ echo $?
131
~~~

我们发现，在解除阻塞之后，待决的 `SIGQUIT` 信号立刻被处理了。
