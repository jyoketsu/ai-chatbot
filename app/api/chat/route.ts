import { kv } from '@vercel/kv'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'

import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'

export const runtime = 'edge'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.BASE_URL
})

export async function POST(req: Request) {
  const json = await req.json()
  const { messages, previewToken } = json
  // const userId = (await auth())?.user.id

  // if (!userId) {
  //   return new Response('Unauthorized', {
  //     status: 401
  //   })
  // }

  if (previewToken) {
    openai.apiKey = previewToken
  }

  const res = await openai.chat.completions.create({
    model: 'moonshot-v1-8k',
    messages: [
      {
        role: 'system',
        content:
          '你是Soar AI，由江苏时光科技提供的人工智能助手，你更擅长中文和英文的对话。你会为用户提供安全，有帮助，准确的回答。同时，你会拒绝一切涉及恐怖主义，种族歧视，黄色暴力等问题的回答。时光科技为专有名词，不可翻译成其他语言。'
      },
      ...messages
    ],
    temperature: 0.7,
    stream: true
  })

  const stream = OpenAIStream(res, {
    async onCompletion(completion) {
      const title = json.messages[0].content.substring(0, 100)
      const id = json.id ?? nanoid()
      const createdAt = Date.now()
      const path = `/chat/${id}`
      // const payload = {
      //   id,
      //   title,
      //   userId,
      //   createdAt,
      //   path,
      //   messages: [
      //     ...messages,
      //     {
      //       content: completion,
      //       role: 'assistant'
      //     }
      //   ]
      // }
      // await kv.hmset(`chat:${id}`, payload)
      // await kv.zadd(`user:chat:${userId}`, {
      //   score: createdAt,
      //   member: `chat:${id}`
      // })
    }
  })

  return new StreamingTextResponse(stream)
}
