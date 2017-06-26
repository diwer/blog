---
title: zookeeper工作原理
tags: [zookeeper]
date: 2017-06-25
grammar_cjkRuby: true
---
日期: 2017-06-25 11:36:16

# zookeeper工作原理
zk的核心是原子广播，这个机制保证了各个server之间的同步，实现这个机制的协议叫做zab，zab协议有两种模式，他们分别是恢复模和广播模式，分别用来选主和同步

当领导者宕机，zab就进入恢复模式，选举领导者，且大多数server完成了和leader的状态同步以后，恢复模式结束，状态同步保证了leader和server具有相同的系统状态
为了保证事务的顺序一致性，zookeeper采用了递增的事务id（zxid）来标识事务，所有提议proposal都在被提出的时候加上了zxid

实现中zxid是一个64位的数字，它高32位是epoch用来标识leader关系是否改变，每次一个leader被选出来，他都会有个新的epoch，标识当前属于哪个leader的领导时期，低于32位用于递增计数
每个server在工作过程中有三个状态：
1. looking 当前server不知道leader是谁，
2. leading 当前server被选举为leader
3. following leader已经被选举出来，与当前server同步
## 选主流程
当leader宕机，l或者失去大多数follower，zk进入恢复模式，让所有server恢复到正确状态，选举算法两种，一个钟basic paxos实现，另一种 基于fast paxos算法实现。系统默认的选举算法为fast paxos
1. 选举线程由当前Server发起选举的线程担任,主要功能是投票结果进行统计，并选出推荐的Server;
2. 玄虚线程先向所有发起一次询问（包括自己）
3. 选举线程收到回复后，验证是否是自己发起的询问（验证zxid是否一致），然后获取对方的Id(myid)，并存储到当前询问对象列表中，最后获取对方提议的leader相关信息（id，zxid）,并将这些信息存储到当次选举的投票记录表中
4. 收到所有server回复以后，就计算zxid最大的那个server，并将这个server相关信息设置成下一次要投票的server
5. 线程将当前zxid醉的server设置为当前Server要推荐的leader，如果此时获胜的server获得n/2+1的server票数，设置当前推荐的leader为获胜的server，将根据获胜的server相关信息设置自己的状态，否则重复这个过程

server 存活的数量不得少于n+1 server总数必须是2n+1

每个server启动后都会重复以上流程，在恢复模式下，如果是刚从奔溃状态恢复的或者刚启动的server还会从磁盘快照中恢复数据和会话信息，zk惠济路事务日志并定期进行快照，方便在恢复时进行状态恢复，
## 同步流程
完成leader选举后进入状态同步过程
1. leader等待server链接
2. follower链接leader，将最大的zxid发送给leader
3. leader根据follower的zxid确定同步点；
4. 完成同步后通知follower 已经恒为uptodate状态
5. follower收到update消息后，又可以重新接受client的请求进行服务
## leader工作流程
1. 恢复数据
2. 维持与learner的心跳，j接收learnner请求并判断learner的请求消息类型；
3. learner的消息类型主要有ping消息，request消息，ack消息，revalidate消息，根据不同的消息类型，进行不同的处理
>ping消息值learner的心跳信息，
>request消息是follower发送的提议信息，包括写请求及同步请求；
>Ack消息是follwer的对提议的回复，超过半数的follower通过，则commit该提议
>revlidate消息用来延长session有效时间
* follower工作流程
1. 向leader发送请求
2. 接收leader消息并处理
3. 接收client，如果写请求发送给leader进行投票
4. 返回client结果
		> ping消息，心跳信心
		> proposal消息 leader发起的填，要求follower投票
		> commit消息 服务器最新一次提案的信息
		> uptodate消息：表明同步完成 可以接收客户端请求
		> revalidate消息；根据leader的结果关闭session 或允许接收消息
		> sync消息：返回sync结果到客户端，这消息最初由客户端发起用来强制得到最新的更新。
		>follower通过5个线程来实现功能
## zookeeper引用changjing
### 配置管理
集中式的配置管理。保证在配置改变时能够通知集群中的每一个机器、
通过对zk节点数据的监控，并实现毁掉方法，那么配置的变化就能实时的接收到通知并获取最新配置
### 集群管理
用于集群的管理，比如宕机通知 和master选举
## zk监视 
zk所有的读操作getData(),getChildern(),和exists()都可以设置监视(watch),监视事件可以理解为一次性的触发器。
* 一次性触发
	当设置监视的数据发生改变时，该监事时间会被发送到客户端。例如，如果客户端调用了getData("/znode",true)并且稍后znode1节点上的数据发生了改变或者被删除了，客户端将会获取/znode1发生变化的监视事件，而如果/znode1再一次发生了变化，除非客户端再次对/znode1设置监视，否则客户端不会收到时间通知
* 发送至客户端
	zookeeper 客户端和服务端是通过socket进行通信的，由于网络存在故障，所以监视事件很有可能不会成功地达到客户端，监视事件异步发送给监视者，zk提供了保序性
即客户端只有首先看到了监视事件后，才会感知到它所设置监视的znode发生了变化，网络延迟或者其他因素可能导致不同的客户端在不同的时刻感知某一监视事件，但是不同的客户端所看到的一切具有一致的顺序
* 被设置watch的数据
	这个意味着znode节点本身具有不同的改变方式，你也可以想想zookeeper维护了两条监视链表：数据监视和子节点监视。
zk的监视是轻量级的，因此容易设置、维护和分发，当客户端与zk服务端失去联系时，客户端并不会收到监视事件的的通知，只有当客户端重新连接后，若在必要的情况下，以前注册的监视会重新被注册并触发，对于开发人员来说这个通常是透明的
只有一种情况会导致监视事件的丢失，即通过exists设置某个znode节点的监视，但是如果某个客户端在znode节点被创建和删除的时间间隔内 与zk服务失去了联系，该客户端即使稍后重新链接 zk服务也得不到时间通知
## znode访问权限
* zoo_perm_reaad 允许客户端读取znode节点的值以及子节点列表
* ZOO_PERM_WRITE 允许客户端设置znode节点的值
* ZOO_PERM_CREATE 允许客户端在改znode节点创建子节点
* ZOO_PERM_DELETE 允许客户端删除子节点
* ZOO_PERM_ADMIN 允许客户端执行set_acl()
* ZOO_PERM_ALL  允许客户端执行所有操作，等价与上述所有标志的或
## watch事件类型
* ZOO_CREATED_EVENT  节点创建事件，需要watch一个不存在的节点，当节点被创建时触发，此watch通过zoo_exists()设置
* ZOO_DELETED_EVENT  节点删除时间 此watch通过 zoo_exists() 或zoo_get()设置
* ZOO_CHANGED_EVENT 节点数据改变时间 此watch通过zoo_exists()或zoo_get()设置
* ZOO_CHILD_EVENT 子节点列表改变事件，此watch通过zoo_get_children()或zoo_get_childrend2()设置
* ZOO_SESSION_EVENT 绘画是小事件，客户端与服务端断开或重连时触发
* ZOO_NOTWATCHING_EVENT watch移除事件，服务端出于某些原因不再为客户端watch节点时触发

----

wanheming1991@gmail.com