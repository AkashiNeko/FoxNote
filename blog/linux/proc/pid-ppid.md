---
title: PID和PPID
date: 2022-08-20
isOriginal: true
icon: section
category:
  - Linux
tag:
  - PID
  - PPID
excerpt: 在Linux下，每个进程都有自己的进程标识符PID，以及其父进程的PPID。
order: 2
---

## 1. 进程标识符 PID

### 什么是PID

进程标识符（Process Identifier，PID）是在操作系统中**唯一**标识进程的数字，每个运行的进程都被分配一个独特的PID。

::: info PID的取值

PID是一个非负整数，范围通常是从1开始。其中PID为0的进程被保留给操作系统的调度进程（通常是内核线程）。一般情况下，较小的PID值通常是系统进程和关键服务进程，而较大的PID值则是动态分配的用户进程。

:::

PID的主要作用是在系统中标识和跟踪进程。通过PID，操作系统能够识别特定的进程，并在进程管理和调度过程中进行操作。PID可用于查找和管理进程的状态、资源分配、进程间通信等。

### 查看进程的PID

使用 `top` 命令打开任务管理器，在第一列（进程号）可以看到各进程的PID。

~~~text:no-line-numbers
top - 18:32:16 up 12:41,  2 users,  load average: 0.01, 0.09, 0.13
任务: 199 total,   1 running, 198 sleeping,   0 stopped,   0 zombie
%Cpu(s): 25.0 us,  0.0 sy,  0.0 ni, 75.0 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
MiB Mem :  15745.3 total,  12311.5 free,   1995.1 used,   1775.0 buff/cache
MiB Swap:  16384.0 total,  16384.0 free,      0.0 used.  13750.1 avail Mem

 进程号 USER      PR  NI    VIRT    RES    SHR    %CPU  %MEM     TIME+ COMMAND
   1    root      20   0  168908  12724   9012 S   0.0   0.1   0:03.23 systemd
   2    root      20   0       0      0      0 S   0.0   0.0   0:00.01 kthreadd
   3    root       0 -20       0      0      0 I   0.0   0.0   0:00.00 rcu_gp
   4    root       0 -20       0      0      0 I   0.0   0.0   0:00.00 rcu_par_gp
   5    root       0 -20       0      0      0 I   0.0   0.0   0:00.00 slub_flushwq
   6    root       0 -20       0      0      0 I   0.0   0.0   0:00.00 netns
   8    root       0 -20       0      0      0 I   0.0   0.0   0:00.00 kworker/0:0H-events_highpri
  11    root       0 -20       0      0      0 I   0.0   0.0   0:00.00 mm_percpu_wq
  12    root      20   0       0      0      0 I   0.0   0.0   0:00.00 rcu_tasks_kthread
  13    root      20   0       0      0      0 I   0.0   0.0   0:00.00 rcu_tasks_rude_kthread
  14    root      20   0       0      0      0 I   0.0   0.0   0:00.00 rcu_tasks_trace_kthread
  15    root      20   0       0      0      0 S   0.0   0.0   0:00.18 ksoftirqd/0
  16    root      20   0       0      0      0 I   0.0   0.0   0:05.81 rcu_preempt
~~~

Linux系统提供了接口 `getpid()`，用于查询进程的PID，返回值类型 `pid_t` 通常为 `int`。

~~~c
#include <unistd.h>

pid_t getpid(void);
~~~

我们可以用下面的代码进行测试。

~~~c
#include <stdio.h>
#include <unistd.h>

int main() {
    printf("program start.. pid = %d\n", getpid());
    getchar(); // 使进程不退出
}
~~~

运行程序，成功输出当前程序的PID。

~~~text:no-line-numbers
$ ./main
program start.. pid = 13819
~~~

使用 `pidof` 或 `ps a` 命令查询PID。

~~~text:no-line-numbers
$ pidof main
13819
$ ps a | grep main
13819 pts/4    S+     0:00 ./main
~~~

## 2. 父进程和PPID

在Linux中，每个进程都有一个父进程，父进程是创建当前进程的进程。父进程与子进程之间形成了进程的层次结构，父进程可以创建多个子进程，子进程也可以继续创建自己的子进程，形成进程树。

::: info PPID——父进程的PID

每个进程都有一个父进程标识符（Parent Process Identifier，PPID），表示当前进程的父进程的PID。

:::

使用 `ps aj` 命令可以查看进程的PID和PPID，比如刚才的程序 `main`。

