// components/MobileHeader.jsx - Updated with Logo Support
import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Menu, User, GraduationCap } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'

// Logo Component with fallback
function Logo({ className = "w-8 h-8", showText = false }) {
    const [imageError, setImageError] = useState(false)

    return (
        <div className="flex items-center space-x-2">
            {!imageError ? (
                <img
                    src="/logo.jpeg"
                    alt="Western Mega College"
                    className={`${className} rounded-lg object-cover`}
                    onError={() => setImageError(true)}
                    onLoad={() => setImageError(false)}
                />
            ) : (
                <div className={`${className} bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center`}>
                    <GraduationCap className="w-5 h-5 text-white" />
                </div>
            )}
            {showText && (
                <div>
                    <h1 className="font-bold text-gray-900 text-sm">Western Mega</h1>
                    <p className="text-xs text-gray-600 -mt-0.5">College</p>
                </div>
            )}
        </div>
    )
}

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
        <motion.header
            className="bg-white shadow-sm safe-top sticky top-0 z-50 border-b border-gray-100"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
            <div className="px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Left Section */}
                    <div className="flex items-center space-x-3 flex-1">
                        {showBackButton() ? (
                            <motion.button
                                onClick={handleBackClick}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </motion.button>
                        ) : (
                            <Logo className="w-10 h-10" />
                        )}

                        <div className="flex-1">
                            <motion.h1
                                className="font-bold text-gray-900 text-lg leading-tight truncate"
                                key={location.pathname} // Re-animate when page changes
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {getPageTitle()}
                            </motion.h1>
                            {location.pathname === '/' && (
                                <motion.p
                                    className="text-xs text-gray-500 -mt-1"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    Student Portal
                                </motion.p>
                            )}
                            {isAuthenticated && location.pathname.startsWith('/student') && (
                                <motion.p
                                    className="text-xs text-blue-600 -mt-1"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    Welcome, {user?.firstName}
                                </motion.p>
                            )}
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center space-x-2">
                        {showProfileButton() && (
                            <motion.button
                                onClick={() => navigate('/student/profile')}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                <User className="w-5 h-5 text-gray-600" />
                            </motion.button>
                        )}

                        <motion.button
                            onClick={onMenuClick}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            <Menu className="w-6 h-6 text-gray-600" />
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.header>
    )
}

export default MobileHeader