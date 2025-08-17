import React from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, BookOpen, Users, Award, ArrowRight, Play } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'
function HomePage() {
    const navigate = useNavigate()
    const { isAuthenticated } = useAuth()

    const features = [
        {
            icon: '🎓',
            title: 'Quality Education',
            description: 'Expert faculty & comprehensive curriculum'
        },
        {
            icon: '⚡',
            title: 'Fast Results',
            description: 'Real-time grade tracking & feedback'
        },
        {
            icon: '👥',
            title: 'Community',
            description: 'Connect with peers & mentors'
        },
        {
            icon: '📊',
            title: 'Progress Tracking',
            description: 'Monitor your academic journey'
        }
    ]

    const stats = [
        { number: '500+', label: 'Students', icon: Users },
        { number: '50+', label: 'Courses', icon: BookOpen },
        { number: '25+', label: 'Faculty', icon: Award }
    ]

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        }
    }

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="px-4 py-12 bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <motion.div
                    className="max-w-md mx-auto text-center"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Hero Icon */}
                    <motion.div
                        className="w-32 h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl"
                        variants={itemVariants}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <GraduationCap className="w-16 h-16 text-white" />
                    </motion.div>

                    {/* Hero Text */}
                    <motion.h1
                        className="text-3xl font-bold text-gray-900 mb-4 leading-tight"
                        variants={itemVariants}
                    >
                        Welcome to<br />
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Western Mega College
                        </span>
                    </motion.h1>

                    <motion.p
                        className="text-gray-600 mb-8 leading-relaxed text-lg"
                        variants={itemVariants}
                    >
                        Your gateway to quality education and academic excellence. Access courses, track progress, and connect with our community.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        className="space-y-4 mb-12"
                        variants={itemVariants}
                    >
                        {!isAuthenticated ? (
                            <>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate('/login')}
                                    className="bg-blue-600 text-white px-8 py-4 rounded-xl font-medium shadow-lg w-full text-lg flex items-center justify-center space-x-2"
                                >
                                    <GraduationCap className="w-5 h-5" />
                                    <span>Access Student Portal</span>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate('/courses')}
                                    className="bg-white text-gray-700 px-8 py-4 rounded-xl font-medium border border-gray-200 w-full text-lg flex items-center justify-center space-x-2 hover:bg-gray-50"
                                >
                                    <BookOpen className="w-5 h-5" />
                                    <span>Browse Courses</span>
                                </motion.button>
                            </>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/student/dashboard')}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-medium shadow-lg w-full text-lg flex items-center justify-center space-x-2"
                            >
                                <Play className="w-5 h-5" />
                                <span>Go to Dashboard</span>
                            </motion.button>
                        )}
                    </motion.div>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="px-4 py-8 bg-white">
                <motion.div
                    className="max-w-md mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.h2
                        className="text-2xl font-bold text-center text-gray-900 mb-8"
                        variants={itemVariants}
                    >
                        Our Impact
                    </motion.h2>

                    <div className="grid grid-cols-3 gap-4">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon
                            return (
                                <motion.div
                                    key={index}
                                    className="text-center p-4 bg-gray-50 rounded-xl"
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <Icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                                    <div className="text-sm text-gray-600">{stat.label}</div>
                                </motion.div>
                            )
                        })}
                    </div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="px-4 py-12 bg-gray-50">
                <motion.div
                    className="max-w-md mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.h2
                        className="text-2xl font-bold text-center text-gray-900 mb-8"
                        variants={itemVariants}
                    >
                        Why Choose Us?
                    </motion.h2>

                    <div className="grid grid-cols-2 gap-4">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100"
                                variants={itemVariants}
                                whileHover={{ scale: 1.02, shadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                            >
                                <div className="text-3xl mb-3">{feature.icon}</div>
                                <h3 className="font-semibold text-gray-900 text-sm mb-2">{feature.title}</h3>
                                <p className="text-xs text-gray-600 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Quick Links Section */}
            <section className="px-4 py-8 bg-white">
                <motion.div
                    className="max-w-md mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.h2
                        className="text-2xl font-bold text-center text-gray-900 mb-8"
                        variants={itemVariants}
                    >
                        Explore More
                    </motion.h2>

                    <div className="space-y-4">
                        <motion.button
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/about')}
                            className="w-full bg-white border border-gray-200 rounded-xl p-4 text-left hover:border-blue-200 hover:bg-blue-50 transition-all group"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">About Western Mega</h3>
                                    <p className="text-sm text-gray-600">Learn about our mission and values</p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                            </div>
                        </motion.button>

                        <motion.button
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/courses')}
                            className="w-full bg-white border border-gray-200 rounded-xl p-4 text-left hover:border-blue-200 hover:bg-blue-50 transition-all group"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">Our Courses</h3>
                                    <p className="text-sm text-gray-600">Discover our comprehensive programs</p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                            </div>
                        </motion.button>

                        <motion.button
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/blog')}
                            className="w-full bg-white border border-gray-200 rounded-xl p-4 text-left hover:border-blue-200 hover:bg-blue-50 transition-all group"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">Latest News</h3>
                                    <p className="text-sm text-gray-600">Stay updated with college events</p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                            </div>
                        </motion.button>
                    </div>
                </motion.div>
            </section>
        </div>
    )
}

export default HomePage