~~~text:no-line-numbers
$ ps aj | head -1 && ps aj | grep main
 PPID     PID    PGID     SID TTY        TPGID STAT   UID   TIME COMMAND
11902   13819   13819   11902 pts/4      13819 S+    1000   0:00 ./main
~~~

可以发现，`main` 进程的PPID为11902，即 `main` 进程是由PID为11902的进程启动的。

~~~text:no-line-numbers
$ ps a | head -1 && ps a | grep 11902
  PID TTY      STAT   TIME COMMAND
11902 pts/4    Ss     0:00 -bash
~~~

使用 `ps a` 查找该PID对应的进程，可以发现这个进程名为 `bash`，它是一个Shell程序，即我们熟知的控制台终端。实际上，我们在终端下输入的命令，都会由 `bash` 创建子进程来执行。在终端下执行的一切命令（程序），它们的父进程都是 `bash`。

::: info 最初的进程

如果我们对任意一个进程溯源，最终都能找到它们共同的父进程 `systemd`（或早期的 `init`），它是在操作系统启动时启动的进程，是所有进程的父进程，它的PID固定为1。

:::

## 4. 进程地址空间

### 什么是地址空间

之前提到，每个进程都持有自己独立的内存空间，即进程的地址空间。

::: info 地址空间

进程的地址空间是操作系统为每个进程分配的一块内存区域（虚拟内存），在这个区域内存储了进程执行所需的代码、数据和堆栈等信息。地址空间可以被划分为不同的段，包括代码段、数据段、堆栈等，用于存放不同类型的数据和程序指令。每个进程都有独立的地址空间，使得进程之间的内存访问相互隔离，增加了系统的安全性和稳定性。

:::

在PCB结构体 `task_struct` 的成员中，有结构体 `mm_struct` 用于管理进程的地址空间。

::: details mm_struct

~~~c
struct mm_struct {
    struct {
        /*
         * Fields which are often written to are placed in a separate
         * cache line.
         */
        struct {
            /**
             * @mm_count: The number of references to &struct
             * mm_struct (@mm_users count as 1).
             *
             * Use mmgrab()/mmdrop() to modify. When this drops to
             * 0, the &struct mm_struct is freed.
             */
            atomic_t mm_count;
        } ____cacheline_aligned_in_smp;

        struct maple_tree mm_mt;
#ifdef CONFIG_MMU
        unsigned long (*get_unmapped_area) (struct file *filp,
                unsigned long addr, unsigned long len,
                unsigned long pgoff, unsigned long flags);
#endif
        unsigned long mmap_base;    /* base of mmap area */
        unsigned long mmap_legacy_base;    /* base of mmap area in bottom-up allocations */
#ifdef CONFIG_HAVE_ARCH_COMPAT_MMAP_BASES
        /* Base addresses for compatible mmap() */
        unsigned long mmap_compat_base;
        unsigned long mmap_compat_legacy_base;
#endif
        unsigned long task_size;    /* size of task vm space */
        pgd_t * pgd;

#ifdef CONFIG_MEMBARRIER
        /**
         * @membarrier_state: Flags controlling membarrier behavior.
         *
         * This field is close to @pgd to hopefully fit in the same
         * cache-line, which needs to be touched by switch_mm().
         */
        atomic_t membarrier_state;
#endif

        /**
         * @mm_users: The number of users including userspace.
         *
         * Use mmget()/mmget_not_zero()/mmput() to modify. When this
         * drops to 0 (i.e. when the task exits and there are no other
         * temporary reference holders), we also release a reference on
         * @mm_count (which may then free the &struct mm_struct if
         * @mm_count also drops to 0).
         */
        atomic_t mm_users;

#ifdef CONFIG_SCHED_MM_CID
        /**
         * @pcpu_cid: Per-cpu current cid.
         *
         * Keep track of the currently allocated mm_cid for each cpu.
         * The per-cpu mm_cid values are serialized by their respective
         * runqueue locks.
         */
        struct mm_cid __percpu *pcpu_cid;
        /*
         * @mm_cid_next_scan: Next mm_cid scan (in jiffies).
         *
         * When the next mm_cid scan is due (in jiffies).
         */
        unsigned long mm_cid_next_scan;
#endif
#ifdef CONFIG_MMU
        atomic_long_t pgtables_bytes;    /* size of all page tables */
#endif
        int map_count;            /* number of VMAs */

