import 'reflect-metadata'
import { MetadataKey } from './types/enums'
import { HandlerMetadata, OnGroupAtOptions } from './types'
import { AvailableIntentsEventsEnum } from 'qb-sdk'

export class Mapper {
  onGroupAt(options: OnGroupAtOptions): MethodDecorator {
    const { command = '', priority = 1, block = false } = options
    return function (
      target: any,
      propertyKey: string | symbol,
      _: PropertyDescriptor,
    ) {
      const handlerMetadata: HandlerMetadata = {
        name: propertyKey,
        pluginName: 'undefined',
        command,
        event: AvailableIntentsEventsEnum.GROUP_AND_C2C_EVENT,
        priority,
        block,
      }
      Reflect.defineMetadata(
        MetadataKey.HANDLER,
        handlerMetadata,
        target,
        propertyKey,
      )
    }
  }
}

export const mapper = new Mapper()
