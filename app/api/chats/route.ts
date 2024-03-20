import ChatDao from '@/lib/dao/chatDao'
import dbConnect from '@/lib/dbConnect'

export async function POST(req: Request) {
  const json = await req.json()
  await dbConnect()
  let chatDao = new ChatDao()
  await chatDao.updateOrCreateChat(json.id, json)
  console.log('---插入成功---')
  return new Response(json, { status: 200 })
}
