'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth, signIn } from '@/auth'
import { type Chat } from '@/lib/types'
import { AuthError } from 'next-auth'
import dbConnect from '@/lib/dbConnect'
import ChatDao from '@/lib/dao/chatDao'

export async function getChats(userId?: string | null) {
  if (!userId) {
    return []
  }

  try {
    await dbConnect()
    let chatDao = new ChatDao()
    const chats = await chatDao.getChats(userId)
    return chats as Chat[]
  } catch (error) {
    return []
  }
}

export async function getChat(id: string, userId: string) {
  await dbConnect()
  let chatDao = new ChatDao()
  const chat = await chatDao.findById(id)
  if (!chat || (userId && chat.userId !== userId)) {
    return null
  }

  return chat
}

export async function removeChat({ id, path }: { id: string; path: string }) {
  const session = await auth()

  if (!session) {
    return {
      error: 'Unauthorized'
    }
  }

  await dbConnect()

  //Convert uid to string for consistent comparison with session.user.id
  let chatDao = new ChatDao()
  const uidRes = await chatDao.findById(id, 'userId')
  console.log('---uid---', uidRes)

  if (uidRes.userId !== session?.user?.id) {
    return {
      error: 'Unauthorized'
    }
  }

  await chatDao.findByIdAndDelete(id)

  revalidatePath('/')
  return revalidatePath(path)
}

export async function clearChats() {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      error: 'Unauthorized'
    }
  }

  await dbConnect()
  let chatDao = new ChatDao()

  const chats = await chatDao.getChats(session.user.id, 'userId')
  if (!chats.length) {
    return redirect('/')
  }
  await chatDao.clearChats(session.user.id)

  revalidatePath('/')
  return redirect('/')
}

export async function getSharedChat(id: string) {
  // const chat = await kv.hgetall<Chat>(`chat:${id}`)

  // if (!chat || !chat.sharePath) {
  //   return null
  // }

  // return chat
}

export async function shareChat(id: string) {
  // const session = await auth()

  // if (!session?.user?.id) {
  //   return {
  //     error: 'Unauthorized'
  //   }
  // }

  // const chat = await kv.hgetall<Chat>(`chat:${id}`)

  // if (!chat || chat.userId !== session.user.id) {
  //   return {
  //     error: 'Something went wrong'
  //   }
  // }

  // const payload = {
  //   ...chat,
  //   sharePath: `/share/${chat.id}`
  // }

  // await kv.hmset(`chat:${chat.id}`, payload)

  // return payload
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn('credentials', formData)
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return '登录失败！'
        default:
          return '服务出错！'
      }
    }
    throw error
  }
}
