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
        try {
          // Check if account already exists
          const existingAccount = await prisma.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
          });

          if (existingAccount) {
            // If account exists but no user, find user by email and link
            const existingUser = await prisma.user.findUnique({
              where: { email: user.email },
            });

            if (existingUser && existingUser.id !== existingAccount.userId) {
              // Link the account to the existing user
              await prisma.account.update({
                where: { id: existingAccount.id },
                data: { userId: existingUser.id },
              });
            }
          }

          // Create or update user
          let existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (!existingUser) {
            existingUser = await prisma.user.create({
              data: {
                email: user.email,
                emailVerified: new Date(),
                image: user.image,
                fullName: profile.name,
                // Other fields will be filled in registration form later
              },
            });
          } else {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                fullName: profile.name,
                image: user.image,
              },
            });
          }

          // Create account if not exists
          await prisma.account.upsert({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
            update: {},
            create: {
              userId: existingUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
              session_state: account.session_state,
            },
          });

          // Check if user is admin
          const isAdmin = await prisma.admin.findUnique({
            where: { email: user.email },
          });
          if (isAdmin) {
            user.role = 'admin';
          }

          return true;
        } catch (error) {
          console.error('Sign in error:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role || 'user'
      }

      // Persist role in token from DB for subsequent requests
      if (token.sub && !token.role) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub }
        })
        if (dbUser && dbUser.email) {
          const isAdmin = await prisma.admin.findUnique({
            where: { email: dbUser.email }
          })
          token.role = isAdmin ? 'admin' : 'user'
        }
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