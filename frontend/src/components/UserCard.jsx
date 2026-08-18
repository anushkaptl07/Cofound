import React from 'react'
import SkillTag from './SkillTag.jsx'

function initials(name = '') {
  return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
}

export default function UserCard({ founder, onConnect, connectState }) {
  // connectState: undefined | 'pending' | 'sent' | 'connected'
  const buttonLabel = {
    sent: 'Request Sent',
    pending: 'Sending...',
    connected: 'Connected',
  }[connectState] || 'Connect'

  const disabled = connectState === 'sent' || connectState === 'pending' || connectState === 'connected'

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3 hover:shadow-md hover:border-brand-200 transition-all">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
          {initials(founder.name)}
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{founder.name}</h3>
          {founder.roleHave && (
            <p className="text-sm text-gray-500 truncate">{founder.roleHave}</p>
          )}
        </div>
      </div>

      {founder.startupIdea && (
        <p className="text-sm text-gray-700 line-clamp-2">{founder.startupIdea}</p>
      )}

      {founder.roleLookingFor && (
        <p className="text-xs text-gray-400">
          Looking for: <span className="text-gray-600 font-medium">{founder.roleLookingFor}</span>
        </p>
      )}

      {founder.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {founder.skills.slice(0, 5).map((s) => (
            <SkillTag key={s}>{s}</SkillTag>
          ))}
        </div>
      )}

      <button
        onClick={() => onConnect(founder.id)}
        disabled={disabled}
        className={`mt-2 w-full py-2 rounded-lg text-sm font-medium transition-colors ${
          disabled
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-brand-600 text-white hover:bg-brand-700'
        }`}
      >
        {buttonLabel}
      </button>
    </div>
  )
}
