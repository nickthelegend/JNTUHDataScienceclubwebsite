import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { slug, fullName, rollNo, department, specialization, year, phoneNo, isContentCreator } = body

    const event = await prisma.event.findUnique({
      where: { slug }
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if already registered
    const existingRegistration = await prisma.eventRegistration.findUnique({
      where: {
        userId_eventId: {
          userId: user.id,
          eventId: event.id
        }
      }
    })

    if (existingRegistration) {
      return NextResponse.json({ error: 'Already registered' }, { status: 400 })
    }

    // Update user profile
    await prisma.user.update({
      where: { id: user.id },
      data: {
        fullName: fullName || user.fullName,
        rollNo: rollNo || user.rollNo,
        department: department || user.department,
        specialization: specialization || user.specialization,
        year: year || user.year,
        phoneNo: phoneNo || user.phoneNo,
        isContentCreator: isContentCreator !== undefined ? isContentCreator : user.isContentCreator,
      }
    })

    // Create registration
    const registration = await prisma.eventRegistration.create({
      data: {
        userId: user.id,
        eventId: event.id,
        fullName,
        rollNo,
        department,
        specialization,
        year,
        phoneNo,
        isContentCreator,
      }
    })

    return NextResponse.json(registration)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to register' }, { status: 500 })
  }
}