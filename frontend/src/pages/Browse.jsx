import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import UserCard from '../components/UserCard.jsx'

export default function Browse() {
  const [founders, setFounders] = useState([])
  const [skillFilter, setSkillFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [connectStates, setConnectStates] = useState({}) // { [userId]: 'sent' | 'pending' }

  const fetchFounders = async () => {
    setLoading(true)
    const params = {}
    if (skillFilter.trim()) params.skill = skillFilter.trim()
    if (roleFilter.trim()) params.roleLookingFor = roleFilter.trim()
    const { data } = await api.get('/users', { params })
    setFounders(data)
    setLoading(false)
  }

  useEffect(() => { fetchFounders() }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchFounders()
  }

  const handleConnect = async (receiverId) => {
    setConnectStates((prev) => ({ ...prev, [receiverId]: 'pending' }))
    try {
      await api.post(`/connections/request/${receiverId}`)
      setConnectStates((prev) => ({ ...prev, [receiverId]: 'sent' }))
    } catch (err) {
      setConnectStates((prev) => ({ ...prev, [receiverId]: undefined }))
      alert(err.response?.data?.message || 'Could not send request')
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 pt-10 pb-16">
      <h1 className="text-2xl font-bold text-gray-900">Browse founders</h1>
      <p className="text-sm text-gray-500 mt-1">Find someone whose skills complement yours.</p>

      <form onSubmit={handleSearch} className="mt-6 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={skillFilter}
          onChange={(e) => setSkillFilter(e.target.value)}
          className="flex-1 px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
          placeholder="Filter by skill (e.g. React)"
        />
        <input
          type="text"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="flex-1 px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
          placeholder="Filter by what they're looking for"
        />
        <button
          type="submit"
          className="px-5 py-2.5 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-700 whitespace-nowrap"
        >
          Search
        </button>
      </form>

      {loading ? (
        <div className="text-center text-gray-400 mt-16">Loading founders...</div>
      ) : founders.length === 0 ? (
        <div className="text-center text-gray-400 mt-16">No founders match your filters yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {founders.map((f) => (
            <UserCard
              key={f.id}
              founder={f}
              onConnect={handleConnect}
              connectState={connectStates[f.id]}
            />
          ))}
        </div>
      )}
    </div>
  )
}
