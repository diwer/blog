#第九章 接口
##9.1 抽象类和抽象方法
不能实例对象的类

##9.2接口
只有一组public 的方法且 自己有包 的域 public 和private

##9.3 完全解耦
1. 策略模式
多种实现父类接口的子类， 选择调用 
2. 代理模式
利用其他以实现接口的类 实现接口

##9.4 java中的多重继承
利用实现多个接口 完成多重继承。仅在 方法上  
用接口定义类型 更灵活的使用 向上转型的优势

##9.5 通过继承扩展接口
接口可以继承接口 来扩展 接口

##9.6 适配接口
##9.7 接口中域
1. 在接口中的都是 `static` 和 `final`的 
2. 不允许为空
3. 工厂模式
通过不同的工程生成实现统一接口的不同实现的对象  
  
```
    public interface Game{
        bool move(int c);
    }
    public interface GameFactory{
        Game getGame();
    }
    public class A implements Game{
        bool move(int c){
            System.out.println("A:"+c);
        }
    }
    public class B implements Game{
            bool move(int c){
            System.out.println("B:"+c);
        }
    }
    public class AFactory implements GameFactory{
        Game getGame(){
        return new A();
        }
    }
    public class BFactory implements GameFactory{
        Game getGame(){
        return new B();
        }
    }
    public class Games{
        public void playGame(GameFactory factory){
            Game g=factory.getGame();
            g.move(10);
        }
        public void static main(string []args){
            playGame(new AFactory());
            playGame(new BFactory());
        }
    }

```
##总结
***接口带来的优势容易造成滥用，需要大量编码来增长这方面的经验***