import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [eventsCount, registrationsCount, adminsCount] = await Promise.all([
      prisma.event.count(),
      prisma.eventRegistration.count(),
      prisma.admin.count()
    ])

    return NextResponse.json({
      totalEvents: eventsCount,
      totalRegistrations: registrationsCount,
      totalAdmins: adminsCount
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}