#第八章 多态.md
多态将 实现和接口分离开

##8.1再论向上转型
父类提供者使用的一般（通用接口）子类改变实现细节 向上转型的用法
##8.2转机 
1. 方法调用绑定  
由编译器和连接器进行的绑定叫做前期绑定  
***重点:*** java中static 和final 方法不支持运行时绑定
final 关键字提升的性能有限 应该从设计的角度来使用final关键字

2 子类只能重写非private方法，且避免与父类private 方法重名

##8.3 构造器与多态
##8.4 清理
一定要调用父类的dispose方法  
在构造函数中要避免调用动态绑定的方法。会有出人意料的问题
```
    public class FatherClass{
        protect string name;
        public base(){
            init()
        }
        public void init(){
            print(name);
        }
    }
    public class SonClass{
        private int index;
        @override
        public void init(){
            print(index);
        }
    }
```
在这个例子中 sonclass 的对象构造函数调用 会打印一个没有初始化的index
但是java分配内存是会将内存初始化为0 所以打印的结果 是0

##8.4 协变返回类型
协变 就是 在重写父类的方法时  可以改变父类返回类型的 子类类型
```
    public class A
    {
    }
    public class B extends A{
    }
    public class C{
        public A getA(){
        return new A();
        }
    }
    public class D extends C{
       @override
       public B getA(){
       return new B();
       } 
    }
    
```
##8.5 用继承做设计
在使用继承做设计的时候 一定要记得组合 优于继承

1. 用继承表达行为之间的区别
2. 用字段表达状态的区别