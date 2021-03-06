#java 编程思想 第二章 一切都是对象

##2.1 用引用操作对象
java除了简单类型，其他都是对象，然后用引用的方式操作对象； 


##2.2必须有你创建所有的对象
    1.基本类型的只 存储在堆栈中 java的基本类型占固定大小，移植性更高
    2.基本类型都有与之对应的对象类型，可以装箱和拆箱
    3.将引用存储在堆栈，将对象存储在堆中
    4.当创建对象数组时，实质是创建了引用数组，且引用都有默认值null。
##2.3永远不要销毁对象
    1.java没有大括号作用域对同一名称的变量无效
```
{
    int x=20;
    {
        int x=10; //***java中不允许出现这样子的重复定义***
    }
}
```
    2.java对象作用域，只存在他所属的大括号之间
##2.4创建新的数据类型： 类
我理解的类 更倾向于作为存储数据的数据结构使用，类型以接口为主。

`interface`：由interface 定义行为

`abstract class`：  abstact class 实现基本行为 

`class`：由class完成更精细的实现

类成员的基本类型都会有默认初始化，但局部变量会取随机值 或 null

| 基本数据类型        | 默认值           |
| ------------- |:-------------:| 
| boolean     | false | 
| char     | centered      | 
| byte | (byte)0      |
|short|(short)0|
|int|0|
|long|0l|
|fload|0.0f|
|double|0.0d| 

##2.5方法，参数与返回值

    1.静态方法针对于类，与对象无关
    2.方法仅存在于对象中
    3.参数列表中的对象参数 仅仅传递的是引用 ’所以容易在函数体里改变对象的值，而外界无感知造成错误‘
    
##2.5构建一个java程序
    1.包名一般为开发者或公司所属域名 ’各种工具函数包每个公司都会包装一个，为什么不弄一套 放进jdk（吐槽）然并卵 总会有需求构建这样的公司自己的工具包-。-！‘
    2.对于’static‘ 修饰的方法或对象 在存储控件只会有一份数据
    3.对于’static‘修饰的方法 对类本身的对象没有任何联系(的确如此)
    4.static 方法为不需要对象能调用 存在的
##2.8注释和嵌入式文档
    1.javadoc 只会输出public 和 protect修饰方法的注释
    2.javadoc 命令语句 仅能存在于’/**‘开头的注释中
###一些标签示例
    1.@see引用其他类
        @see可以连接到其他类的文档
        @see classname
        @see fully-qualified-classname
        @see fully-qualified-classname#method-name
        常见 Seealso 链接就是用这个标签
    2.@link 行内连接 与@see类似
    3.@docRoot 产生文档到根目录的相对路径，用于文档树的显式超链接
    4.@inheritDoc 从基类继承文档
    5.@version 对版本的说明
    6.@author 作者 都知道
    7.@since  支持的最早banben
    8.@param 对参数的解释
    9.@return 对于返回值得描述
    10.@throws  对于可能抛出异常的描述
##2.9 编码风格
    1.方法首字母小写 每个单词大写
    2.类名首字母大写
    3.变量名小写开头
    4.static final 修饰的只大写切单词间有分隔符