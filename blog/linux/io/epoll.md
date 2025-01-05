---
title: I/O多路转接之epoll
date: 2023-12-07
isOriginal: true
icon: section
category:
  - Linux
tag:
  - IO
  - epoll
excerpt: epoll是Linux操作系统提供的高效I/O多路复用机制，用于处理大规模并发连接的网络编程。
order: 6
star: true
---

## 1. epoll接口

### 什么是epoll

`epoll` 是 Linux（2.5.44及之后）提供的一种系统调用的接口，用于高效地监听大量文件描述符，在需要操作大量文件描述符的高并发服务器中，能够发挥优异的性能。

::: info epoll

`epoll` 的英文全称是 **Event poll**，也是虽然名字中包含 `poll`，但二者有很大的区别。`epoll` 的性能更强大，使用也更方便，可以完全取代旧的 `select` 和 `poll` 接口。

:::

### 相关的接口

`epoll` 主要使用以下三个接口，分别用于 `epoll` 的创建、控制和等待。

~~~c
#include <sys/epoll.h>

int epoll_create(int size);
int epoll_ctl(int epfd, int op, int fd, struct epoll_event* event);
int epoll_wait(int epfd, struct epoll_event* events, int maxevents, int timeout);

struct epoll_event {
    uint32_t events;      /* Epoll events */
    epoll_data_t data;    /* User data variable */
};
~~~

## 2. 接口的使用

### epoll_create 接口

~~~cpp
int epoll_create(int size);
~~~

用于创建一个 `epoll`，成功后返回一个fd，且当这个fd不再需要时，应该使用 `close()` 关闭。

::: info 参数 size

参数 `size` 在Linux2.6.8之后已弃用，可以被忽略，但是必须是一个大于0的值。

::: details NOTES 原文

**In the initial epoll_create() implementation, the size argument informed the kernel of the number of file  descriptors that the  caller  expected  to  add to the epoll instance.  The kernel used this information as a hint for the amount of space to initially allocate in internal data structures describing events.  (If ecessary, the kernel would allocate  more  space  if the  caller’s  usage  exceeded  the  hint given in size.) Nowadays, this hint is no longer required (the kernel dynamically sizes the required data structures without needing the hint), but size must still be greater than zero, in order to ensure backward compatibility when new epoll applications are run on older kernels.**

在最初的epoll_create()实现中，size参数用于告知内核调用者预期将添加到epoll实例中的文件描述符数量。内核将此信息用作初始分配给描述事件的内部数据结构的空间的提示。（如果需要，内核会根据调用者的使用情况分配更多的空间，超过了size中给出的提示）如今，不再需要这个提示（内核会动态调整所需的数据结构的大小，而不需要提示），但size仍然必须大于零，以确保在旧内核上运行新的epoll应用程序时保持向后兼容性。

:::

### epoll_ctl 接口

~~~cpp
int epoll_ctl(int epfd, int op, int fd, struct epoll_event* event);
~~~

用于对fd关注列表（interest list with fd）执行添加、修改或删除操作。

::: info 参数列表

- `epfd`：`epoll` 实例的文件描述符，即 `epoll_create()` 的返回值。
- `op`：operator，要执行的操作，有以下三种取值。
  - `EPOLL_CTL_ADD`：向fd关注列表中添加一个fd。
  - `EPOLL_CTL_MOD`：修改fd关注列表中指定fd要关注的 `event` 事件。
  - `EPOLL_CTL_DEL`：从fd关注列表中删除一个fd，忽略 `event` 参数，可以设为 `nullptr`。
- `fd`：要操作的fd。
- `event`：要关注的事件。

:::

### epoll_wait 接口

~~~cpp
int epoll_wait(int epfd, struct epoll_event* events, int maxevents, int timeout);
~~~

用于等待fd关注列表中的fd，返回fd关注列表中具有可用事件的文件描述符的信息。

::: info 参数列表

- `epfd`：`epoll` 实例的文件描述符，即 `epoll_create()` 的返回值。
- `events`：要关注的事件，是一个数组，作为输出型参数。
- `maxevents`：传入的数组的长度。`epoll_wait` 最多返回 `maxevents` 个事件。
- `timeout`：等待超时时间。和 `poll` 相同，单位为毫秒，设为-1阻塞等待，设为0立即返回。

:::

### epoll_event 结构体

~~~cpp
struct epoll_event {
    uint32_t events;      /* Epoll events */
    epoll_data_t data;    /* User data variable */
};

typedef union epoll_data {
    void *ptr;
    int fd;
    uint32_t u32;
    uint64_t u64;
} epoll_data_t;
~~~

`epoll_event` 指定了当相应fd就绪时内核应保存并返回的数据。

