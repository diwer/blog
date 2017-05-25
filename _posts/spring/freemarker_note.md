# Spring MVC 4 + freemarker

## 视图解析器
spring 提供了freemarker 的视图解析器

`org.springframework.web.servlet.view.freemarker.FreeMarkerViewResolver`

可以用AppConfig 继承 WebMvcConfigurerAdapter 实现freemarker的配置 和 视图解析器的设置
```java
@Configuration
public class AppConfig extends WebMvcConfigurerAdapter{
    @Bean(name ="freemarkerConfig")
    public FreeMarkerConfigurer freemarkerConfig() {
        FreeMarkerConfigurer configurer = new FreeMarkerConfigurer();
        configurer.setTemplateLoaderPath("/WEB-INF/views/");
        Map<String, Object> map = new HashMap<>();
        map.put("xml_escape", new XmlEscape());
        configurer.setFreemarkerVariables(map);
        return configurer;
    }

    @Override
    public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
        configurer.ignoreUnknownPathExtensions(false).defaultContentType(MediaType.TEXT_HTML);
    }
    @Override
    public void configureViewResolvers(ViewResolverRegistry registry) {
        registry.freeMarker();//viewResolvers 配置为freemarker 可以不使用配置文件（使用的是默认的设置）
        //可以改为配置文件形式 更灵活 在中文情况还是使用配置文件更为稳妥 有乱码问题
    }
}

```

## Controller 

在controller 用 modelandview 时 
由于 viewresolvers已经设置后缀为某种格式的文件所以 ***不需要加`.后缀`***
```
@Controller
@RequestMapping(value="/SSO")
public class TestController  {

    @Autowired
    private Url url;

    @RequestMapping(value = "/test")
    public ModelAndView getBlog(ModelAndView mv) {
        mv.addObject("blogTitle", "Freemarker Template Demo using Spring");
        mv.addObject("message", "Getting started with Freemarker.<br/>Find a Freemarker template demo using Spring.");
        mv.addObject("references", url.getUrlList());
        mv.setViewName("test");//此处不用加后缀 
        //mv.setViewName("test.ftl") // test.ftl 是错误的
        return mv;
    }
}

```
## 传递参数

给模板传递参数 参数为空会报错，可以用${paramName!""}设置默认值
传递对象 读取格式为$(objectName.feildName)
``` java
    model 类：
    public class User{
        private String name;
        public void setName(String name){
            this.name=name;
        }
        public String getName(){
            return name;
        }
    }
    controller：
    @RequestMapping(value = "/test")
    public ModelAndView getBlog(ModelAndView mv) {
        User testUser=new User()
        testUser.setName("123")
        mv.addObject("user",testUser);//模板里使用的是key的值user
        mv.setViewName("test");//此处不用加后缀 
        //mv.setViewName("test.ftl") // test.ftl 是错误的
        return mv;
    }
    模板：
    ${user.name} // 调用对象的字段
    
```
