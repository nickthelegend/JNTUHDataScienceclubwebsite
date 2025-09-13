import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    const registrations = await prisma.eventRegistration.findMany({
      where: { eventId: id },
      include: {
        user: true
      }
    })

    return NextResponse.json(registrations)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch registrations' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    const body = await request.json()

    const registration = await prisma.eventRegistration.update({
      where: { id: body.id },
      data: {
        fullName: body.fullName,
        rollNo: body.rollNo,
        department: body.department,
        specialization: body.specialization,
        year: body.year,
        phoneNo: body.phoneNo,
        isContentCreator: body.isContentCreator,
      }
    })

    return NextResponse.json(registration)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update registration' }, { status: 500 })
  }
}