::: info events的取值

`EPOLLIN`：关联的文件可用于读取操作。

`EPOLLOUT`：关联的文件可用于写入操作。

`EPOLLRDHUP`：流套接字对等方关闭连接或关闭连接的写半部分。

`EPOLLPRI`：文件描述符上存在异常条件。

`EPOLLERR`：关联的文件描述符发生错误条件。

`EPOLLHUP`：关联的文件描述符发生挂断。

`EPOLLET`：请求使用边缘触发模式进行关联文件描述符的通知。

`EPOLLONESHOT`：请求一次性通知关联文件描述符的事件，并在通知后禁用该文件描述符的事件监听。

`EPOLLWAKEUP`：确保在挂起或休眠时不会发生事件丢失。

`EPOLLEXCLUSIVE`：设置关联的 epoll 文件描述符的独占唤醒模式，以避免在某些情况下出现雷鸣群问题。

::: details 更多（手册原文）

~~~text:no-line-numbers
EPOLLIN
The associated file is available for read(2) operations.

EPOLLOUT
The associated file is available for write(2) operations.

EPOLLRDHUP (since Linux 2.6.17)
Stream socket peer closed connection, or shut down writing half of the connection. (This flag is especially useful for writing simple code to detect peer shutdown when using edge-triggered monitoring.)

EPOLLPRI
There is an exceptional condition on the file descriptor. See the discussion of POLLPRI in poll(2).

EPOLLERR
Error condition happened on the associated file descriptor. This event is also reported for the write end of a pipe when the read end has been closed.
epoll_wait(2) will always report this event; it is not necessary to set it in events when calling epoll_ctl().

EPOLLHUP
Hang up happened on the associated file descriptor.
epoll_wait(2) will always wait for this event; it is not necessary to set it in events when calling epoll_ctl().
Note that when reading from a channel such as a pipe or a stream socket, this event merely indicates that the peer closed its end of the channel. Subsequent reads from the channel will return 0 (end of file) only after all outstanding data in the channel has been consumed.

And the available input flags are:

EPOLLET
Requests edge-triggered notification for the associated file descriptor. The default behavior for epoll is level-triggered. See epoll(7) for more detailed information about edge-triggered and level-triggered notification.

EPOLLONESHOT (since Linux 2.6.2)
Requests one-shot notification for the associated file descriptor. This means that after an event notified for the file descriptor by epoll_wait(2), the file descriptor is disabled in the interest list, and no other events will be reported by the epoll interface. The user must call epoll_ctl() with EPOLL_CTL_MOD to rearm the file descriptor with a new event mask.

EPOLLWAKEUP (since Linux 3.5)
If EPOLLONESHOT and EPOLLET are clear and the process has the CAP_BLOCK_SUSPEND capability, ensure that the system does not enter "suspend" or "hibernate" while this event is pending or being processed. The event is considered as being "processed" from the time when it is returned by a call to epoll_wait(2) until the next call to epoll_wait(2) on the same epoll(7) file descriptor, the closure of that file descriptor, the removal of the event file descriptor with EPOLL_CTL_DEL, or the clearing of EPOLLWAKEUP for the event file descriptor with EPOLL_CTL_MOD. See also BUGS.

EPOLLEXCLUSIVE (since Linux 4.5)
Sets an exclusive wakeup mode for the epoll file descriptor that is being attached to the target file descriptor, fd. When a wakeup event occurs and multiple epoll file descriptors are attached to the same target file using EPOLLEXCLUSIVE, one or more of the epoll file descriptors will receive an event with epoll_wait(2). The default in this scenario (when EPOLLEXCLUSIVE is not set) is for all epoll file descriptors to receive an event. EPOLLEXCLUSIVE is thus useful for avoiding thundering herd problems in certain scenarios.
If the same file descriptor is in multiple epoll instances, some with the EPOLLEXCLUSIVE flag and others without, then events will be provided to all epoll instances that did not specify EPOLLEXCLUSIVE, and at least one of the epoll instances that did specify EPOLLEXCLUSIVE.
The following values may be specified in conjunction with EPOLLEXCLUSIVE: EPOLLIN, EPOLLOUT, EPOLLWAKEUP, and EPOLLET. EPOLLHUP and EPOLLERR can also be specified, but this is not required: as usual, these events are always reported if they occur, regardless of whether they are specified in events. Attempts to specify other values in events yield the error EINVAL.
EPOLLEXCLUSIVE may be used only in an EPOLL_CTL_ADD operation; attempts to employ it with EPOLL_CTL_MOD yield an error. If EPOLLEXCLUSIVE has been set using epoll_ctl(), then a subsequent EPOLL_CTL_MOD on the same epfd, fd pair yields an error. A call to epoll_ctl() that specifies EPOLLEXCLUSIVE in events and specifies the target file descriptor fd as an epoll instance will likewise fail. The error in all of these cases is EINVAL.
~~~

