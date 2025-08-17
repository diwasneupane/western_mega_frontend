import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { X, Home, User, BookOpen, MessageCircle, LayoutDashboard, GraduationCap, BarChart3, LogOut, LogIn } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { AnimatePresence } from 'framer-motion'
import { motion } from 'framer-motion'
function MobileNav({ isOpen, onClose, isAuthenticated }) {
    const navigate = useNavigate()
    const location = useLocation()
    const { user, logout } = useAuth()

    const publicNavigation = [
        { id: 'home', name: 'Home', icon: Home, path: '/' },
        { id: 'about', name: 'About', icon: User, path: '/about' },
        { id: 'courses', name: 'Courses', icon: BookOpen, path: '/courses' },
        { id: 'blog', name: 'News & Updates', icon: MessageCircle, path: '/blog' },
    ]

    const studentNavigation = [
        { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, path: '/student/dashboard' },
        { id: 'profile', name: 'My Profile', icon: User, path: '/student/profile' },
        { id: 'courses', name: 'My Courses', icon: GraduationCap, path: '/student/courses' },
        { id: 'results', name: 'My Results', icon: BarChart3, path: '/student/results' },
    ]

    const handleNavClick = (path) => {
        navigate(path)
        onClose()
    }

    const handleLogout = () => {
        logout()
        navigate('/')
        onClose()
    }

    const currentNavigation = isAuthenticated ? studentNavigation : publicNavigation

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="absolute right-0 top-0 w-80 max-w-[85vw] h-full bg-white shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="safe-top p-4 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">W</span>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                                        {isAuthenticated && user && (
                                            <p className="text-sm text-blue-600">Hi, {user.firstName}!</p>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="p-4 flex-1 overflow-y-auto">
                            <div className="space-y-2">
                                {currentNavigation.map((item) => {
                                    const Icon = item.icon
                                    const isActive = location.pathname === item.path

                                    return (
                                        <motion.button
                                            key={item.id}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleNavClick(item.path)}
                                            className={`flex items-center space-x-3 p-3 rounded-xl transition-all w-full text-left ${isActive
                                                ? 'bg-blue-50 text-blue-600 font-medium'
                                                : 'hover:bg-gray-50 text-gray-700'
                                                }`}
                                        >
                                            <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                                            <span>{item.name}</span>
                                        </motion.button>
                                    )
                                })}
                            </div>

                            {/* Divider and Action Buttons */}
                            <div className="border-t border-gray-100 mt-6 pt-6">
                                {!isAuthenticated ? (
                                    <>
                                        <motion.button
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleNavClick('/login')}
                                            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg w-full mb-3 flex items-center justify-center space-x-2"
                                        >
                                            <LogIn className="w-4 h-4" />
                                            <span>Student Login</span>
                                        </motion.button>

                                        <motion.button
                                            whileTap={{ scale: 0.95 }}
                                            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium w-full"
                                        >
                                            Contact Us
                                        </motion.button>
                                    </>
                                ) : (
                                    <>
                                        {/* User Info Card */}
                                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white font-bold text-lg">
                                                        {user?.firstName?.charAt(0)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">
                                                        {user?.firstName} {user?.lastName}
                                                    </p>
                                                    <p className="text-sm text-gray-600">{user?.email}</p>
                                                    <p className="text-xs text-blue-600 font-medium">Student</p>
                                                </div>
                                            </div>
                                        </div>

                                        <motion.button
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleLogout}
                                            className="bg-red-50 text-red-600 px-6 py-3 rounded-xl font-medium w-full flex items-center justify-center space-x-2 hover:bg-red-100 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Logout</span>
                                        </motion.button>
                                    </>
                                )}
                            </div>
                        </nav>

                        {/* Footer */}
                        <div className="p-4 border-t border-gray-100 safe-bottom">
                            <p className="text-xs text-gray-500 text-center">
                                © 2024 Western Mega College
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default MobileNav