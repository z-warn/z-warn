# `Z-WARN`



## 简介

基于CloudFlare `worker` 和 `KV` 的telegram bot 消息推送提醒

不想折腾的可戳 👉   [机器人]( http://t.me/zwarn_bot  "Z-WARN") （部分功能尚未完善）

> ⚠️ 本人承诺不会向外部泄漏用户任何信息，如若担心隐私保障，自己动手搭建或不用就完事了



## 特点

* CloudFlare赠送免费额度，无需服务费用
* 利用CloudFlare网络，无网络连接性限制
* 模板化消息（tag / 标题 / 正文）
* 支持一对多推送
* Telegram 提供记录永久保留

## 准备

* CloudFlare账号

  > tips：[CloudFlare官网](https://dash.cloudflare.com/)

* Telegram bot

  > tips：机器人申请或token获取使用 [@BotFather](https://t.me/BotFather) 

* Node.js (通过CLI部署需要)

  > tips：[Node.js官网](https://nodejs.org/)

## CloudFlare面板部署

* 绑定worker子域

* 创建worker

* 复制worker.js代码到编辑器

* 编辑器左上角可设置worker名称

* 点击部署按钮确定部署

* 设置环境变量

  * BOT_TOKEN  ==>  bot token

* 创建KV，命名随意

* Worker 绑定 KV

  * TOKEN
  * MAIN_INFO

  

## CLI部署

### 安装wrangler

```
npm i @cloudflare/wrangler -g
```

### 配置账号

* 方法一 :

  命令键入  ` wrangler login ` 

  输入y 会跳转到浏览器页面确认

* 方法二 :

  命令键入  ` wrangler config `

  输入API TOKEN

* 方法三：

  设置环境变量

  ```
  CF_ACCOUNT_ID=accountID CF_API_TOKEN=veryLongAPIToken wrangler publish
  ```

  或

  ```
  CF_EMAIL=cloudflareEmail CF_API_KEY=veryLongAPI wrangler publish
  ```

> 官方完整账号配置文档 https://developers.cloudflare.com/workers/cli-wrangler/authentication



### clone仓库

```shell
git clone https://github.com/z-warn/z-warn.git
```

### 安装依赖

```shell
npm i
```

### 创建 KV空间

```shell
npm run creat_kv
```

> **保存输出信息 **

### 设置个人配置

编辑 `wrangler.toml` 文件

* **name**  -- worker名称

* **account_id**  -- cf账号id

* **route**  -- worker路由

* **zone_id**  -- cf 区域id

* **BOT_TOKEN**  -- tg 机器人Token

* **kv_namespaces**  -- 创建KV空间时保存的输出信息

## 发布

``` shell
npm run publish
```

## API

**说明: GET 请求参数添加至params，POST 请求参数以Json格式添加至body**

#### /creatToken

* 请求方式：GET

* 说明：创建新的Token

* 无参数

#### /< token >/addChat

* 请求方式：GET / POST

* 说明：添加需要发送提醒的Chat

* 参数
  
  * chat   -- telegram 的chat_id或以@开头的公开username
  
  > ⚠️ 私人账户的username 似乎无法使用

#### /< token >/delChat

* 请求方式：GET / POST

* 说明：移除发送提醒的Chat

* 参数
  
  * chat   -- telegram 的chat_id或以@开头的公开username
  
  > ⚠️ 私人账户的username 似乎无法使用

### /< token >/send

* 请求方式：GET / POST
* 说明：发送提醒消息

* 参数
  * tag 标记（多个tag以逗号分隔， 非必需）
  
   * title 消息标题（非必需）
  
   * text 消息正文（必需）
  
   * mode 消息输入格式（支持Markdown，Html，默认无。 
  
     [TG官方示例说明]: https://core.telegram.org/bots/api#html-style
  
   * mute 消息正文（静音发送，true为开启，默认false）
  
   - pageview 消息正文（页面预览，true为开启，默认true）

## 更新日志

***

-   _2020/02/23_  **V1.0.1**
  - 支持多Tag
  - 支持Markdown、Html格式消息
  - 增加静音通知参数
  -  增加网页预览关闭
  -  增加跨域设置

***

-  _2020/02/20_  **V 1.0.0** 
  - 初步构建发布第一版本
  - 实现初始化账户
  - 实现发送请求
  - 实现添加与删除群组到目标Chat

## License

MIT