:::

---

## 3. epoll工作原理

### eventpoll 结构体

调用 `epoll_create` 方法时，内核会为我们创建并维护一个 `eventpoll` 结构体。

::: details eventpoll结构体

~~~c
struct eventpoll {
    /*
     * This mutex is used to ensure that files are not removed
     * while epoll is using them. This is held during the event
     * collection loop, the file cleanup path, the epoll file exit
     * code and the ctl operations.
     */
    struct mutex mtx;

    /* Wait queue used by sys_epoll_wait() */
    wait_queue_head_t wq;

    /* Wait queue used by file->poll() */
    wait_queue_head_t poll_wait;

    /* List of ready file descriptors */
    struct list_head rdllist;

    /* Lock which protects rdllist and ovflist */
    rwlock_t lock;

    /* RB tree root used to store monitored fd structs */
    struct rb_root_cached rbr;

    /*
     * This is a single linked list that chains all the "struct epitem" that
     * happened while transferring ready events to userspace w/out
     * holding ->lock.
     */
    struct epitem *ovflist;

    /* wakeup_source used when ep_scan_ready_list is running */
    struct wakeup_source *ws;

    /* The user that created the eventpoll descriptor */
    struct user_struct *user;

    struct file *file;

    /* used to optimize loop detection check */
    u64 gen;
    struct hlist_head refs;

    /*
     * usage count, used together with epitem->dying to
     * orchestrate the disposal of this struct
     */
    refcount_t refcount;

#ifdef CONFIG_NET_RX_BUSY_POLL
    /* used to track busy poll napi_id */
    unsigned int napi_id;
#endif

#ifdef CONFIG_DEBUG_LOCK_ALLOC
    /* tracks wakeup nests for lockdep validation */
    u8 nests;
#endif
};
~~~

:::

需要关注的是 `eventpoll` 结构体中的两个成员：`rdllist` 和 `rbr`，二者分别维护一个队列和一棵红黑树。

~~~c
struct eventpoll {
    ...

    /* List of ready file descriptors */
    struct list_head rdllist;

    /* RB tree root used to store monitored fd structs */
    struct rb_root_cached rbr;

    ...
}
~~~

![Epoll的队列和红黑树](/inset/Epoll的队列和红黑树.svg)

### rdllist 就绪队列

在内核空间中 `epoll` 使用就绪队列管理就绪的fd，就绪队列使用双链表实现，`rdllist` 用于维护这个链表。

当有fd就绪时，`epoll` 会将就绪的fd和事件加入该队列中，用户调用 `epoll_wait` 时，会检查这个队列是否有资源就绪，如果有就将其取走。

![Epoll的就绪队列](/inset/Epoll的就绪队列.svg)

### rbr 红黑树

`epoll` 在内核空间管理了一棵红黑树，红黑树的节点使用的结构体为 `epitem`，而 `rbr` 用于维护这棵红黑树。

![Epoll的红黑树](/inset/Epoll的红黑树.svg)

用户使用 `epoll_ctl` 对fd关注列表进行增加、删除和修改时，实际上就是对这颗红黑树进行对应操作。由于红黑树的这些操作的复杂度为 $O(logN)$ ，因此 `epoll_ctl` 的执行效率是非常高的。

向关注列表中增加fd时，内核同时会为我们在某些设备上（如网卡驱动）注册回调函数，当fd就绪时被触发。

::: details epitem结构体

~~~c
/*
 * Each file descriptor added to the eventpoll interface will
 * have an entry of this type linked to the "rbr" RB tree.
 * Avoid increasing the size of this struct, there can be many thousands
 * of these on a server and we do not want this to take another cache line.
 */
struct epitem {
    union {
        /* RB tree node links this structure to the eventpoll RB tree */
        struct rb_node rbn;
        /* Used to free the struct epitem */
        struct rcu_head rcu;
    };

    /* List header used to link this structure to the eventpoll ready list */
    struct list_head rdllink;

    /*
     * Works together "struct eventpoll"->ovflist in keeping the
     * single linked chain of items.
     */
    struct epitem *next;

    /* The file descriptor information this item refers to */
    struct epoll_filefd ffd;

    /*
     * Protected by file->f_lock, true for to-be-released epitem already
     * removed from the "struct file" items list; together with
     * eventpoll->refcount orchestrates "struct eventpoll" disposal
     */
    bool dying;

    /* List containing poll wait queues */
    struct eppoll_entry *pwqlist;

    /* The "container" of this item */
    struct eventpoll *ep;

