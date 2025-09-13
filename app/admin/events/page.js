'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import Link from "next/link";

export default function EventsAdmin() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingEvent, setEditingEvent] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    slug: '',
    description: '',
    content: '',
    imageUrl: '',
    date: '',
    location: '',
    isPublished: false
  })

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated' || session?.user?.role !== 'admin') {
      router.push('/admin/login')
      return
    }
    fetchEvents()
  }, [status, router, session])

  const fetchEvents = async () => {
    const res = await fetch('/api/events')
    const data = await res.json()
    setEvents(data)
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const method = editingEvent ? 'PUT' : 'POST'
    const url = '/api/events'
    const body = { ...formData }
    if (editingEvent) body.id = editingEvent.id

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    if (res.ok) {
      fetchEvents()
      setShowModal(false)
      setEditingEvent(null)
      setFormData({
        id: '',
        title: '',
        slug: '',
        description: '',
        content: '',
        imageUrl: '',
        date: '',
        location: '',
        isPublished: false
      })
    }
  }

  const handleEdit = (event) => {
    setEditingEvent(event)
    setFormData({
      id: event.id,
      title: event.title,
      slug: event.slug,
      description: event.description || '',
      content: event.content || '',
      imageUrl: event.imageUrl || '',
      date: event.date.toISOString().split('T')[0],
      location: event.location || '',
      isPublished: event.isPublished
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure?')) {
      const res = await fetch('/api/events', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      if (res.ok) fetchEvents()
    }
  }

  if (status === 'loading') return <div>Loading...</div>

  if (status === 'unauthenticated' || session?.user?.role !== 'admin') {
    router.push('/admin/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Events</h1>
          <div className="flex items-center space-x-4">
            <span>Welcome, {session?.user?.name}</span>
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>

        <button
          onClick={() => {
            setEditingEvent(null)
            setFormData({
              id: '',
              title: '',
              slug: '',
              description: '',
              content: '',
              imageUrl: '',
              date: '',
              location: '',
              isPublished: false
            })
            setShowModal(true)
          }}
          className="mb-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium"
        >
          Create New Event
        </button>

        {loading ? (
          <div className="text-center py-10">Loading events...</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-2">Slug: {event.slug}</p>
                <p className="text-sm text-gray-500 mb-4">Date: {new Date(event.date).toLocaleDateString()}</p>
                {event.imageUrl && (
                  <img src={event.imageUrl} alt={event.title} className="w-full h-32 object-cover rounded mb-4" />
                )}
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => handleEdit(event)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                  <Link
                    href={`/admin/events/${event.id}/registrations`}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm text-center"
                  >
                    View Registrations
                  </Link>
                  <span className={`px-2 py-1 rounded text-xs ${event.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {event.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">{editingEvent ? 'Edit Event' : 'Create Event'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  required
                />
                <input
                  type="text"
                  placeholder="Slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-2 border rounded-md h-20"
                />
                <textarea
                  placeholder="Content"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full p-2 border rounded-md h-32"
                />
                <input
                  type="url"
                  placeholder="Image URL (for poster)"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  className="w-full p-2 border rounded-md"
                />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  required
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full p-2 border rounded-md"
                />
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({...formData, isPublished: e.target.checked})}
                    className="mr-2"
                  />
                  Published
                </label>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                  >
                    {editingEvent ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setEditingEvent(null)
                      setFormData({
                        id: '',
                        title: '',
                        slug: '',
                        description: '',
                        content: '',
                        imageUrl: '',
                        date: '',
                        location: '',
                        isPublished: false
                      })
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}