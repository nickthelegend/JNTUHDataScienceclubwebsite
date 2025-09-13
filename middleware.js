import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Add logic if needed
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith('/admin/login')) {
          return true;
        }
        return !!token && token.role === 'admin';
      },
    },
  }
)

export const config = {
  matcher: [
    '/admin/((?!login).*)',
  ]
}