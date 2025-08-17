// pages/student/Courses.jsx
import React, { useState, useEffect } from 'react'
import { BookOpen, Clock, User, Calendar, FileText, Video, CheckCircle, AlertCircle, ChevronRight, Download, Play } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import apiService from '../../services/apiService'
import LoadingScreen from '../../components/LoadingScreen'
import { motion } from 'framer-motion'
const Courses = () => {
    const { user } = useAuth()
    const [courses, setCourses] = useState([])
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [activeTab, setActiveTab] = useState('all')

    useEffect(() => {
        loadCourses()
    }, [])

    const loadCourses = async () => {
        try {
            setLoading(true)
            const response = await apiService.getStudentCourses()
            if (response.success) {
                setCourses(response.data.courses)
            } else {
                setError('Failed to load courses')
            }
        } catch (err) {
            setError('Failed to load courses')
            console.error('Courses error:', err)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <LoadingScreen message="Loading your courses..." />

    if (error) {
        return (
            <div className="p-4 text-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={loadCourses}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    // Mock data if API fails
    const mockCourses = [
        {
            id: 1,
            name: 'Advanced Algorithms',
            code: 'CS-401',
            instructor: 'Dr. Sarah Smith',
            credits: 3,
            semester: 'Fall 2024',
            progress: 75,
            status: 'active',
            nextClass: '2024-01-20T10:00:00',
            totalLectures: 24,
            attendedLectures: 18,
            assignments: [
                { id: 1, title: 'Binary Search Trees', dueDate: '2024-01-25', status: 'pending', points: 25 },
                { id: 2, title: 'Graph Algorithms', dueDate: '2024-01-15', status: 'submitted', points: 30, grade: 28 },
                { id: 3, title: 'Dynamic Programming', dueDate: '2024-01-10', status: 'graded', points: 35, grade: 32 }
            ],
            materials: [
                { id: 1, title: 'Lecture 1: Introduction to Algorithms', type: 'video', duration: '45 min' },
                { id: 2, title: 'Algorithm Analysis Notes', type: 'pdf', size: '2.4 MB' },
                { id: 3, title: 'Practice Problems Set 1', type: 'pdf', size: '1.2 MB' }
            ]
        },
        {
            id: 2,
            name: 'Database Systems',
            code: 'CS-402',
            instructor: 'Prof. Michael Johnson',
            credits: 3,
            semester: 'Fall 2024',
            progress: 60,
            status: 'active',
            nextClass: '2024-01-20T14:00:00',
            totalLectures: 20,
            attendedLectures: 12,
            assignments: [
                { id: 4, title: 'ER Diagram Design', dueDate: '2024-01-22', status: 'pending', points: 20 },
                { id: 5, title: 'SQL Queries Assignment', dueDate: '2024-01-12', status: 'graded', points: 25, grade: 23 }
            ],
            materials: [
                { id: 4, title: 'Database Fundamentals', type: 'video', duration: '60 min' },
                { id: 5, title: 'SQL Reference Guide', type: 'pdf', size: '3.1 MB' }
            ]
        },
        {
            id: 3,
            name: 'Software Engineering',
            code: 'CS-403',
            instructor: 'Dr. Emily Davis',
            credits: 4,
            semester: 'Fall 2024',
            progress: 80,
            status: 'active',
            nextClass: '2024-01-21T09:00:00',
            totalLectures: 28,
            attendedLectures: 22,
            assignments: [
                { id: 6, title: 'System Design Document', dueDate: '2024-01-28', status: 'pending', points: 40 },
                { id: 7, title: 'Unit Testing Project', dueDate: '2024-01-18', status: 'submitted', points: 30, grade: null }
            ],
            materials: [
                { id: 6, title: 'Software Development Life Cycle', type: 'video', duration: '75 min' },
                { id: 7, title: 'Design Patterns Handbook', type: 'pdf', size: '4.2 MB' }
            ]
        }
    ]

    const data = courses.length > 0 ? courses : mockCourses

    const filteredCourses = data.filter(course => {
        if (activeTab === 'active') return course.status === 'active'
        if (activeTab === 'completed') return course.status === 'completed'
        return true
    })

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'text-orange-600 bg-orange-50'
            case 'submitted': return 'text-blue-600 bg-blue-50'
            case 'graded': return 'text-green-600 bg-green-50'
            default: return 'text-gray-600 bg-gray-50'
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <AlertCircle className="w-4 h-4" />
            case 'submitted': return <Clock className="w-4 h-4" />
            case 'graded': return <CheckCircle className="w-4 h-4" />
            default: return <FileText className="w-4 h-4" />
        }
    }

    if (selectedCourse) {
        return (
            <div className="min-h-screen bg-gray-50">
                {/* Course Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-6 text-white">
                    <button
                        onClick={() => setSelectedCourse(null)}
                        className="text-blue-200 hover:text-white mb-4"
                    >
                        ← Back to Courses
                    </button>
                    <h1 className="text-xl font-bold">{selectedCourse.name}</h1>
                    <p className="text-blue-100 text-sm">{selectedCourse.code} • {selectedCourse.instructor}</p>
                </div>

                {/* Course Progress */}
                <div className="px-4 py-4 bg-white border-b">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Course Progress</span>
                        <span className="text-gray-900 font-medium">{selectedCourse.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${selectedCourse.progress}%` }}
                        />
                    </div>
                </div>

                {/* Course Stats */}
                <div className="px-4 py-4 bg-white border-b">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {selectedCourse.attendedLectures}/{selectedCourse.totalLectures}
                            </p>
                            <p className="text-sm text-gray-600">Lectures</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{selectedCourse.assignments.length}</p>
                            <p className="text-sm text-gray-600">Assignments</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{selectedCourse.credits}</p>
                            <p className="text-sm text-gray-600">Credits</p>
                        </div>
                    </div>
                </div>

                {/* Assignments */}
                <div className="px-4 py-4">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Assignments</h2>
                    <div className="space-y-3">
                        {selectedCourse.assignments.map(assignment => (
                            <div key={assignment.id} className="bg-white rounded-xl p-4 shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-medium text-gray-900">{assignment.title}</h3>
                                    <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                                        {getStatusIcon(assignment.status)}
                                        <span className="ml-1 capitalize">{assignment.status}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">
                                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                    </span>
                                    <span className="text-gray-900 font-medium">
                                        {assignment.grade ? `${assignment.grade}/${assignment.points}` : `${assignment.points} points`}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Course Materials */}
                <div className="px-4 py-4 mb-20">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Materials</h2>
                    <div className="space-y-3">
                        {selectedCourse.materials.map(material => (
                            <div key={material.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                                        {material.type === 'video' ? (
                                            <Video className="w-5 h-5 text-blue-600" />
                                        ) : (
                                            <FileText className="w-5 h-5 text-blue-600" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{material.title}</p>
                                        <p className="text-sm text-gray-600">
                                            {material.type === 'video' ? material.duration : material.size}
                                        </p>
                                    </div>
                                </div>
                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                    {material.type === 'video' ? (
                                        <Play className="w-5 h-5" />
                                    ) : (
                                        <Download className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-6 text-white">
                <h1 className="text-xl font-bold">My Courses</h1>
                <p className="text-blue-100 text-sm mt-1">
                    {user?.program} • {user?.semester}
                </p>
            </div>

            {/* Filter Tabs */}
            <div className="bg-white border-b px-4">
                <div className="flex space-x-1">
                    {[
                        { key: 'all', label: 'All Courses' },
                        { key: 'active', label: 'Active' },
                        { key: 'completed', label: 'Completed' }
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-600 hover:text-blue-600'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Courses List */}
            <div className="px-4 py-4 space-y-4 mb-20">
                {filteredCourses.map(course => (
                    <div
                        key={course.id}
                        onClick={() => setSelectedCourse(course)}
                        className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    >
                        {/* Course Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
                                <p className="text-gray-600 text-sm">{course.code}</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>

                        {/* Course Info */}
                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                            <div className="flex items-center text-gray-600">
                                <User className="w-4 h-4 mr-2" />
                                {course.instructor}
                            </div>
                            <div className="flex items-center text-gray-600">
                                <BookOpen className="w-4 h-4 mr-2" />
                                {course.credits} Credits
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Calendar className="w-4 h-4 mr-2" />
                                {course.semester}
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Clock className="w-4 h-4 mr-2" />
                                Next: {new Date(course.nextClass).toLocaleString()}
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600">Progress</span>
                                <span className="text-gray-900 font-medium">{course.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${course.progress}%` }}
                                />
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Attendance: {course.attendedLectures}/{course.totalLectures}</span>
                            <span>Assignments: {course.assignments.filter(a => a.status === 'graded').length}/{course.assignments.length}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Courses