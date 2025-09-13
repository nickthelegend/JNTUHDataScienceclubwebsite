'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') return <div className="p-6">Loading...</div>

  if (status === 'unauthenticated' || session?.user?.role !== 'admin') {
    router.push('/admin/login')
    return null
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/events"
          className="block p-6 border rounded-lg hover:bg-gray-50"
        >
          <h2 className="text-xl font-semibold mb-2">Events</h2>
          <p className="text-gray-600">Manage all events</p>
        </Link>
      </div>
    </div>
  )
}