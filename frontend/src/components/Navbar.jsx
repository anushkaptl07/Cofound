import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link to={isAuthenticated ? '/browse' : '/'} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-sm">
            CH
          </div>
          <span className="font-semibold text-gray-900 text-lg tracking-tight">CoFoundHub</span>
        </Link>

        {isAuthenticated ? (
          <div className="flex items-center gap-1 sm:gap-2">
            <Link to="/browse" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-brand-700 hover:bg-brand-50 transition-colors">
              Browse
            </Link>
            <Link to="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-brand-700 hover:bg-brand-50 transition-colors">
              Requests
            </Link>
            <Link to="/profile" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-brand-700 hover:bg-brand-50 transition-colors">
              My Profile
            </Link>
            <div className="w-px h-6 bg-gray-200 mx-1 hidden sm:block" />
            <span className="hidden sm:inline text-sm text-gray-500 px-2">Hi, {user?.name?.split(' ')[0]}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-md text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 transition-colors"
            >
              Log out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
              Log in
            </Link>
            <Link to="/signup" className="px-4 py-2 rounded-md text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 transition-colors">
              Sign up
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