        spinlock_t page_table_lock; /* Protects page tables and some
                         * counters
                         */
        /*
         * With some kernel config, the current mmap_lock's offset
         * inside 'mm_struct' is at 0x120, which is very optimal, as
         * its two hot fields 'count' and 'owner' sit in 2 different
         * cachelines,  and when mmap_lock is highly contended, both
         * of the 2 fields will be accessed frequently, current layout
         * will help to reduce cache bouncing.
         *
         * So please be careful with adding new fields before
         * mmap_lock, which can easily push the 2 fields into one
         * cacheline.
         */
        struct rw_semaphore mmap_lock;

        struct list_head mmlist; /* List of maybe swapped mm's.    These
                      * are globally strung together off
                      * init_mm.mmlist, and are protected
                      * by mmlist_lock
                      */
#ifdef CONFIG_PER_VMA_LOCK
        /*
         * This field has lock-like semantics, meaning it is sometimes
         * accessed with ACQUIRE/RELEASE semantics.
         * Roughly speaking, incrementing the sequence number is
         * equivalent to releasing locks on VMAs; reading the sequence
         * number can be part of taking a read lock on a VMA.
         *
         * Can be modified under write mmap_lock using RELEASE
         * semantics.
         * Can be read with no other protection when holding write
         * mmap_lock.
         * Can be read with ACQUIRE semantics if not holding write
         * mmap_lock.
         */
        int mm_lock_seq;
#endif


        unsigned long hiwater_rss; /* High-watermark of RSS usage */
        unsigned long hiwater_vm;  /* High-water virtual memory usage */

        unsigned long total_vm;       /* Total pages mapped */
        unsigned long locked_vm;   /* Pages that have PG_mlocked set */
        atomic64_t    pinned_vm;   /* Refcount permanently increased */
        unsigned long data_vm;       /* VM_WRITE & ~VM_SHARED & ~VM_STACK */
        unsigned long exec_vm;       /* VM_EXEC & ~VM_WRITE & ~VM_STACK */
        unsigned long stack_vm;       /* VM_STACK */
        unsigned long def_flags;

        /**
         * @write_protect_seq: Locked when any thread is write
         * protecting pages mapped by this mm to enforce a later COW,
         * for instance during page table copying for fork().
         */
        seqcount_t write_protect_seq;

        spinlock_t arg_lock; /* protect the below fields */

        unsigned long start_code, end_code, start_data, end_data;
        unsigned long start_brk, brk, start_stack;
        unsigned long arg_start, arg_end, env_start, env_end;

        unsigned long saved_auxv[AT_VECTOR_SIZE]; /* for /proc/PID/auxv */

        struct percpu_counter rss_stat[NR_MM_COUNTERS];

        struct linux_binfmt *binfmt;

        /* Architecture-specific MM context */
        mm_context_t context;

        unsigned long flags; /* Must use atomic bitops to access */

#ifdef CONFIG_AIO
        spinlock_t            ioctx_lock;
        struct kioctx_table __rcu    *ioctx_table;
#endif
#ifdef CONFIG_MEMCG
        /*
         * "owner" points to a task that is regarded as the canonical
         * user/owner of this mm. All of the following must be true in
         * order for it to be changed:
         *
         * current == mm->owner
         * current->mm != mm
         * new_owner->mm == mm
         * new_owner->alloc_lock is held
         */
        struct task_struct __rcu *owner;
#endif
        struct user_namespace *user_ns;

        /* store ref to file /proc/<pid>/exe symlink points to */
        struct file __rcu *exe_file;
#ifdef CONFIG_MMU_NOTIFIER
        struct mmu_notifier_subscriptions *notifier_subscriptions;
#endif
#if defined(CONFIG_TRANSPARENT_HUGEPAGE) && !USE_SPLIT_PMD_PTLOCKS
        pgtable_t pmd_huge_pte; /* protected by page_table_lock */
#endif
#ifdef CONFIG_NUMA_BALANCING
        /*
         * numa_next_scan is the next time that PTEs will be remapped
         * PROT_NONE to trigger NUMA hinting faults; such faults gather
         * statistics and migrate pages to new nodes if necessary.
         */
        unsigned long numa_next_scan;

        /* Restart point for scanning and remapping PTEs. */
        unsigned long numa_scan_offset;

