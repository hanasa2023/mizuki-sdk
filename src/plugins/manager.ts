import BotLogger from 'node-color-log'
import { Handler } from '@src/types'
import { getHandlers } from '@src/utils/utils'

BotLogger.setDate(() => new Date().toLocaleTimeString())

export class Plugins {
  // plugins: <插件名, 插件对应的类的实例>
  private static plugins: Map<string, any> = new Map()

  static registerPlugin(name: string, instance: any) {
    if (!this.plugins.has(name)) {
      this.plugins.set(name, instance)
    }
  }

  static unregisterPlugin(name: string): boolean {
    if (this.plugins.has(name)) {
      this.plugins.delete(name)
      return true
    } else {
      return false
    }
  }

  static getPlugins() {
    return this.plugins
  }

  static loadHandlers(): Handler[] {
    let handlers: Handler[] = []

    this.plugins.forEach((v: any, key: string) => {
      const _handlers = getHandlers(v).map((_h: Handler) => {
        _h.metadata.pluginName = key
        return _h
      })
      handlers = handlers.concat(_handlers)
    })

    handlers = handlers.sort((a: Handler, b: Handler) => {
      return a.metadata.priority - b.metadata.priority
    })
    handlers.forEach((handler: Handler) => {
      BotLogger.info(
        `load handler ${String(handler.metadata.name)} from plugin ${handler.metadata.pluginName}`,
      )
    })
    return handlers
  }
}

export class PluginManager {
  register(name: string): ClassDecorator {
    return function (target: any) {
      Plugins.registerPlugin(name, new target())
    }
  }

  unregister(name: string) {
    if (Plugins.unregisterPlugin(name)) {
      BotLogger.info(`插件${name}已取消注册`)
    } else {
      BotLogger.info(`没有${name}这个插件，取消注册失败`)
    }
  }

  getLoadedPlugins(): string[] {
    return Plugins.getPlugins().keys().toArray()
  }
}

export const plugins = new PluginManager()
