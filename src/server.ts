import { PluginData } from './types'
import {
  Config,
  createOpenAPI,
  createWebsocket,
  OpenAPI,
  WebsocketClient,
} from 'qb-sdk'
import { loadImplFromPackageJson } from './utils/plugin_loader'

const impl = await loadImplFromPackageJson()

class Server {
  client: OpenAPI | null = null
  ws: WebsocketClient | null = null
  plugins: PluginData[] = []
  run(botConfig: Config) {
    this.client = createOpenAPI(botConfig)
    this.ws = createWebsocket(botConfig)
    this.plugins = impl.plugins
    this.plugins.forEach((plugin: PluginData) => {
      this.ws?.on(plugin.event, plugin.listener)
    })
  }
}

export const server = new Server()
