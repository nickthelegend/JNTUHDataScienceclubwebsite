import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function EventPage({ params }) {
  const { slug } = params

  const event = await prisma.event.findUnique({
    where: { slug }
  })

  if (!event) {
    return <div>Event not found</div>
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
        {event.isPublished && (
          <a href={`/register/event/${slug}`} className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md font-medium">
            Register Now
          </a>
        )}
      </div>
    </div>
  )
}