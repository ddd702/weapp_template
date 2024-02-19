## 目录结构说明

```bash
.
├── README.md
├── app.js
├── app.json
├── app.wxss
├── components // 全局组件
├── constants //app中的常量
├── images // 全局公共图片
├── pages // 主包页面
├── store // mobx的公用state,action
├── styles // 全局公共样式
├── subpackages // 分包
├── custom-tab-bar //自定义tabbar组件，微信规定必须放在根目录下，并且名字要custom-tab-bar
├── behaviors // app的behaviors
├── keys // jenkins发布脚本用的小程序秘钥
├── utils // 公共方法
│   ├── auth.js
│   ├── request.js
│   ├── event.js //类似vue的EVENT-BUS
│   └── util.js
├── miniprogram_npm // npm 构建输出库
├── node_modules // npm 依赖
├── publish.js //jenkins发布脚本
├── package.json
├── project.config.json
├── sitemap.json
├── env.js //环境变量设置，类似vue的.env
└── config.js //app全局变量设置
```
### 坑

### 注意

#### app.json文件里的tabBar和config.js中对应的配置,至少保证list相同,选中颜色，图片等在config.js中改

### 添加husky

#### 1.验证提交信息

  提交信息要符合规格，不然提交不上去可参考以下链接的说明 
- [代码管理](https://chali.yuque.com/ehova2/th6tok/vdk9nw/edit) 


#### 2.格式化代码

自动格式化代码，然后再提交到git

