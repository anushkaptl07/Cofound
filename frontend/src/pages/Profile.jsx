import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import SkillTag from '../components/SkillTag.jsx'

export default function Profile() {
  const [form, setForm] = useState({
    bio: '', roleHave: '', roleLookingFor: '', startupIdea: '', skills: []
  })
  const [skillInput, setSkillInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    api.get('/users/me').then(({ data }) => {
      setForm({
        bio: data.bio || '',
        roleHave: data.roleHave || '',
        roleLookingFor: data.roleLookingFor || '',
        startupIdea: data.startupIdea || '',
        skills: data.skills || [],
      })
      setLoading(false)
    })
  }, [])

  const addSkill = (e) => {
    e.preventDefault()
    const val = skillInput.trim()
    if (val && !form.skills.includes(val)) {
      setForm({ ...form, skills: [...form.skills, val] })
    }
    setSkillInput('')
  }

  const removeSkill = (skill) => {
    setForm({ ...form, skills: form.skills.filter(s => s !== skill) })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    try {
      await api.put('/users/me', form)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="max-w-2xl mx-auto px-6 pt-16 text-center text-gray-400">Loading profile...</div>
  }

  return (
    <div className="max-w-2xl mx-auto px-6 pt-10 pb-16">
      <h1 className="text-2xl font-bold text-gray-900">Your profile</h1>
      <p className="text-sm text-gray-500 mt-1">This is what other founders will see when browsing.</p>

      <form onSubmit={handleSave} className="mt-6 bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea
            rows={3}
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="A short introduction about you..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">What you bring</label>
            <input
              type="text"
              value={form.roleHave}
              onChange={(e) => setForm({ ...form, roleHave: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="e.g. Backend Developer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">What you're looking for</label>
            <input
              type="text"
              value={form.roleLookingFor}
              onChange={(e) => setForm({ ...form, roleLookingFor: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="e.g. Marketing cofounder"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Startup idea (one-liner)</label>
          <input
            type="text"
            maxLength={300}
            value={form.startupIdea}
            onChange={(e) => setForm({ ...form, startupIdea: e.target.value })}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="e.g. A safety-first ride-hailing app for solo travelers"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') addSkill(e) }}
              className="flex-1 px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Type a skill and press Enter"
            />
            <button
              onClick={addSkill}
              type="button"
              className="px-4 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700"
            >
              Add
            </button>
          </div>
          {form.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {form.skills.map((s) => (
                <button key={s} type="button" onClick={() => removeSkill(s)} className="group">
                  <SkillTag>{s} <span className="text-brand-400 group-hover:text-brand-700 ml-1">×</span></SkillTag>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save profile'}
          </button>
          {saved && <span className="text-sm text-green-600 font-medium">Saved ✓</span>}
        </div>
      </form>
    </div>
  )
}
