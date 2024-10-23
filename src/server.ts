import { Handler } from './types/plugin'
import {
  AvailableIntentsEventsEnum,
  Config,
  createOpenAPI,
  createWebsocket,
  GroupATData,
} from 'qb-sdk'
import { Plugins } from './plugins'
import { FinishSessionError } from './errors'
import BotLogger from 'node-color-log'
import { GroupContext } from './contexts'
import { Echo, GetMessageData } from './plugins/builtin-plugins'
import { LogLevel } from './types'

BotLogger.setDate(() => new Date().toLocaleTimeString())

export class Server {
  handlers: Handler[] = []

  useBuiltinPlugins(plugins: string[]) {
    const builtinPlugins: Map<string, any> = new Map()
    builtinPlugins.set('echo', Echo)
    builtinPlugins.set('get_message_data', GetMessageData)
    plugins.forEach((name: string) => {
      if (builtinPlugins.has(name)) {
        const PluginClass = builtinPlugins.get(name)
        if (PluginClass) {
          const pluginInstance = new PluginClass() as any
          Plugins.registerPlugin(name, pluginInstance)
        } else {
          BotLogger.info(`没有${name}这个内置插件`)
        }
      } else {
        BotLogger.info(`没有${name}这个内置插件`)
      }
    })
    return this
  }

  setLogLevel(level: LogLevel) {
    BotLogger.setLevel(level)
    return this
  }

  async run(botConfig: Config) {
    // 创建client和websocket
    const client = createOpenAPI(botConfig)
    const ws = createWebsocket(botConfig)

    this.handlers = Plugins.loadHandlers()

    ws?.on(
      AvailableIntentsEventsEnum.GROUP_AND_C2C_EVENT,
      async (data: GroupATData) => {
        try {
          data.msg.content = data.msg.content.trim()
          const groupContext: GroupContext = new GroupContext(data, client)

          BotLogger.info('Start handler by priority 1..99')
          for (const handler of this.handlers) {
            const command = handler.metadata.command
            const regexp = new RegExp(`^/${command}`)
            if (command == '') {
              BotLogger.info(`handled by ${handler.metadata.pluginName}`)
              await handler.listener(groupContext)
            } else {
              if (regexp.test(data.msg.content)) {
                BotLogger.info(`handled by ${handler.metadata.pluginName}`)
                groupContext.data.msg.content = groupContext.data.msg.content
                  .replace(regexp, '')
                  .trim()
                await handler.listener(groupContext)
                if (handler.metadata.block) {
                  throw new FinishSessionError()
                }
              }
            }
          }
          BotLogger.info('Stop handlers...')
        } catch (e: any) {
          if (e instanceof FinishSessionError) {
            BotLogger.info('Stop handlers...')
          } else {
            BotLogger.error(e.message)
          }
        }
      }
    )
  }
}

export const server = new Server()
