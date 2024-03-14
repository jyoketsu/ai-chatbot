import AutoLogin from '@/components/ui/autoLogin'
import LoginForm from '@/components/ui/login-form'

export default function LoginPage({
  searchParams
}: {
  searchParams?: {
    token?: string
  }
}) {
  const token = searchParams?.token
  return (
    <main className="flex items-center justify-center flex-1">
      {token ? (
        <AutoLogin token={token} />
      ) : (
        <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
          <LoginForm />
        </div>
      )}
    </main>
  )
}
