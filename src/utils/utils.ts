import { Handler, HandlerMetadata } from '@src/types/plugin'
import { MetadataKey } from '@src/types/enums'

export function getHandlers(instance: any): Handler[] {
  const prototype = Object.getPrototypeOf(instance)
  const methods = Object.getOwnPropertyNames(prototype).filter(
    (v: string) => v != 'constructor',
  )
  const handlers: Handler[] = []
  methods.forEach((methodName: string) => {
    const metadata: HandlerMetadata = Reflect.getMetadata(
      MetadataKey.HANDLER,
      instance,
      methodName,
    )
    handlers.push({
      metadata,
      listener: instance[methodName],
    })
  })
  return handlers
}
