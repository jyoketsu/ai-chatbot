'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { toast } from 'react-hot-toast'

import { ServerActionResult, type Chat } from '@/lib/types'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { IconShare, IconSpinner, IconTrash } from '@/components/ui/icons'
import { ChatShareDialog } from '@/components/chat-share-dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'

interface SidebarActionsProps {
  chat: Chat
  removeChat: (args: { id: string; path: string }) => ServerActionResult<void>
  // shareChat: (id: string) => ServerActionResult<Chat>
}

export function SidebarActions({
  chat,
  removeChat,
  // shareChat
}: SidebarActionsProps) {
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false)
  const [isRemovePending, startRemoveTransition] = React.useTransition()

  return (
    <>
      <div className="space-x-1">
        {/* <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="size-6 p-0 hover:bg-background"
              onClick={() => setShareDialogOpen(true)}
            >
              <IconShare />
              <span className="sr-only">Share</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share chat</TooltipContent>
        </Tooltip> */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="size-6 p-0 hover:bg-background"
              disabled={isRemovePending}
              onClick={() => setDeleteDialogOpen(true)}
            >
              <IconTrash />
              <span className="sr-only">删除</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>删除对话</TooltipContent>
        </Tooltip>
      </div>
      {/* <ChatShareDialog
        chat={chat}
        shareChat={shareChat}
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        onCopy={() => setShareDialogOpen(false)}
      /> */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确定要删除吗?</AlertDialogTitle>
            <AlertDialogDescription>
              这会永久删除您的对话，且不能恢复，确定要继续吗？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemovePending}>
              取消
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isRemovePending}
              onClick={event => {
                event.preventDefault()
                // @ts-ignore
                startRemoveTransition(async () => {
                  const result = await removeChat({
                    id: chat.id,
                    path: chat.path
                  })

                  if (result && 'error' in result) {
                    toast.error(result.error)
                    return
                  }

                  setDeleteDialogOpen(false)
                  router.refresh()
                  router.push('/')
                  toast.success('对话已删除')
                })
              }}
            >
              {isRemovePending && <IconSpinner className="mr-2 animate-spin" />}
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
