import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'

const exampleMessages = [
  {
    heading: '讲解技术概念',
    message: `什么是"docker-compose"？`
  },
  {
    heading: '帮我挑选: 一套在镜头前好看的服装',
    message: '我明天有场摄影。你能推荐我一些在镜头下好看的颜色和服装选择吗？'
  },
  {
    heading: '编写一段文字: 邀请我的邻居参加烧烤',
    message: `写一条简短又亲切的短信，邀请我的邻居来烧烤。`
  }
]

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, 'setInput'>) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">
          欢迎使用Soar Ai聊天机器人！
        </h1>
        <p className="mb-2 leading-normal text-muted-foreground">
          我今天能帮你做什么？
        </p>
        <p className="leading-normal text-muted-foreground">
          您可以从这里开始对话，或尝试以下示例：
        </p>
        <div className="mt-4 flex flex-col items-start space-y-2">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              onClick={() => setInput(message.message)}
            >
              <IconArrowRight className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
