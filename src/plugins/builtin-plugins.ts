import { GroupContext } from '@src/contexts'
import { mapper } from '@src/mapper'
import BotLogger from 'node-color-log'
import { MessageType } from 'qb-sdk'

BotLogger.setDate(() => new Date().toLocaleTimeString())

export class Echo {
  @mapper.onGroupAt({ command: 'echo', priority: 99 })
  async _echo(groupContext: GroupContext) {
    await groupContext.post(groupContext.data.msg.group_openid, {
      msg_type: MessageType.TEXT,
      msg_id: groupContext.data.msg.id,
      content: groupContext.data.msg.content,
    })
  }
}

export class GetMessageData {
  @mapper.onGroupAt({ priority: 99 })
  async _getMessageData(groupContext: GroupContext) {
    BotLogger.info('接收到的消息为:', groupContext.data)
  }
}