        /* numa_scan_seq prevents two threads remapping PTEs. */
        int numa_scan_seq;
#endif
        /*
         * An operation with batched TLB flushing is going on. Anything
         * that can move process memory needs to flush the TLB when
         * moving a PROT_NONE mapped page.
         */
        atomic_t tlb_flush_pending;
#ifdef CONFIG_ARCH_WANT_BATCHED_UNMAP_TLB_FLUSH
        /* See flush_tlb_batched_pending() */
        atomic_t tlb_flush_batched;
#endif
        struct uprobes_state uprobes_state;
#ifdef CONFIG_PREEMPT_RT
        struct rcu_head delayed_drop;
#endif
#ifdef CONFIG_HUGETLB_PAGE
        atomic_long_t hugetlb_usage;
#endif
        struct work_struct async_put_work;

#ifdef CONFIG_IOMMU_SVA
        u32 pasid;
#endif
#ifdef CONFIG_KSM
        /*
         * Represent how many pages of this process are involved in KSM
         * merging (not including ksm_zero_pages).
         */
        unsigned long ksm_merging_pages;
        /*
         * Represent how many pages are checked for ksm merging
         * including merged and not merged.
         */
        unsigned long ksm_rmap_items;
        /*
         * Represent how many empty pages are merged with kernel zero
         * pages when enabling KSM use_zero_pages.
         */
        unsigned long ksm_zero_pages;
#endif /* CONFIG_KSM */
#ifdef CONFIG_LRU_GEN
        struct {
            /* this mm_struct is on lru_gen_mm_list */
            struct list_head list;
            /*
             * Set when switching to this mm_struct, as a hint of
             * whether it has been used since the last time per-node
             * page table walkers cleared the corresponding bits.
             */
            unsigned long bitmap;
#ifdef CONFIG_MEMCG
            /* points to the memcg of "owner" above */
            struct mem_cgroup *memcg;
#endif
        } lru_gen;
#endif /* CONFIG_LRU_GEN */
    } __randomize_layout;

    /*
     * The mm_cpumask needs to be at the end of mm_struct, because it
     * is dynamically sized based on nr_cpu_ids.
     */
    unsigned long cpu_bitmap[];
};
~~~

:::

### 地址空间的划分

下面是一个32位操作系统下进程地址空间的划分，其中4GB的地址空间中包含1GB的内核空间和3GB的用户空间。我们主要关注其中的用户空间。

![进程的地址空间](/inset/进程的地址空间.svg)

我们可以用下面的程序简单验证地址空间的划分。

~~~c
#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

int global_initialized = 100;
int global_uninitialized;

void recursion(int n) {
    if (n == 4) return;
    int stack_ptr = 0;
    printf("%p - 函数栈%d ↓\n", &stack_ptr, n);
    recursion(n + 1);
}

int main(int argc, char *argv[], char *envp[]) {

    // 参数和环境变量
    printf("%p - 环境变量\n", (void*)envp[0]);
    printf("%p - 命令行参数\n", (void*)argv[0]);

    // 函数栈（递归叠三层函数栈，取其中变量地址）
    recursion(1);

    // 共享区（加载原生线程库）
    printf("%p - 共享区\n", (void*)pthread_create);

    // 堆区申请的空间
    void* heap_ptr1 = malloc(10);
    void* heap_ptr2 = malloc(10);
    void* heap_ptr3 = malloc(10);
    printf("%p - 堆区3 ↑\n", (void*)heap_ptr3);
    printf("%p - 堆区2 ↑\n", (void*)heap_ptr2);
    printf("%p - 堆区1 ↑\n", (void*)heap_ptr1);
    free(heap_ptr1); free(heap_ptr2); free(heap_ptr3);

    // 全局变量
    printf("%p - 未初始化全局区\n", (void*)&global_uninitialized);
    printf("%p - 已初始化全局区\n", (void*)&global_initialized);

    // 字符串常量
    const char* str = "Hello, world!";
    printf("%p - 字符常量区\n", (void*)str);

    // 代码区
    printf("%p - 代码区\n", (void*)main);

    return 0;
}
~~~

使用 `gcc` 命令编译程序时，使用 `-m32` 参数指定以32位模式进行编译和链接。

~~~text:no-line-numbers
$ gcc -o main main.c -m32
$ ls
main main.c
$ ./main
0xffa74281 - 环境变量
0xffa7427a - 命令行参数
0xffa733e8 - 函数栈1 ↓
0xffa733b8 - 函数栈2 ↓
0xffa73388 - 函数栈3 ↓
0xf7c8bba0 - 共享区
0x568bc5d0 - 堆区3 ↑
0x568bc5c0 - 堆区2 ↑
0x568bc5b0 - 堆区1 ↑
0x565ff010 - 未初始化全局区
0x565ff008 - 已初始化全局区
0x565fd0c5 - 字符常量区
0x565fc236 - 代码区
~~~

