#第十三章 字符串.md
##13.1不可变String
string对象是不可变的，在你更改了值得string对象都是新创建的
1. 对于一个方法而言 参数是提供使用的信息 而非改变参数的值

##13.2 stringbuilder
‘+’ 操作符会被优化成stringbuilder.append()

在`{}`作用域中会心建一个stringbuilder对象，所以针对循环 最好自己创建stringbuilder
提示字符串相加的性能问题

##13.3 无意识的递归
在toString（)方法中想打印内存地址应使用supper.toString()
而不是不是this  使用this将会发生类型转换导致递归

##13.4String的操作
