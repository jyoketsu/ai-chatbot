import React from 'react'

import { cn } from '@/lib/utils'

export function FooterText({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      className={cn(
        'px-2 text-center text-xs leading-normal text-muted-foreground',
        className
      )}
      {...props}
    >
      聊天机器人可能会犯错误。请考虑核实重要信息。
    </p>
  )
}
