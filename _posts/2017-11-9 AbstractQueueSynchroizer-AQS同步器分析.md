---
title: AbstractQueueSynchroizer-AQS同步器分析 
tags:java,并发,concurrent
date: 2017-06-18 22:43:23
grammar_cjkRuby: true
---
日期: 2017-06-18 
# AQS分析
已经有很多人阐述了AQS,作为java并发编程的基础.这里记录下自己的理解
## 简述
AQS是包含了同步队列和等待队列,并实现了建立在自定义锁获取和锁释放`后`的同步框架
## 使用
只需要继承并重写锁的获取和所得释放,其他关于同步的一系列操作都已经由该框架实现.
*  boolean tryAcquire(int arg) 独占式
*  boolean tryRelease(int arg) 独占式
*  int tryAcquireShared(int arg) 共享式
*  boolean tryReleaseShared(int arg) 共享式
*  boolean isHeldExclusively() 判断持有锁线程是不是当前线程
```java
 pubic class Mutex implements Lock, java.io.Serializable {

   // Our internal helper class
   private static class Sync extends AbstractQueuedSynchronizer {
     // Reports whether in locked state
     protected boolean isHeldExclusively() {
       return getState() == 1;
     }

     // Acquires the lock if state is zero
     public boolean tryAcquire(int acquires) {
       assert acquires == 1; // Otherwise unused
       if (compareAndSetState(0, 1)) {
         setExclusiveOwnerThread(Thread.currentThread());
         return true;
       }
       return false;
     }

     // Releases the lock by setting state to zero
     protected boolean tryRelease(int releases) {
       assert releases == 1; // Otherwise unused
       if (getState() == 0) throw new IllegalMonitorStateException();
       setExclusiveOwnerThread(null);
       setState(0);
       return true;
     }

     // Provides a Condition
     Condition newCondition() { return new ConditionObject(); }

     // Deserializes properly
     private void readObject(ObjectInputStream s)
         throws IOException, ClassNotFoundException {
       s.defaultReadObject();
       setState(0); // reset to unlocked state
     }
   }

   // The sync object does all the hard work. We just forward to it.
   private final Sync sync = new Sync();

   public void lock()                { sync.acquire(1); }
   public boolean tryLock()          { return sync.tryAcquire(1); }
   public void unlock()              { sync.release(1); }
   public Condition newCondition()   { return sync.newCondition(); }
   public boolean isLocked()         { return sync.isHeldExclusively(); }
   public boolean hasQueuedThreads() { return sync.hasQueuedThreads(); }
   public void lockInterruptibly() throws InterruptedException {
     sync.acquireInterruptibly(1);
   }
   public boolean tryLock(long timeout, TimeUnit unit)
       throws InterruptedException {
     return sync.tryAcquireNanos(1, unit.toNanos(timeout));
   }
 }
```

> 代码来自javadoc

## 关键结构
作为同步队列,其核心是将争夺资源的线程维护在一个队列里,通过`CAS`操作`state`值,和`LuckSupport`完成锁的语义;
* state 
该字段是基于AQS实现锁语义的基础,建立在volatile语义的基础上. 使用`CAS`对state进行原子操作,保障多个线程之间正确的读写.
	* getState(); //获取当前同步状态
	* setState(); //设置当前同步状态
	* compareAndSetStatue();//CAS原子操作设置当前状态
* Node
是构造队列的节点,,节点包含了描述节点状态`waitStatus'
	
	* CANCELLED 1		
	waitStatus中唯一值大于0的存在,表明队列里的线程跟锁毫无关系,在各种处理队列节点中的操作都将其从队列里去除;
	*  0 
	初始值 正常同步节点
	* SIGNAL -1
	后集结点的线程处于等待状态,而当前节点的线程如果释放了同步状态或者被取消,将会通知后继结点,使后继节点的线程的得以运行
	* CONDITION -2
	节点在等待队列中,节点线程等待在`Condition`上,当其他线程对`Condition`调用signal()方法后,该节点将会从等待队列中转义到同步队列中,加入到对同步状态的获取
	* PROPAGATE -3
	表示下一次共享式同步状态获取将会无条件传播下去
	


> 超时获取同步状态,有最小自旋超时时间(`sinForTimeoutThreshold`),由于`LockSupport.park()`有可能会发生自己唤醒,所以一般在循环中使用`LockSupport`,当超时获取同步时,会有nanosTimeout作为`park`参数 nanosTimeout-=now-lastTime,当nanosTimeout小于最小自旋时间,将直接进行高速自旋,不会休眠,直到超时中断;

		 
		




