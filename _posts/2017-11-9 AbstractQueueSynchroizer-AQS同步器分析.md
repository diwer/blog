---
title: AbstractQueueSynchroizer-AQS同步器分析 
tags:java,并发,concurrent
date: 2017-06-18 22:43:23
grammar_cjkRuby: true
---
日期: 2017-06-18 
# AQS分析
已经有很多人阐述了AQS,作为java并发编程的基础.这里记录下自己的理解
## 关键结构
作为同步队列,其核心是将争夺资源的线程维护在一个队列里,通过`CAS`操作`state`值,和`LuckSupport`完成锁的语义;
* state 
该字段是基于AQS实现锁语义的基础,建立在volatile语义的基础上. 使用`CAS`对state进行原子操作,保障多个线程之间正确的读写.
* Node
是AQS中同步队列的节点,一个双向链表,节点包含了线程状态`waitStatus'
	
	* CANCELLED 1		
	waitStatus中唯一值大于0的存在,表明队列里的线程跟锁毫无关系,在各种处理队列节点中的操作都将其从队列里去除;
	*  0 
	初始值
	* SIGNAL -1
	后集结点的线程处于等待状态,而当前节点的线程如果释放了同步状态或者被取消,将会通知后继结点,使后继节点的线程的得以运行
	* CONDITION -2
	节点在等待队列中,节点线程等待在`Condition`上,当其他线程对`Condition`调用signal()方法后,该节点将会从等待队列中转义到同步队列中,加入到对同步状态的获取
	* PROPAGATE -3
	表示下一次共享式同步状态获取将会无条件传播下去
		 
		




