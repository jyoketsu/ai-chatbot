import BaseDao from './baseDao'
import Chat from '../models/chat'
import { Chat as ChatType } from '../types'

export default class ChatDao extends BaseDao {
  constructor() {
    super(Chat)
  }

  updateOrCreateChat(_id: string, payload: any) {
    return this.model
      .findOneAndUpdate({ _id }, payload, { new: true, upsert: true })
      .exec()
  }

  getChats(userId: string, projection?: any | null) {
    return this.model
      .find({ userId }, projection || '-_id', { lean: true })
      .exec()
  }
  clearChats(userId: string) {
    return this.model.deleteMany({ userId }).exec()
  }
}
