# bowen1-cli

## 一、 初始化

指令：bowen1-cli init <projectName>
流程

```
1.控制台执行：bowen1-cli init <projectName>
2.选择：创建空白项目；应用现有模板
3.若应用现有模板：拉取远程仓库项目模板 => 选择制定模板进行实例化
4.创建空白项目：执行vue create -p <preset-vue.json> <projectName>
```

注：

应答

```
1.选择创建项目的类型：vue项目 | 代码库 | studio组件 | UI组件
2.若选择vue项目：需要再次应答创建空白模板或应用现有模板；若其他项目类型，只可从现有模板应用
3.确定是否属于微应用。
```

应答

```
1.vue的版本： vue2 | vue3
2.是否使用vuex
3.是否使用ts
4.是否支持pwa

应用现有模板需应答的选项：
1.通过项目类型自动过滤对应的项目模板，并列出支持的所有项目列表供选择。这一块需要结合template-project项目一块考虑。
```
