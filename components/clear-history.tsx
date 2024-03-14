'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

import { ServerActionResult } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { IconSpinner } from '@/components/ui/icons'

interface ClearHistoryProps {
  isEnabled: boolean
  clearChats: () => ServerActionResult<void>
}

export function ClearHistory({
  isEnabled = false,
  clearChats
}: ClearHistoryProps) {
  const [open, setOpen] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()
  const router = useRouter()

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" disabled={!isEnabled || isPending}>
          {isPending && <IconSpinner className="mr-2" />}
          清空聊天记录
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确定要清空吗?</AlertDialogTitle>
          <AlertDialogDescription>
            这会永久从服务器中删除您的聊天记录
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>取消</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={event => {
              event.preventDefault()
              startTransition(() => {
                clearChats().then(result => {
                  if (result && 'error' in result) {
                    toast.error(result.error)
                    return
                  }

                  setOpen(false)
                  router.push('/')
                })
              })
            }}
          >
            {isPending && <IconSpinner className="mr-2 animate-spin" />}
            删除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
