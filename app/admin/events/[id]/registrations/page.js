'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { sendRegistrationStatusEmail } from '@/lib/email-send'

export default function EventRegistrations() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const eventId = params.id

  const [registrations, setRegistrations] = useState([])
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [editingReg, setEditingReg] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    id: '',
    fullName: '',
    rollNo: '',
    department: '',
    specialization: '',
    year: '',
    phoneNo: '',
    isContentCreator: false,
    status: 'PENDING'
  })

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated' || session?.user?.role !== 'admin') {
      router.push('/admin/login')
      return
    }
    fetchEvent()
    fetchRegistrations()
  }, [status, router, eventId, session])

  const fetchRegistrations = async () => {
    const res = await fetch(`/api/events/${eventId}/registrations`)
    const data = await res.json()
    setRegistrations(data)
    setLoading(false)
  }

  const fetchEvent = async () => {
    try {
      const res = await fetch(`/api/events/${eventId}`)
      if (res.ok) {
        const eventData = await res.json()
        setEvent(eventData)
      }
    } catch (error) {
      console.error('Failed to fetch event:', error)
    }
  }

  const handleAccept = async (regId) => {
    setUpdatingId(regId)
    try {
      const res = await fetch(`/api/events/${eventId}/registrations`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: regId, status: 'ACCEPTED' })
      })
      if (res.ok) {
        fetchRegistrations()
        // Send acceptance email
        const registration = registrations.find(r => r.id === regId)
        if (registration && registration.user && event) {
          await sendRegistrationStatusEmail({
            to: registration.user.email,
            userName: registration.fullName,
            eventName: event.title,
            status: 'ACCEPTED',
            eventDate: event.date,
            eventLocation: event.location
          })
        }
      }
    } catch (error) {
      console.error('Failed to accept registration:', error)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleReject = async (regId) => {
    setUpdatingId(regId)
    try {
      const res = await fetch(`/api/events/${eventId}/registrations`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: regId, status: 'REJECTED' })
      })
      if (res.ok) {
        fetchRegistrations()
        // Send rejection email
        const registration = registrations.find(r => r.id === regId)
        if (registration && registration.user && event) {
          await sendRegistrationStatusEmail({
            to: registration.user.email,
            userName: registration.fullName,
            eventName: event.title,
            status: 'REJECTED',
            eventDate: event.date,
            eventLocation: event.location
          })
        }
      }
    } catch (error) {
      console.error('Failed to reject registration:', error)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleExportCSV = () => {
    const headers = ['Full Name', 'Roll No', 'Department', 'Specialization', 'Year', 'Phone', 'Content Creator', 'Status']
    const csvContent = [
      headers.join(','),
      ...registrations.map(reg => [
        `"${reg.fullName}"`,
        reg.rollNo || '',
        reg.department || '',
        reg.specialization || '',
        reg.year || '',
        reg.phoneNo || '',
        reg.isContentCreator ? 'Yes' : 'No',
        reg.status || 'PENDING'
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `event_${eventId}_registrations.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleEdit = (reg) => {
    setEditingReg(reg)
    setFormData({
      id: reg.id,
      fullName: reg.fullName,
      rollNo: reg.rollNo || '',
      department: reg.department || '',
      specialization: reg.specialization || '',
      year: reg.year || '',
      phoneNo: reg.phoneNo || '',
      isContentCreator: reg.isContentCreator,
      status: reg.status || 'PENDING'
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch(`/api/events/${eventId}/registrations`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })

    if (res.ok) {
      fetchRegistrations()
      setShowModal(false)
      setEditingReg(null)
      setFormData({
        id: '',
        fullName: '',
        rollNo: '',
        department: '',
        specialization: '',
        year: '',
        phoneNo: '',
        isContentCreator: false,
        status: 'PENDING'
      })
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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Event Registrations</h1>
            <p className="text-gray-600 mt-2">Manage registrations for this event</p>
            {!loading && (
              <div className="mt-4 flex space-x-6">
                <div className="text-sm">
                  <span className="font-medium text-gray-900">Total: </span>
                  <span className="text-gray-600">{registrations.length}</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium text-gray-900">Pending: </span>
                  <span className="text-yellow-600">{registrations.filter(r => r.status === 'PENDING' || !r.status).length}</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium text-gray-900">Accepted: </span>
                  <span className="text-green-600">{registrations.filter(r => r.status === 'ACCEPTED').length}</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium text-gray-900">Rejected: </span>
                  <span className="text-red-600">{registrations.filter(r => r.status === 'REJECTED').length}</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium text-gray-900">Attended: </span>
                  <span className="text-blue-600">{registrations.filter(r => r.status === 'ATTENDED').length}</span>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleExportCSV}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Export to CSV
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading registrations...</div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content Creator</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {registrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{reg.fullName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reg.rollNo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reg.department}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reg.specialization}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reg.year}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reg.phoneNo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reg.isContentCreator ? 'Yes' : 'No'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          reg.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                          reg.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                          reg.status === 'ATTENDED' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {reg.status || 'PENDING'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1">
                        <button
                          onClick={() => handleAccept(reg.id)}
                          disabled={reg.status === 'ACCEPTED' || updatingId === reg.id}
                          className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-2 py-1 rounded text-xs"
                        >
                          {updatingId === reg.id ? 'Updating...' : 'Accept'}
                        </button>
                        <button
                          onClick={() => handleReject(reg.id)}
                          disabled={reg.status === 'REJECTED' || updatingId === reg.id}
                          className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-2 py-1 rounded text-xs"
                        >
                          {updatingId === reg.id ? 'Updating...' : 'Reject'}
                        </button>
                        <button
                          onClick={() => handleEdit(reg)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">Edit Registration</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  required
                />
                <input
                  type="text"
                  placeholder="Roll No."
                  value={formData.rollNo}
                  onChange={(e) => setFormData({...formData, rollNo: e.target.value})}
                  className="w-full p-2 border rounded-md"
                />
                <input
                  type="text"
                  placeholder="Department"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  className="w-full p-2 border rounded-md"
                />
                <input
                  type="text"
                  placeholder="Specialization"
                  value={formData.specialization}
                  onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                  className="w-full p-2 border rounded-md"
                />
                <input
                  type="text"
                  placeholder="Year"
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: e.target.value})}
                  className="w-full p-2 border rounded-md"
                />
                <input
                  type="tel"
                  placeholder="Phone No."
                  value={formData.phoneNo}
                  onChange={(e) => setFormData({...formData, phoneNo: e.target.value})}
                  className="w-full p-2 border rounded-md"
                />
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isContentCreator}
                    onChange={(e) => setFormData({...formData, isContentCreator: e.target.checked})}
                    className="mr-2"
                  />
                  Content Creator
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="PENDING">Pending</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="ATTENDED">Attended</option>
                </select>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setEditingReg(null)
                      setFormData({
                        id: '',
                        fullName: '',
                        rollNo: '',
                        department: '',
                        specialization: '',
                        year: '',
                        phoneNo: '',
                        isContentCreator: false,
                        status: 'PENDING'
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