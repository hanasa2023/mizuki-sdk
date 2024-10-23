import { GroupContext } from '@src/contexts'
import { AvailableIntentsEventsEnum } from 'qb-sdk'

export interface PluginMetadata {
  name: string
}

export interface HandlerMetadata {
  name: string | symbol
  pluginName: string
  command: string
  event: AvailableIntentsEventsEnum
  priority: number
  block: boolean
}

export interface Handler {
  metadata: HandlerMetadata
  listener: (groupContext: GroupContext, ...args: any[]) => Promise<void>
}
