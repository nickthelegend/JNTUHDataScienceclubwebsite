import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === 'google') {
        // Create or update user
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email }
        })
        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: user.email,
              emailVerified: new Date(),
              image: user.image,
              fullName: profile.name,
              // Other fields will be filled in registration form later
            }
          })
        } else {
          await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              fullName: profile.name,
              image: user.image,
            }
          })
        }

        // Check if user is admin
        const isAdmin = await prisma.admin.findUnique({
          where: { email: user.email }
        })
        if (isAdmin) {
          user.role = 'admin'
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }