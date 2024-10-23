![mizuki-sdk](https://socialify.git.ci/hanasa2023/mizuki-sdk/image?description=1&font=Jost&forks=1&issues=1&language=1&logo=https%3A%2F%2Fpicx.zhimg.com%2F80%2Fv2-bdae55043d61d7bcfeeabead6e953959_1440w.jpeg%3Fsource%3Dd16d100b&name=1&pattern=Circuit%20Board&pulls=1&stargazers=1&theme=Light)

<div align="center">

[Document | 文档](https://blog.hanasaki.tech/2024/10/23/mizuki-sdk/)

</div>

# mizuki-sdk

基于腾讯官方typescript sdk 的改版[qb-sdk](https://www.npmjs.com/package/qb-sdk?activeTab=readme)实现的 NTQQ 接入框架。

> ⚠️ 本项目由于使用了装饰器特性，只支持使用 typescript 进行开发。

## 安装与使用

### 注册QQ开放平台机器人

- 前往[QQ开放平台](https://q.qq.com/#/),注册机器人
- 点击机器人卡片，在[开发 > 开发设置](https://q.qq.com/qqbot/#/developer/developer-setting)里获取AppID和Token

### 安装与配置本项目

在你的项目文件夹中

```bash
# npm
npm install mizuki-sdk

# yarn
yarn add mizuki-sdk
```

修改 `tsconfig.json`，开启装饰器

```json
{
    "compilerOptions": {
        ...
        "experimentalDecorators": true,
        ...
    }
}
```

### 开始你的第一个 hello world

我们新建一个`main.ts` 和 一个文件夹 `plugins`，并在此文件夹新建一个`index.ts`，和`hello-world.ts`

```typescript
// main.ts
import { server, AvailableIntentsEventsEnum } from 'mizuki-sdk'
import './plugins/index.ts'

const config = {
  appID: '<your appID>',
  token: '<your token>',
  intents: [AvailableIntentsEventsEnum.GROUP_AND_C2C_EVENT],
  sandbox: true,
}

await server.run(config)
```

```typescript
// plugins/index.ts
export * from './hello-world'
```

```typescript
// plugins/hello-world.ts
import { mapper, plugins, GroupContext, MessageType } from 'mizuki-sdk'

@plugins.register('hello-world')
export class HelloWorld {
  @mapper.onGroupAt()
  async helloWorld(groupContext: GroupContext) {
    await groupContext.post(groupContext.data.msg.group_openid, {
      msg_type: MessageType.TEXT,
      msg_id: groupContext.data.msg.id,
      content: 'hello world',
    })
  }
}
```

如果你想要自定义响应指令，可以通过`onGroupAt`中的`options`字段中的`command`设置，除此之外
，你还可以通过`priority`和`block`设置事件响应器优先级和是否阻塞

> ⚠️ 为了适配QQ官方的指令配置，默认响应指令头为`\`，也就是说，如果你设置`command: 'hello'`，则需通过`/hello`触发

```typescript
// plugins/hello.ts
import { mapper, plugins, GroupContext } from 'mizuki-sdk'

@plugins.register('hello')
export class Hello {
  @mapper.onGroupAt({ command: 'hello' })
  async hello(groupContext: GroupContext) {
    await groupContext.post(groupContext.data.msg.group_openid, {
      msg_type: MessageType.TEXT,
      msg_id: groupContext.data.msg.id,
      content: 'hello',
    })
  }
}

// ⚠️ 注意别忘了在plugin/index.ts中添加导出语句
```

如果你还想为server配置更多选项，目前提供了日志等级设置和启用内建插件功能，你可以将`main.ts`中对`server`的调用更改为：

```typescript
// main.ts
await server
  .setLogLevel('info')
  .useBuiltinPlugins(['echo', 'get_message_data'])
  .run(config)
```
