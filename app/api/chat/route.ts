import mongoose from 'mongoose'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'

import { auth } from '@/auth'
import {
  authorizeByBaokuToken,
  authorizeBySoarToken,
  getUserByToken
} from '@/app/soarApi'

export const runtime = 'edge'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.BASE_URL
})

export async function POST(req: Request) {
  const json = await req.json()
  const userId = (await auth())?.user?.id
  const { messages, previewToken, soarToken, baokuToken } = json
  if (soarToken) {
    const user = await authorizeBySoarToken(soarToken)
    if (!user) {
      return new Response('Unauthorized', {
        status: 401
      })
    }
  } else if (baokuToken) {
    const user = await authorizeByBaokuToken(baokuToken)
    if (!user) {
      return new Response('Unauthorized', {
        status: 401
      })
    }
  } else {
    console.log('---userId---', userId)
    if (!userId) {
      return new Response('Unauthorized', {
        status: 401
      })
    }
  }

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
      if (!baokuToken) {
        const title = json.messages[0].content.substring(0, 100)
        const objectId = new mongoose.Types.ObjectId()
        const initId = objectId.toString()

        const id = json.id ?? initId

        // const createdAt = Date.now()
        const path = `/chat/${id}`
        const payload = {
          id,
          title,
          userId,
          // createdAt,
          path,
          messages: [
            ...messages,
            {
              content: completion,
              role: 'assistant'
            }
          ]
        }

        try {
          await fetch('http://localhost:3000/chatbot/api/chats', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          })
        } catch (error) {
          console.log('---error---', error)
        }
      }
    }
  })

  return new StreamingTextResponse(stream)
}

export function OPTIONS(req: Request) {
  return new Response(null, { status: 200 })
}
