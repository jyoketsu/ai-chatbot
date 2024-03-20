import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import mongoose from 'mongoose'

export default function IndexPage() {
  const objectId = new mongoose.Types.ObjectId()
  const id = objectId.toString()

  return <Chat id={id} />
}
