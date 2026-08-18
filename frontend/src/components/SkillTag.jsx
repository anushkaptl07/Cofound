import React from 'react'

export default function SkillTag({ children }) {
  return (
    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-brand-50 text-brand-700 border border-brand-100">
      {children}
    </span>
  )
}
