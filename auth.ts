import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { authConfig } from './auth.config'
import { z } from 'zod'
import { getUserByToken, login } from './app/soarApi'

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      async authorize(credentials, req) {
        if (credentials.token) {
          const user = await getUserByToken(credentials.token as string)
          if (user) {
            return {
              id: user._key,
              name: user.userName,
              email: user.email,
              image: user.userAvatar
            }
          } else {
            return null
          }
        } else {
          const parsedCredentials = z
            .object({ mobile: z.string(), password: z.string().min(6) })
            .safeParse(credentials)

          if (parsedCredentials.success) {
            const { mobile, password } = parsedCredentials.data

            const user = await login(mobile, password)
            if (user) {
              return {
                id: user._key,
                name: user.userName,
                email: user.email,
                image: user.userAvatar
              }
            } else {
              return null
            }
          }
        }

        console.log('Invalid credentials')
        return null
      }
    })
  ]
})
