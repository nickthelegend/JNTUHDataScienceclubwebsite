import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Add logic if needed
  },
  {
    callbacks: {
      authorized: ({ token }) => token?.role === 'admin',
    },
  }
)

export const config = {
  matcher: [
    '/admin/((?!login).*)',
  ]
}