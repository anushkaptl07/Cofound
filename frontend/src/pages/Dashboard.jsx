import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext.jsx'
import SkillTag from '../components/SkillTag.jsx'

const TABS = ['Received', 'Sent', 'Connected']

export default function Dashboard() {
  const { user } = useAuth()
  const [tab, setTab] = useState('Received')
  const [received, setReceived] = useState([])
  const [sent, setSent] = useState([])
  const [accepted, setAccepted] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAll = async () => {
    setLoading(true)
    const [r, s, a] = await Promise.all([
      api.get('/connections/received'),
      api.get('/connections/sent'),
      api.get('/connections/accepted'),
    ])
    setReceived(r.data)
    setSent(s.data)
    setAccepted(a.data)
    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

  const respond = async (id, accept) => {
    await api.patch(`/connections/${id}/respond`, { accept })
    fetchAll()
  }

  const list = { Received: received, Sent: sent, Connected: accepted }[tab]

  return (
    <div className="max-w-3xl mx-auto px-6 pt-10 pb-16">
      <h1 className="text-2xl font-bold text-gray-900">Connection requests</h1>
      <p className="text-sm text-gray-500 mt-1">Manage the founders you've connected with.</p>

      <div className="flex gap-1 mt-6 bg-gray-100 rounded-lg p-1 w-fit">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t} {t === 'Received' && received.length > 0 && `(${received.length})`}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {loading ? (
          <div className="text-center text-gray-400 py-10">Loading...</div>
        ) : list.length === 0 ? (
          <div className="text-center text-gray-400 py-10">Nothing here yet.</div>
        ) : (
          list.map((c) => {
            const isReceived = tab === 'Received'
            const otherPerson = c.sender.id === user.id ? c.receiver : c.sender
            return (
              <div key={c.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900">{otherPerson.name}</h3>
                  {otherPerson.roleHave && <p className="text-sm text-gray-500">{otherPerson.roleHave}</p>}
                  {otherPerson.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {otherPerson.skills.slice(0, 4).map((s) => <SkillTag key={s}>{s}</SkillTag>)}
                    </div>
                  )}
                  {tab === 'Connected' && (
                    <p className="text-xs text-gray-400 mt-2">Reach out anytime — you're both connected now.</p>
                  )}
                </div>

                {isReceived ? (
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => respond(c.id, true)}
                      className="px-3 py-1.5 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => respond(c.id, false)}
                      className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200"
                    >
                      Decline
                    </button>
                  </div>
                ) : (
                  <span className={`flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${
                    c.status === 'ACCEPTED' ? 'bg-green-50 text-green-700' :
                    c.status === 'REJECTED' ? 'bg-red-50 text-red-700' :
                    'bg-yellow-50 text-yellow-700'
                  }`}>
                    {c.status}
                  </span>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
