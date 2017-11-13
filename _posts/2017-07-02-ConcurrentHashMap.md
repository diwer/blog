---
title: ConcurrentHashMap
tags: [Map,java,并发]
date: 2017-07-02
grammar_cjkRuby: true
---
日期: 2017-07-02 19:03:24

# ConcurrentHashMap
## HashMap
* 线程不安全
多线程的hashMap会引起死循环,导致cpu100%的占用率
在高并发时,大量put会导致hashmap的扩容,两个线程同时调用resize函数就可能会造成同一位置的链表循环,在get操作触发死循环;
```java?linenums
    void transfer(Entry[] newTable, boolean rehash) {
        int newCapacity = newTable.length;
        for (Entry<K,V> e : table) {
            while(null != e) {
                Entry<K,V> next = e.next;
                if (rehash) {
                    e.hash = null == e.key ? 0 : hash(e.key);
                }
                int i = indexFor(e.hash, newCapacity);
                e.next = newTable[i];
                newTable[i] = e;
                e = next;
            }
        }
    }
```
假设 同一个table[index] 处 有链表 节点 11->12
resize 过程中
1. a线程移动节点 11  代码行 5;
2. b线线程也开始移动,
3. b在a线程获取11节点后率先完成了resize 对11节点的处理
4. a用11节点继续resize 则结果为 11->11 循环链表
![hashmap多线程不安全死循环][1]


----

wanheming1991@gmail.com


  [1]: http://oq6m1y13p.bkt.clouddn.com/1499005152901.jpg