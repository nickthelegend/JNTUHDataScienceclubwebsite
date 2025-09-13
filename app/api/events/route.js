import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(events)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

async function uploadPoster(file) {
  if (!file) return null

  const fileName = `posters/${Date.now()}-${file.name}`
  const { data, error } = await supabase.storage
    .from('event-posters')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.error('Upload error:', error)
    return null
  }

  const { data: { publicUrl } } = supabase.storage
    .from('event-posters')
    .getPublicUrl(fileName)

  return publicUrl
}

export async function POST(request) {
  try {
    const formData = await request.formData()
    const title = formData.get('title')
    const slug = formData.get('slug')
    const description = formData.get('description')
    const content = formData.get('content')
    const date = formData.get('date')
    const location = formData.get('location')
    const isPublished = formData.get('isPublished') === 'on'
    const file = formData.get('poster')

    const imageUrl = await uploadPoster(file)

    const event = await prisma.event.create({
      data: {
        title,
        slug,
        description: description || null,
        content: content || null,
        imageUrl: imageUrl || null,
        date: new Date(date),
        location: location || null,
        isPublished: isPublished || false,
      }
    })
    return NextResponse.json(event)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const formData = await request.formData()
    const id = formData.get('id')
    const title = formData.get('title')
    const slug = formData.get('slug')
    const description = formData.get('description')
    const content = formData.get('content')
    const date = formData.get('date')
    const location = formData.get('location')
    const isPublished = formData.get('isPublished') === 'on'
    const file = formData.get('poster')
    const existingImageUrl = formData.get('existingImageUrl')

    let imageUrl = existingImageUrl || null
    if (file && file.size > 0) {
      imageUrl = await uploadPoster(file)
    }

    const event = await prisma.event.update({
      where: { id },
      data: {
        title,
        slug,
        description: description || null,
        content: content || null,
        imageUrl,
        date: new Date(date),
        location: location || null,
        isPublished: isPublished || false,
      }
    })
    return NextResponse.json(event)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json()
    await prisma.event.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 })
  }
}