import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="max-w-6xl mx-auto px-6 pt-24 pb-16 text-center">
      <div className="inline-block px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold mb-6">
        Built for early-stage founders
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
        Find the cofounder<br />your startup is missing
      </h1>
      <p className="mt-5 text-lg text-gray-500 max-w-xl mx-auto">
        List your skills and idea, browse other founders, and send connection requests —
        no more searching Discord servers and cold DMs.
      </p>
      <div className="mt-8 flex items-center justify-center gap-3">
        <Link to="/signup" className="px-6 py-3 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors">
          Get started
        </Link>
        <Link to="/login" className="px-6 py-3 rounded-lg bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors">
          Log in
        </Link>
      </div>

      <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
        {[
          { title: 'Build your profile', desc: 'Share your skills, what you bring, and what you\'re looking for in a cofounder.' },
          { title: 'Browse founders', desc: 'Filter by skill or the role someone is looking to fill.' },
          { title: 'Connect directly', desc: 'Send a request — once accepted, contact details are shared.' },
        ].map((f) => (
          <div key={f.title} className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900">{f.title}</h3>
            <p className="text-sm text-gray-500 mt-1.5">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
