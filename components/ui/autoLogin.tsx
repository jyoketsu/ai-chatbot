'use client'

import { authenticate } from '@/app/actions'
import Image from 'next/image'
import { useEffect } from 'react'

export default function AutoLogin({ token }: { token: string }) {
  useEffect(() => {
    let formData = new FormData()
    formData.append('token', token)
    authenticate(undefined, formData)
  }, [token])

  return (
    <div className="auto-login flex-1 flex flex-col items-center justify-center">
      <Image src="/loading.svg" alt="Loading..." width={150} height={150} />
      <span className="mt-3 font-bold text-lg text-gray-500">登录中...</span>
    </div>
  )
}
