import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/sign-in'
  },
  trustHost: true,
  callbacks: {
    session: ({ session, user, token }) => {
      if (session?.user && token?.sub) {
        session.user.id = String(token.sub)
      }
      return session
    },
    authorized({ auth, request: { nextUrl } }) {
      // return !!auth?.user // this ensures there is a logged in user for -every- request
      const isLoggedIn = !!auth?.user
      // console.log('-----auth---', isLoggedIn, nextUrl.pathname, auth)
      if (isLoggedIn && nextUrl.pathname.includes('/sign-in')) {
        console.log('nextUrl.pathname', nextUrl.pathname, nextUrl)
        return Response.redirect(new URL('/chatbot', nextUrl))
      }
      return !!auth?.user
    }
  },
  providers: [] // Add providers with an empty array for now
} satisfies NextAuthConfig
