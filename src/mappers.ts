import { AvailableIntentsEventsEnum } from 'qb-sdk'

class Mappers {
  onGroupAt(target: any, _: string, descriptor: PropertyDescriptor) {
    target.constructor.plugins.push({
      event: AvailableIntentsEventsEnum.GROUP_AND_C2C_EVENT,
      listener: descriptor.value,
    })
  }
}

export const mapper = new Mappers()
