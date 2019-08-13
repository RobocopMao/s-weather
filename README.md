# s-weather 天气晴报小程序

## 数据与API

大部分数据采用的心知天气的开放API开发者版本，公钥和私钥我没有传上来，可以去心知天气官网申请试用版（10000次请求）密钥，试用版和开发版数据一致。

城市搜索和热门城市采用和风天气API，但是数字签名按照文档步骤来一直报签名无效，所以没有用。

定位使用的qqmap-wx-jssdk, 秘钥也没有传上来，有需要请自己去腾讯地图申请。

目前密钥在src/apis/config.js里面配置。

## 使用技术简介

### 1.框架

采用的Taro，React Hooks风格个人比较喜欢，而且只需关注js和css文件，不用多个文件切换。

### 2.骨架屏

这个采用的jayZOU/skeleton的github开源代码，原生的，不过我用Taro转换成Taro的代码了。实际用起来和想的不太一样，所以我只在小程序初始化时添加了整屏加载，有需要你可以自己去加class。代码我放在了components/common下。参考：https://github.com/jayZOU/skeleton
。

### 3.redux

Taro初始化的redux项目模版，三个文件夹，自己把constant，reducer，action按模块和在一个文件夹下，个人感觉更直观。

### 4.样式布局

布局采用的flex布局，在assets/styles下初始化了很多基础样式，material design的颜色，iconfont.scss是阿里矢量图的在线字体图标，具体使用可自行百度。基础样式写好后，真的很方便，虽然jsx里面很多class，但是页面css很少写，个人觉得很好。初始化也很方面，比如初始化1-100px的高度只需要用到sass的一些循环语句，一下就搞定了，具体语法参见：https://www.sass.hk/docs/
。

### 5.小程序的分包

虽然页面不多，但是还是做了分包，以后万一需要呢？分包配置可以去小程序文档查看，我是参见文档下面的示例项目整理的文件目录，不是按照文档的目录整理的。看个人吧。参考文档：https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages/basic.html
。

### 6.自定义头部导航栏

我现在只用了首页的自定义导航栏，代码放在components/base下面。这个百度也很多，我也是参照别人的弄的。参考：https://www.jianshu.com/p/5877a3dc0b1e
。

### 7.antV/F2 图表
阿里移动端统计图表，参考：https://antv.alipay.com/zh-cn/index.html
。我没有用wx-f2组件：https://github.com/antvis/wx-f2/tree/custom-components
，只是借鉴了其绑定小程序上下文的方法，写的时候语法都一样。

### 8.腾讯地图标记
空气质量详情附近站点的空气质量采用腾讯地图标记，文档可以直接查看官方Map组件。

开发不易，禁止任何二次打包发布。

小程序码

![image](src/assets/images/minicode.jpg)


