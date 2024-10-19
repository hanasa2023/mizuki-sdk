import { AvailableIntentsEventsEnum } from 'qb-sdk'

interface PluginData {
  event: AvailableIntentsEventsEnum
  listener: (...args: any) => void
}

interface IImpl {
  plugins: PluginData[]
}

export { PluginData, IImpl }
