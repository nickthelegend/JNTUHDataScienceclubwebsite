import { PrismaClient } from '@prisma/client'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient()

export default async function EventPage({ params }) {
  const { slug } = params

  const event = await prisma.event.findUnique({
    where: { slug }
  })
  const today = new Date()
  const eventDate = new Date(event.date)
  if (today > eventDate) {
    redirect(`/events/${slug}`)
  }
  if (!event) {
    return <div>Event not found</div>
  }

  if (event.isPublished) {
    redirect(`/register/event/${slug}`)
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
      {event.description && <p className="text-xl text-gray-600 mb-6">{event.description}</p>}
      {event.imageUrl && (
        <img src={event.imageUrl} alt={event.title} className="w-full h-64 object-cover rounded-lg mb-6" />
      )}
      <div className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: event.content || '' }} />
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-lg"><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
        <p className="text-lg"><strong>Location:</strong> {event.location || 'TBD'}</p>
        <p className="text-red-600">This event is not yet published.</p>
      </div>
    </div>
  )
}