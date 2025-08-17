import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Menu, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'
function MobileHeader({ onMenuClick }) {
    const navigate = useNavigate()
    const location = useLocation()
    const { isAuthenticated, user } = useAuth()

    const getPageTitle = () => {
        const path = location.pathname
        if (path === '/') return 'Western Mega College'
        if (path === '/about') return 'About Us'
        if (path === '/courses') return 'Courses'
        if (path === '/blog') return 'News & Updates'
        if (path === '/login') return 'Student Login'
        if (path.startsWith('/student')) {
            if (path === '/student/dashboard') return 'Dashboard'
            if (path === '/student/profile') return 'My Profile'
            if (path === '/student/courses') return 'My Courses'
            if (path === '/student/results') return 'My Results'
        }
        return 'Western Mega College'
    }

    const showBackButton = () => {
        return location.pathname !== '/' && !location.pathname.startsWith('/student/dashboard')
    }

    const showProfileButton = () => {
        return isAuthenticated && location.pathname.startsWith('/student')
    }

    const handleBackClick = () => {
        if (location.pathname.startsWith('/student')) {
            navigate('/student/dashboard')
        } else {
            navigate('/')
        }
    }

    return (
        <header className="bg-white shadow-sm safe-top sticky top-0 z-50 border-b border-gray-100">
            <div className="px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Left Section */}
                    <div className="flex items-center space-x-3 flex-1">
                        {showBackButton() ? (
                            <button
                                onClick={handleBackClick}
                                className="p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                        ) : (
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">W</span>
                            </div>
                        )}

                        <div className="flex-1">
                            <h1 className="font-bold text-gray-900 text-lg leading-tight truncate">
                                {getPageTitle()}
                            </h1>
                            {location.pathname === '/' && (
                                <p className="text-xs text-gray-500 -mt-1">College Portal</p>
                            )}
                            {isAuthenticated && location.pathname.startsWith('/student') && (
                                <p className="text-xs text-blue-600 -mt-1">Welcome, {user?.firstName}</p>
                            )}
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center space-x-2">
                        {showProfileButton() && (
                            <button
                                onClick={() => navigate('/student/profile')}
                                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                <User className="w-5 h-5 text-gray-600" />
                            </button>
                        )}

                        <button
                            onClick={onMenuClick}
                            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            <Menu className="w-6 h-6 text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default MobileHeader