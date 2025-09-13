'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'

export default function EventRegistrations() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const eventId = params.id

  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
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
    fetchRegistrations()
  }, [status, router, eventId, session])

  const fetchRegistrations = async () => {
    const res = await fetch(`/api/events/${eventId}/registrations`)
    const data = await res.json()
    setRegistrations(data)
    setLoading(false)
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Event Registrations</h1>
          <p className="text-gray-600 mt-2">Manage registrations for this event</p>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading registrations...</div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {registrations.map((reg) => (
                <li key={reg.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{reg.fullName}</p>
                      <p className="text-sm text-gray-500">Roll No: {reg.rollNo}</p>
                      <p className="text-sm text-gray-500">Department: {reg.department}</p>
                      <p className="text-sm text-gray-500">Year: {reg.year}</p>
                      <p className="text-sm text-gray-500">Phone: {reg.phoneNo}</p>
                      <p className="text-sm text-gray-500">Content Creator: {reg.isContentCreator ? 'Yes' : 'No'}</p>
                      <p className="text-sm text-gray-500">Status: <span className={`font-medium ${
                        reg.status === 'ACCEPTED' ? 'text-green-600' :
                        reg.status === 'REJECTED' ? 'text-red-600' :
                        reg.status === 'ATTENDED' ? 'text-blue-600' :
                        'text-yellow-600'
                      }`}>{reg.status || 'PENDING'}</span></p>
                    </div>
                    <button
                      onClick={() => handleEdit(reg)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
                    >
                      Edit
                    </button>
                  </div>
                </li>
              ))}
            </ul>
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