    /* List header used to link this item to the "struct file" items list */
    struct hlist_node fllink;

    /* wakeup_source used when EPOLLWAKEUP is set */
    struct wakeup_source __rcu *ws;

    /* The structure that describe the interested events and the source fd */
    struct epoll_event event;
};
~~~

:::

## 4. epoll服务器

### 业务需求

::: important 主要功能

实现一个简单的并发网络服务器，能够接收来自多个客户端的连接，且能够并发地响应客户端的消息。

:::

### 完整代码

使用C++封装实现一个简单的 `epoll` 网络服务器。

::: details 完整代码

~~~cpp
// Linux
#include <unistd.h>
#include <sys/epoll.h>
#include <sys/socket.h>
#include <arpa/inet.h>

// C
#include <cstring>
#include <cassert>

// C++
#include <iostream>
#include <memory>

// 监听端口
const in_port_t ServerPort = 8080;

class EpollServer {
    int epfd_;
    int server_fd_;

    void init_listen_socket_(in_port_t port) {
        // 创建tcp套接字
        server_fd_ = socket(AF_INET, SOCK_STREAM, 0);
        assert(server_fd_ >= 0);

        // 绑定地址端口
        struct sockaddr_in addr;
        addr.sin_family = AF_INET;
        addr.sin_port = htons(port);
        addr.sin_addr.s_addr = htonl(INADDR_ANY);
        assert(bind(server_fd_, (struct sockaddr *)&addr, sizeof(struct sockaddr_in)) == 0);

        // 设置端口复用
        const int Optlen = 1;
        setsockopt(server_fd_, SOL_SOCKET, SO_REUSEADDR, &Optlen, sizeof(Optlen));

        // 监听
        assert(listen(server_fd_, 10) >= 0);
        std::cout << "Server listening on 0.0.0.0:" << port << std::endl;
    }

public:
    EpollServer(int port) {
        // 创建epoll
        epfd_ = epoll_create(1);
        assert(epfd_ >= 0);

        // 创建服务器fd
        init_listen_socket_(port);

        // 添加服务器fd到epoll的关注列表
        struct epoll_event event;
        event.events = EPOLLIN;
        event.data.fd = server_fd_;
        epoll_ctl(epfd_, EPOLLIN, server_fd_, &event);
    }

    ~EpollServer() {
        // 关闭epoll
        close(epfd_);
        // 关闭服务器fd
        close(server_fd_);
    }

    void run() {
        // 定义events数组，用于接收就绪的fd以及其上事件
        const int EVENT_SIZE = 16;
        struct epoll_event events[EVENT_SIZE]{};

        // 业务循环
        while (true) {

            // 等待事件就绪
            int ret = epoll_wait(epfd_, events, EVENT_SIZE, -1);
            assert(ret >= 0);

            for (size_t i = 0; i < ret; ++i) {
                int fd = events[i].data.fd;
                if (fd == server_fd_) {
                    // 服务器fd收到连接事件
                    sockaddr_in addr;
                    socklen_t addrlen = sizeof(addr);
                    int newfd = accept(server_fd_, (struct sockaddr*)&addr, &addrlen);
                    assert(newfd >= 0);
                    
                    char strAddr[INET_ADDRSTRLEN];
                    std::cout << "accept from "
                        << inet_ntop(AF_INET, &(addr.sin_addr.s_addr), strAddr, sizeof(strAddr))
                        << ":" << ntohs(addr.sin_port) << std::endl;

                    // 将新的fd加入epoll的关注列表
                    struct epoll_event event;
                    event.events = EPOLLIN;
                    event.data.fd = newfd;
                    epoll_ctl(epfd_, EPOLL_CTL_ADD, newfd, &event);

                } else {
                    // 收到了链接fd的io事件
                    std::cout << "link fd: " << fd << std::endl;

                    // TODO: 处理具体业务...
                    // 接收客户端发来的消息，并原封不动发回，保持连接，直到客户端发送"quit"，断开连接。
                    char buf[4096];

                    // 接收
                    assert(read(fd, (void*)buf, sizeof(buf) -1) >= 0);
                    std::cout << "read fd " << fd << ": " << buf << std::endl;

                    if (buf[0] == 'q' && buf[1] == 'u' && buf[2] == 'i' && buf[3] == 't') {
                        // 客户端发送的是quit，断开连接
                        std::cout << "link fd closed: " << fd << std::endl;
                        close(fd);
                    } else {
                        // 发送
                        std::cout << "write fd " << fd << ", length = "
                            << write(fd, buf, strlen(buf)) << std::endl;
                    }
                }
            }
        }
    }
};

int main() {
    EpollServer es(ServerPort);
    es.run();
    return 0;
}
~~~

:::
