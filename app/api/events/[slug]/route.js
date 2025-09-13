import { prisma } from '@/lib/prisma'

export async function GET(request, { params }) {
  const { slug } = params
  console.log('API: Looking for slug/id:', slug)

  try {
    // Try to find by slug first
    let event = await prisma.event.findUnique({
      where: { slug }
    })

    // If not found by slug, try by id
    if (!event) {
      event = await prisma.event.findUnique({
        where: { id: slug }
      })
    }

    console.log('API: Found event:', event)

    if (!event) {
      console.log('API: Event not found')
      return new Response(JSON.stringify({ error: 'Event not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return Response.json(event)
  } catch (error) {
    console.log('API: Error:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch event' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}