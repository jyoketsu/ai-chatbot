import { Schema, model, Document, models } from 'mongoose'
import { Chat } from '../types'

const schema = new Schema<Chat>(
  {
    id: {
      type: String,
      maxLength: 50,
      trim: true,
      required: [true, 'Please provide a id.']
    },
    title: {
      type: String,
      required: [true, 'Please provide a title.'],
      maxlength: [160, 'Name cannot be more than 160 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    userId: {
      type: String,
      required: [true, 'Please provide a userId.']
    },
    path: {
      type: String,
      required: [true, 'Please provide a path.']
    },
    messages: [
      {
        type: Object,
        required: [true, 'Please provide a messages.']
      }
    ],
    sharePath: { type: String }
  },
  {
    timestamps: { createdAt: 'createdAt' }
  }
)

export default models.Chat || model<Chat>('Chat', schema)