从输出结果来看，地址空间中，代码区以及字符常量区这些编译时即确定的内容位于用户空间的最底部（低地址处），其次为全局变量（包括静态变量），命令行参数和环境变量位于用户空间的最顶部（高地址处）。

堆栈相对而生，动态分配内存，函数栈空间较小，在32位机器上，通常在2MB~8MB之间，所以在编写代码时，需要避免过多的递归，或将空间占用较大的局部变量存放在堆区，以防止栈溢出的问题。

共享区位于堆栈之间，用于实现进程通信和数据共享，共享库和动态链接库也会被加载到此处。

### 地址空间的内存

::: info 虚拟内存

进程地址空间的地址是一个虚拟的内存地址。比如32位的机器上，内存的地址空间有4GB的空间。实际上这个空间被页表映射到了各种区域，除了映射到物理内存以外，还有其他映射区域（如设备映射、共享库映射等）以及特定的地址空间段。

进程的地址空间通常不会全部映射到物理内存上。如果是一个简单的程序（比如不大量从堆区申请内存），那么地址空间中只有很小一部分被映射到物理内存上。这样的映射机制可以让物理内存资源被充分利用，同时隔离不同进程的地址空间。

:::

#### 操作系统的内存分配机制

使用 `malloc` 申请的内存块如果不使用（写入），进程甚至可能都不会去申请物理内存。我们可以用下面的代码申请1GB内存，分别观察申请内存前、申请内存后和使用内存后的变化进行验证。

~~~c
#include <stdio.h>
#include <stdlib.h>
#include <assert.h>

int main() {
    // 申请内存前
    printf("按下回车键申请内存...\n");
    getchar();

    // 申请内存后（申请1GB）
    char* ptr = (char*)malloc(1024 * 1024 * 1024);
    assert(ptr != NULL);
    printf("申请完成: ptr = %p, 按下回车键使用内存\n", ptr);
    getchar();

    // 使用内存（每隔1KB写入一个'a'）
    for (int i = 0; i < 1024 * 1024; ++i) {
        ptr[1024 * i] = 'a';
    }
    printf("写入完成\n");
    getchar();
    return 0;
}
~~~

将程序运行起来，分别在申请内存前后使用 `ps aux` 命令查看进程占用的内存。

这里主要关注 `VSZ` 和 `RSS`：

- VSZ（Virtual Set Size）指的是进程的虚拟内存大小，包括进程使用的所有虚拟地址空间的总和。
- RSS（Resident Set Size）指的是进程的驻留内存集合大小，也称为实际内存使用量。即当前进程实际占用的物理内存大小。

::: info 申请内存前

程序输出

> 按下回车键申请内存...

~~~text:no-line-numbers
$ ps aux | head -1 && ps aux | grep main
USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
akashi     19161  0.0  0.0   2792  1152 pts/6    S+   19:00   0:00 ./main
~~~

- `VSZ`：2792
- `RSS`：1152

:::

::: info 申请内存后

程序输出

> 按下回车键申请内存...
>
> 申请完成: ptr = 0xb7bff010, 按下回车键使用内存

~~~text:no-line-numbers
$ ps aux | head -1 && ps aux | grep main
USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
akashi     19161  0.0  0.0 1051372 1280 pts/6    S+   19:00   0:00 ./main
~~~

- `VSZ`：1051372
- `RSS`：1280

:::

::: info 使用内存后

程序输出

> 按下回车键申请内存...
>
> 申请完成: ptr = 0xb7bff010, 按下回车键使用内存
>
> 写入完成

~~~text:no-line-numbers
$ ps aux | head -1 && ps aux | grep main
USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
akashi     19161  2.0  6.5 1051372 1049856 pts/6 S+   19:00   0:00 ./main
~~~

- `VSZ`：1051372
- `RSS`：1049856

:::

分别观察上面三个 `VSZ` 和 `RSS`，程序使用 `malloc` 申请内存后还没使用时，进程使用的虚拟内存增加了约1GB，但是该进程物理内存的使用几乎没有增加。当这块内存空间实际被写入数据后，这块内存空间才被映射到真实的物理内存上。

另外，虽然 `malloc` 申请的内存并没有释放，但是操作系统完全不用担心这个问题，因为申请的内存空间是记录在进程的地址空间中的。当进程退出时，为了保证操作系统的正常运行，作为进程的管理者，操作系统需要对进程的资源进行回收，这其中就包括了进程的地址空间。
