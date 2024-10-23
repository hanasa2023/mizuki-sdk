import {
  GroupATData,
  OpenAPI,
  V2MediaMessageToCreate,
  V2MessageToCreate,
} from 'qb-sdk'

export class GroupContext {
  data: GroupATData
  client: OpenAPI

  constructor(data: GroupATData, client: OpenAPI) {
    this.data = data
    this.client = client
  }

  async post(groupOpenID: string, message: V2MessageToCreate): Promise<any> {
    return await this.client.v2MessageApi.postGroupMessage(groupOpenID, message)
  }

  async postMedia(
    groupOpenID: string,
    message: V2MediaMessageToCreate,
  ): Promise<any> {
    return await this.client.v2MessageApi.postGroupMediaMessage(
      groupOpenID,
      message,
    )
  }

  async delete(groupOpenID: string, messageID: string): Promise<any> {
    return await this.client.v2MessageApi.deleteGroupMessage(
      groupOpenID,
      messageID,
    )
  }
}
