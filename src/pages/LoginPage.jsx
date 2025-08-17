import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LogIn, AlertCircle, CheckCircle } from 'lucide-react'
import { Toast } from 'antd-mobile'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'
function LoginPage() {
    const [formData, setFormData] = useState({
        identifier: '',
        password: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const { login } = useAuth()
    const navigate = useNavigate()

    const demoCredentials = [
        {
            label: 'Student Demo',
            identifier: 'alice.brown@student.college.edu',
            password: 'Student123!',
            role: 'Student'
        },
        {
            label: 'Teacher Demo',
            identifier: 'john.smith@college.edu',
            password: 'Teacher123!',
            role: 'Teacher'
        }
    ]

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
        if (error) setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            const result = await login(formData.identifier, formData.password)

            if (result.success) {
                Toast.show({
                    icon: <CheckCircle className="w-5 h-5 text-green-600" />,
                    content: `Welcome back, ${result.user.firstName}!`,
                })

                // Navigate to appropriate dashboard based on role
                if (result.user.role === 'student') {
                    navigate('/student/dashboard')
                } else {
                    navigate('/')
                }
            } else {
                setError(result.error)
                Toast.show({
                    icon: <AlertCircle className="w-5 h-5 text-red-600" />,
                    content: result.error,
                })
            }
        } catch (err) {
            console.error('Login error:', err)
            setError('Something went wrong. Please try again.')
            Toast.show({
                icon: <AlertCircle className="w-5 h-5 text-red-600" />,
                content: 'Something went wrong. Please try again.',
            })
        } finally {
            setIsLoading(false)
        }
    }

    const fillDemoCredentials = (demo) => {
        setFormData({
            identifier: demo.identifier,
            password: demo.password
        })
        setError('')
    }

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <motion.div
                className="w-full max-w-md"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header */}
                <motion.div className="text-center mb-8" variants={itemVariants}>
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                        <LogIn className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
                    <p className="text-gray-600">Sign in to access your student portal</p>
                </motion.div>

                {/* Login Form */}
                <motion.div
                    className="bg-white rounded-3xl shadow-xl p-6 mb-6"
                    variants={itemVariants}
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email/Username Input */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email or Username
                            </label>
                            <input
                                type="text"
                                value={formData.identifier}
                                onChange={(e) => handleInputChange('identifier', e.target.value)}
                                placeholder="Enter your email or username"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-gray-900 placeholder-gray-500"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-gray-900 placeholder-gray-500 pr-12"
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 p-1 text-gray-400 hover:text-gray-600"
                                    disabled={isLoading}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center space-x-2"
                            >
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                <p className="text-red-700 text-sm">{error}</p>
                            </motion.div>
                        )}

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={isLoading || !formData.identifier || !formData.password}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    <span>Sign In</span>
                                </>
                            )}
                        </motion.button>
                    </form>
                </motion.div>

                {/* Demo Credentials */}
                <motion.div
                    className="bg-white/70 backdrop-blur-sm rounded-2xl p-4"
                    variants={itemVariants}
                >
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">
                        🧪 Try Demo Accounts
                    </h3>
                    <div className="space-y-2">
                        {demoCredentials.map((demo, index) => (
                            <motion.button
                                key={index}
                                onClick={() => fillDemoCredentials(demo)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-white/50 hover:bg-white/80 border border-gray-200 rounded-xl p-3 text-left transition-all group"
                                disabled={isLoading}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900 text-sm">{demo.label}</p>
                                        <p className="text-xs text-gray-600">{demo.identifier}</p>
                                    </div>
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                        {demo.role}
                                    </span>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-3 text-center">
                        Click any demo account to fill the form automatically
                    </p>
                </motion.div>

                {/* Back to Home */}
                <motion.div
                    className="text-center mt-6"
                    variants={itemVariants}
                >
                    <button
                        onClick={() => navigate('/')}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        disabled={isLoading}
                    >
                        ← Back to Home
                    </button>
                </motion.div>
            </motion.div>
        </div>
    )
}

export default LoginPage