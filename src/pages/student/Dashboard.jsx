import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    BookOpen,
    BarChart3,
    Calendar,
    Clock,
    Star,
    TrendingUp,
    Award,
    ChevronRight,
    Users,
    Target
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import apiService from '../../services/apiService'
import { motion } from 'framer-motion'
function Dashboard() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [dashboardData, setDashboardData] = useState({
        courses: [],
        recentResults: [],
        gpa: null,
        stats: {
            totalCourses: 0,
            completedCourses: 0,
            averageGrade: 0,
            currentSemester: 1
        }
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (user) {
            loadDashboardData()
        }
    }, [user])

    const loadDashboardData = async () => {
        try {
            setLoading(true)

            // Load enrolled courses
            const coursesResult = await apiService.courses.getEnrolledCourses(user._id, { limit: 5 })

            // Load recent results
            const resultsResult = await apiService.results.getStudentResults(user._id, {
                limit: 3,
                sort: 'createdAt',
                order: 'desc'
            })

            // Load current semester GPA
            const gpaResult = await apiService.results.calculateGPA(
                user._id,
                dashboardData.stats.currentSemester,
                '2024-2025'
            )

            setDashboardData(prev => ({
                ...prev,
                courses: coursesResult.success ? coursesResult.data : [],
                recentResults: resultsResult.success ? resultsResult.data : [],
                gpa: gpaResult.success ? gpaResult.data.gpa : null,
                stats: {
                    ...prev.stats,
                    totalCourses: coursesResult.success ? coursesResult.data.length : 0,
                    completedCourses: coursesResult.success ?
                        coursesResult.data.filter(course => course.status === 'completed').length : 0
                }
            }))

        } catch (error) {
            console.error('Error loading dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    const getGradeColor = (grade) => {
        if (['A+', 'A'].includes(grade)) return 'text-green-600 bg-green-100'
        if (['A-', 'B+', 'B'].includes(grade)) return 'text-blue-600 bg-blue-100'
        if (['B-', 'C+', 'C'].includes(grade)) return 'text-orange-600 bg-orange-100'
        return 'text-red-600 bg-red-100'
    }

    const getProgressPercentage = (course) => {
        const now = new Date()
        const start = new Date(course.startDate)
        const end = new Date(course.endDate)
        const total = end - start
        const elapsed = now - start
        return Math.min(Math.max((elapsed / total) * 100, 0), 100)
    }

    const quickActions = [
        {
            title: 'View All Courses',
            description: 'See your enrolled courses',
            icon: BookOpen,
            color: 'from-blue-500 to-blue-600',
            onClick: () => navigate('/student/courses')
        },
        {
            title: 'Check Results',
            description: 'View grades and GPA',
            icon: BarChart3,
            color: 'from-green-500 to-green-600',
            onClick: () => navigate('/student/results')
        },
        {
            title: 'Update Profile',
            description: 'Manage your information',
            icon: Users,
            color: 'from-purple-500 to-purple-600',
            onClick: () => navigate('/student/profile')
        }
    ]

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Welcome Section */}
            <section className="px-4 py-6 bg-gradient-to-r from-blue-600 to-green-500 text-white">
                <motion.div
                    className="max-w-md mx-auto"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-2xl font-bold mb-2">
                        Welcome back, {user?.firstName}! 👋
                    </h1>
                    <p className="opacity-90">Ready to continue your learning journey?</p>
                </motion.div>
            </section>

            {/* Quick Stats */}
            <section className="px-4 py-6 bg-white">
                <motion.div
                    className="max-w-md mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="grid grid-cols-2 gap-4">
                        <motion.div
                            className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 text-center"
                            variants={itemVariants}
                        >
                            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-2xl font-bold text-blue-600 mb-1">
                                {dashboardData.stats.totalCourses}
                            </div>
                            <div className="text-sm text-blue-700">Active Courses</div>
                        </motion.div>

                        <motion.div
                            className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 text-center"
                            variants={itemVariants}
                        >
                            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <Award className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-2xl font-bold text-green-600 mb-1">
                                {dashboardData.gpa ? dashboardData.gpa.toFixed(2) : '0.00'}
                            </div>
                            <div className="text-sm text-green-700">Current GPA</div>
                        </motion.div>

                        <motion.div
                            className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 text-center"
                            variants={itemVariants}
                        >
                            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <Target className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-2xl font-bold text-purple-600 mb-1">
                                {dashboardData.stats.completedCourses}
                            </div>
                            <div className="text-sm text-purple-700">Completed</div>
                        </motion.div>

                        <motion.div
                            className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 text-center"
                            variants={itemVariants}
                        >
                            <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <Calendar className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-2xl font-bold text-orange-600 mb-1">
                                {dashboardData.stats.currentSemester}
                            </div>
                            <div className="text-sm text-orange-700">Semester</div>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* Quick Actions */}
            <section className="px-4 py-6">
                <motion.div
                    className="max-w-md mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.h2
                        className="text-xl font-bold text-gray-900 mb-4"
                        variants={itemVariants}
                    >
                        Quick Actions
                    </motion.h2>

                    <div className="space-y-3">
                        {quickActions.map((action, index) => {
                            const Icon = action.icon
                            return (
                                <motion.button
                                    key={index}
                                    onClick={action.onClick}
                                    className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left hover:shadow-md transition-all"
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900">{action.title}</h3>
                                            <p className="text-sm text-gray-600">{action.description}</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                    </div>
                                </motion.button>
                            )
                        })}
                    </div>
                </motion.div>
            </section>

            {/* Recent Courses */}
            <section className="px-4 py-6 bg-white">
                <motion.div
                    className="max-w-md mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="flex items-center justify-between mb-4">
                        <motion.h2
                            className="text-xl font-bold text-gray-900"
                            variants={itemVariants}
                        >
                            Current Courses
                        </motion.h2>
                        <motion.button
                            onClick={() => navigate('/student/courses')}
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                            variants={itemVariants}
                            whileHover={{ scale: 1.05 }}
                        >
                            View All
                        </motion.button>
                    </div>

                    {dashboardData.courses.length === 0 ? (
                        <motion.div
                            className="text-center py-8"
                            variants={itemVariants}
                        >
                            <div className="w-16 h-16 bg-gray-200 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                                <BookOpen className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-600">No active courses</p>
                        </motion.div>
                    ) : (
                        <div className="space-y-4">
                            {dashboardData.courses.slice(0, 3).map((course, index) => (
                                <motion.div
                                    key={course._id}
                                    className="bg-gray-50 rounded-2xl p-4"
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="flex items-start space-x-3">
                                        {/* Course Image Placeholder */}
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <div className="text-center text-gray-500">
                                                <BookOpen className="w-6 h-6" />
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
                                            <p className="text-sm text-blue-600 mb-2">{course.courseCode}</p>

                                            {/* Progress Bar */}
                                            <div className="mb-2">
                                                <div className="flex justify-between text-xs text-gray-600 mb-1">
                                                    <span>Progress</span>
                                                    <span>{Math.round(getProgressPercentage(course))}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${getProgressPercentage(course)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </section>

            {/* Recent Results */}
            <section className="px-4 py-6">
                <motion.div
                    className="max-w-md mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="flex items-center justify-between mb-4">
                        <motion.h2
                            className="text-xl font-bold text-gray-900"
                            variants={itemVariants}
                        >
                            Recent Results
                        </motion.h2>
                        <motion.button
                            onClick={() => navigate('/student/results')}
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                            variants={itemVariants}
                            whileHover={{ scale: 1.05 }}
                        >
                            View All
                        </motion.button>
                    </div>

                    {dashboardData.recentResults.length === 0 ? (
                        <motion.div
                            className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100"
                            variants={itemVariants}
                        >
                            <div className="w-16 h-16 bg-gray-200 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                                <BarChart3 className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-600">No results available yet</p>
                        </motion.div>
                    ) : (
                        <div className="space-y-3">
                            {dashboardData.recentResults.map((result, index) => (
                                <motion.div
                                    key={result._id}
                                    className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1">
                                                {result.course?.title || 'Course Name'}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {result.course?.courseCode || 'COURSE101'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(result.overallGrade)}`}>
                                                {result.overallGrade || 'N/A'}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {result.overallPercentage || 0}%
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </section>
        </div>
    )
}

export default Dashboard