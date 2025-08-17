// components/MobileNav.jsx - Updated with Logo Support
import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { X, Home, User, BookOpen, MessageCircle, LayoutDashboard, GraduationCap, BarChart3, LogOut, LogIn } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { AnimatePresence, motion } from 'framer-motion'

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
                    <GraduationCap className={`${className.includes('w-12') ? 'w-6 h-6' : 'w-5 h-5'} text-white`} />
                </div>
            )}
            {showText && (
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Western Mega</h2>
                    <p className="text-sm text-gray-600 -mt-1">College</p>
                </div>
            )}
        </div>
    )
}

function MobileNav({ isOpen, onClose, isAuthenticated }) {
    const navigate = useNavigate()
    const location = useLocation()
    const { user, logout } = useAuth()

    const publicNavigation = [
        { id: 'home', name: 'Home', icon: Home, path: '/', description: 'Welcome & overview' },
        { id: 'about', name: 'About Us', icon: User, path: '/about', description: 'Our mission & values' },
        { id: 'courses', name: 'Courses', icon: BookOpen, path: '/courses', description: 'Browse programs' },
        { id: 'blog', name: 'News & Updates', icon: MessageCircle, path: '/blog', description: 'Latest announcements' },
    ]

    const studentNavigation = [
        { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, path: '/student/dashboard', description: 'Overview & quick stats' },
        { id: 'profile', name: 'My Profile', icon: User, path: '/student/profile', description: 'Personal information' },
        { id: 'courses', name: 'My Courses', icon: GraduationCap, path: '/student/courses', description: 'Enrolled courses' },
        { id: 'results', name: 'My Results', icon: BarChart3, path: '/student/results', description: 'Grades & achievements' },
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

    const menuVariants = {
        closed: {
            x: "100%",
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 40
            }
        },
        open: {
            x: 0,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 40
            }
        }
    }

    const backdropVariants = {
        closed: { opacity: 0 },
        open: { opacity: 1 }
    }

    const itemVariants = {
        closed: { x: 20, opacity: 0 },
        open: { x: 0, opacity: 1 }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    variants={backdropVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80]"
                    onClick={onClose}
                >
                    <motion.div
                        variants={menuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="absolute right-0 top-0 w-80 max-w-[85vw] h-full bg-white shadow-2xl overflow-y-auto z-[90]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="safe-top p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                            <div className="flex items-center justify-between">
                                <Logo className="w-12 h-12" showText={true} />

                                <motion.button
                                    onClick={onClose}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-2 rounded-xl hover:bg-white/50 transition-colors"
                                >
                                    <X className="w-6 h-6 text-gray-600" />
                                </motion.button>
                            </div>

                            {isAuthenticated && user && (
                                <motion.div
                                    className="mt-4 p-3 bg-white/70 rounded-xl"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <p className="text-sm font-medium text-gray-900">
                                        Hi, {user.firstName} {user.lastName}! 👋
                                    </p>
                                    <p className="text-xs text-gray-600 mt-1">{user.email}</p>
                                </motion.div>
                            )}
                        </div>

                        {/* Navigation */}
                        <nav className="p-6 flex-1">
                            <motion.div
                                className="space-y-2"
                                initial="closed"
                                animate="open"
                                variants={{
                                    open: {
                                        transition: { staggerChildren: 0.07, delayChildren: 0.1 }
                                    },
                                    closed: {
                                        transition: { staggerChildren: 0.05, staggerDirection: -1 }
                                    }
                                }}
                            >
                                {currentNavigation.map((item) => {
                                    const Icon = item.icon
                                    const isActive = location.pathname === item.path

                                    return (
                                        <motion.button
                                            key={item.id}
                                            variants={itemVariants}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleNavClick(item.path)}
                                            className={`flex items-center space-x-4 p-4 rounded-xl transition-all w-full text-left group ${isActive
                                                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                                                : 'hover:bg-gray-50 text-gray-700'
                                                }`}
                                        >
                                            <div className={`p-2 rounded-lg transition-colors ${isActive
                                                ? 'bg-white/20'
                                                : 'bg-gray-100 group-hover:bg-blue-50'
                                                }`}>
                                                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-blue-600'
                                                    }`} />
                                            </div>

                                            <div className="flex-1">
                                                <p className={`font-medium ${isActive ? 'text-white' : 'text-gray-900'}`}>
                                                    {item.name}
                                                </p>
                                                <p className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500'
                                                    }`}>
                                                    {item.description}
                                                </p>
                                            </div>
                                        </motion.button>
                                    )
                                })}
                            </motion.div>

                            {/* Action Buttons */}
                            <motion.div
                                className="border-t border-gray-100 mt-8 pt-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                {!isAuthenticated ? (
                                    <div className="space-y-3">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleNavClick('/login')}
                                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-xl font-semibold shadow-lg w-full flex items-center justify-center space-x-3"
                                        >
                                            <LogIn className="w-5 h-5" />
                                            <span>Student Login</span>
                                        </motion.button>

                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium w-full hover:bg-gray-200 transition-colors"
                                        >
                                            📞 Contact Support
                                        </motion.button>
                                    </div>
                                ) : (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleLogout}
                                        className="bg-red-50 text-red-600 px-6 py-4 rounded-xl font-semibold w-full flex items-center justify-center space-x-3 hover:bg-red-100 transition-colors border border-red-100"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span>Sign Out</span>
                                    </motion.button>
                                )}
                            </motion.div>
                        </nav>

                        {/* Footer */}
                        <motion.div
                            className="p-6 border-t border-gray-100 safe-bottom bg-gray-50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <p className="text-xs text-gray-500 text-center">
                                © 2024 Western Mega College<br />
                                <span className="text-blue-600">Student Mobile Portal</span>
                            </p>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default MobileNav