'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'

export default function EventRegistration() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const slug = params.slug
  
  const [event, setEvent] = useState(null)
  const [eventLoading, setEventLoading] = useState(true)
  const [eventError, setEventError] = useState('')
  const [isRegistered, setIsRegistered] = useState(false)
  const checkedRef = useRef(false)
  
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setEventLoading(true)
        const res = await fetch(`/api/events/${slug}`)
        if (!res.ok) {
          throw new Error('Event not found')
        }
        const data = await res.json()
        setEvent(data)
      } catch (err) {
        setEventError(err.message)
      } finally {
        setEventLoading(false)
      }
    }
  
    if (slug) {
      fetchEvent()
    }
  }, [slug])

  useEffect(() => {
    if (event && session && !checkedRef.current) {
      checkedRef.current = true
      const checkRegistration = async () => {
        try {
          const regRes = await fetch(`/api/register/event?slug=${slug}`)
          if (regRes.ok) {
            const regData = await regRes.json()
            setIsRegistered(regData.registered)
          }
        } catch (err) {
          console.error('Failed to check registration status:', err)
        }
      }
      checkRegistration()
    }
  }, [event, session, slug, router])
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    rollNo: '',
    department: '',
    specialization: '',
    year: '',
    specificQuestions: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const body = {
      slug,
      fullName: `${formData.firstName} ${formData.lastName}`.trim(),
      rollNo: formData.rollNo,
      department: formData.department,
      specialization: formData.specialization,
      year: formData.year,
      specificQuestions: formData.specificQuestions,
    }

    try {
      const res = await fetch('/api/register/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(true)
        setTimeout(() => router.push(`/events/${slug}`), 2000)
      } else {
        setError(data.error || 'Registration failed')
      }
    } catch (err) {
      setError('Registration failed')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return <div className="container mx-auto p-6">Loading...</div>
  }
  
  if (eventLoading) {
    return <div className="container mx-auto p-6">Loading event...</div>
  }
  
  if (eventError || !event) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
        <p className="text-gray-600 mb-4">No event like that exists.</p>
        <button
          onClick={() => router.push('/events')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium"
        >
          Back to Events
        </button>
      </div>
    )
  }


  // Show 2-column registration view with sign-in for unauthenticated users
  const renderSignInPrompt = () => (
    <div className="container mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Student Registration</h2>
        <h3 className="text-2xl text-orange-600 font-semibold">for {event.title}</h3>
        <p className="text-gray-600 mt-2">Please sign in to continue with registration.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left column: Visuals */}
        <div className="space-y-6">
          {event.imageUrl && (
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
          )}
          <div className="bg-gradient-to-br from-orange-100 to-yellow-100 p-6 rounded-lg">
            <h4 className="text-xl font-bold text-gray-800 mb-2">Event Details</h4>
            <p className="text-lg"><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
            <p className="text-lg"><strong>Venue:</strong> {event.location || 'CSE Seminar Hall'}</p>
            <p className="text-sm text-gray-600 mt-2">Registration Fee: ₹50</p>
          </div>
          {/* Placeholder for QR - can add static image if available */}
          <div className="bg-white p-4 rounded-lg shadow flex justify-center">
            <div className="w-24 h-24 bg-gray-300 rounded flex items-center justify-center">
              QR Code
            </div>
          </div>
        </div>
        {/* Right column: Sign In Prompt */}
        <div>
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Register?</h2>
            <p className="text-gray-600 mb-6">Sign in to proceed with your registration.</p>
            <button
              onClick={() => signIn('google', { callbackUrl: `/register/event/${slug}` })}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-medium flex items-center space-x-2 mx-auto"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>
          {/* Stay Connected */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="text-lg font-bold text-gray-800 mb-4">Stay Connected With Us!</h4>
            <p className="text-gray-600 mb-4">Community for further events and never miss updates</p>
            <div className="flex space-x-4">
              <a href="https://wa.me/919100644" className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition">
                <span className="sr-only">WhatsApp</span>
                📱
              </a>
              <a href="https://instagram.com/jntuhdsc" className="bg-pink-500 text-white p-3 rounded-full hover:bg-pink-600 transition">
                <span className="sr-only">Instagram</span>
                📸
              </a>
              <a href="https://linkedin.com/company/jntuh-dsc" className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition">
                <span className="sr-only">LinkedIn</span>
                💼
              </a>
            </div>
            <p className="text-sm text-gray-500 mt-2">+91 91006 44100 | info@jntuhdsc.com</p>
          </div>
        </div>
      </div>
    </div>
  )

  // Show registration form for authenticated users
  const renderRegistrationForm = () => (
    <div className="container mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Student Registration</h2>
        <h3 className="text-2xl text-orange-600 font-semibold">for {event.title}</h3>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left column: Visuals */}
        <div className="space-y-6">
          {event.imageUrl && (
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
          )}
          <div className="bg-gradient-to-br from-orange-100 to-yellow-100 p-6 rounded-lg">
            <h4 className="text-xl font-bold text-gray-800 mb-2">Event Details</h4>
            <p className="text-lg"><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
            <p className="text-lg"><strong>Venue:</strong> {event.location || 'CSE Seminar Hall'}</p>
            <p className="text-sm text-gray-600 mt-2">Registration Fee: ₹50</p>
          </div>
          {/* Placeholder for QR - can add static image if available */}
          <div className="bg-white p-4 rounded-lg shadow flex justify-center">
            <div className="w-24 h-24 bg-gray-300 rounded flex items-center justify-center">
              QR Code
            </div>
          </div>
        </div>
        {/* Right column: Form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
              <input
                type="text"
                value={formData.rollNo}
                onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
                placeholder="e.g., CSE"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
              <input
                type="text"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g., Regular, IDOM"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year of Study</label>
              <input
                type="text"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
                placeholder="e.g., 3rd Year"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Specific Questions</label>
              <textarea
                value={formData.specificQuestions}
                onChange={(e) => setFormData({ ...formData, specificQuestions: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent h-24"
                placeholder="Any specific questions or notes..."
              />
            </div>
            {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50 transition"
            >
              {loading ? 'Registering...' : 'Register Now'}
            </button>
          </form>
          {/* Stay Connected */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="text-lg font-bold text-gray-800 mb-4">Stay Connected With Us!</h4>
            <p className="text-gray-600 mb-4">Community for further events and never miss updates</p>
            <div className="flex space-x-4">
              <a href="https://wa.me/919100644" className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition">
                <span className="sr-only">WhatsApp</span>
                📱
              </a>
              <a href="https://instagram.com/jntuhdsc" className="bg-pink-500 text-white p-3 rounded-full hover:bg-pink-600 transition">
                <span className="sr-only">Instagram</span>
                📸
              </a>
              <a href="https://linkedin.com/company/jntuh-dsc" className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition">
                <span className="sr-only">LinkedIn</span>
                💼
              </a>
            </div>
            <p className="text-sm text-gray-500 mt-2">+91 91006 44100 | info@jntuhdsc.com</p>
          </div>
        </div>
      </div>
    </div>
  )

  if (isRegistered) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-3xl font-bold mb-4">Already Registered!</h1>
        <p className="text-green-600 mb-4">You are already registered for this event.</p>
        <p className="text-gray-600">Redirecting back to event page...</p>
      </div>
    )
  }

  if (success) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-3xl font-bold mb-4">Registration Successful!</h1>
        <p className="text-green-600 mb-4">You have been registered for the event.</p>
        <p className="text-gray-600">Redirecting back to event page...</p>
      </div>
    )
  }

  return (
    <div>
      {session ? renderRegistrationForm() : renderSignInPrompt()}
    </div>
  )
}