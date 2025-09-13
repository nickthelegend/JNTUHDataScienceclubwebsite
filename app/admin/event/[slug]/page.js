import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

export default async function AdminEventPage({ params }) {
  const event = await prisma.event.findUnique({
    where: { slug: params.slug }
  })

  if (!event) {
    notFound()
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{event.title}</h1>
        <p className="text-gray-600">Slug: {event.slug}</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block font-semibold">Description</label>
          <p className="border p-2 rounded">{event.description}</p>
        </div>
        
        <div>
          <label className="block font-semibold">Content</label>
          <div className="border p-2 rounded min-h-[100px]">
            {event.content}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold">Date</label>
            <p className="border p-2 rounded">
              {new Date(event.date).toLocaleDateString()}
            </p>
          </div>
          
          <div>
            <label className="block font-semibold">Location</label>
            <p className="border p-2 rounded">{event.location}</p>
          </div>
        </div>
        
        <div>
          <label className="block font-semibold">Status</label>
          <p className="border p-2 rounded">
            {event.isPublished ? 'Published' : 'Draft'}
          </p>
        </div>
      </div>
    </div>
  )
}