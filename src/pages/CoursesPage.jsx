// pages/CoursesPage.jsx
import React, { useState, useEffect } from 'react'
import { Search, Filter, Clock, Users, Star, BookOpen, User, ChevronRight } from 'lucide-react'
import LoadingScreen from '../components/LoadingScreen'
import apiService from '../services/apiService'

function CoursesPage() {
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [selectedLevel, setSelectedLevel] = useState('all')

    const categories = [
        { id: 'all', name: 'All', color: 'bg-blue-100 text-blue-700' },
        { id: 'Computer Science', name: 'Computer Science', color: 'bg-blue-100 text-blue-700' },
        { id: 'Mathematics', name: 'Mathematics', color: 'bg-green-100 text-green-700' },
        { id: 'Business', name: 'Business', color: 'bg-purple-100 text-purple-700' },
        { id: 'Engineering', name: 'Engineering', color: 'bg-orange-100 text-orange-700' }
    ]

    const levels = [
        { id: 'all', name: 'All Levels' },
        { id: 'beginner', name: 'Beginner' },
        { id: 'intermediate', name: 'Intermediate' },
        { id: 'advanced', name: 'Advanced' }
    ]

    useEffect(() => {
        loadCourses()
    }, [selectedCategory, selectedLevel])

    const loadCourses = async () => {
        setLoading(true)
        try {
            const params = {
                limit: 20,
                ...(selectedCategory !== 'all' && { category: selectedCategory }),
                ...(selectedLevel !== 'all' && { level: selectedLevel })
            }

            const result = await apiService.courses.getAll(params)
            if (result.success) {
                setCourses(result.data || [])
            } else {
                setCourses([])
            }
        } catch (error) {
            console.error('Error loading courses:', error)
            setCourses([])
        } finally {
            setLoading(false)
        }
    }

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getLevelColor = (level) => {
        const colors = {
            'beginner': 'bg-green-100 text-green-700',
            'intermediate': 'bg-blue-100 text-blue-700',
            'advanced': 'bg-red-100 text-red-700'
        }
        return colors[level] || 'bg-gray-100 text-gray-700'
    }

    const getStatusColor = (course) => {
        const now = new Date()
        const startDate = new Date(course.startDate)
        const endDate = new Date(course.endDate)

        if (now < startDate) return 'bg-blue-100 text-blue-700'
        if (now > endDate) return 'bg-gray-100 text-gray-700'
        return 'bg-green-100 text-green-700'
    }

    const getStatusText = (course) => {
        const now = new Date()
        const startDate = new Date(course.startDate)
        const endDate = new Date(course.endDate)

        if (now < startDate) return 'Upcoming'
        if (now > endDate) return 'Completed'
        return 'Ongoing'
    }

    if (loading) {
        return <LoadingScreen message="Loading courses..." />
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <section className="px-4 py-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <div className="max-w-md mx-auto">
                    <h1 className="text-2xl font-bold mb-2">Our Courses</h1>
                    <p className="text-blue-100">Discover our comprehensive range of programs</p>
                </div>
            </section>

            {/* Search and Filters */}
            <section className="px-4 py-4 bg-white border-b border-gray-100">
                <div className="max-w-md mx-auto space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === category.id
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : `${category.color} hover:shadow-md`
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>

                    {/* Level Filter */}
                    <div className="flex space-x-2">
                        {levels.map((level) => (
                            <button
                                key={level.id}
                                onClick={() => setSelectedLevel(level.id)}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${selectedLevel === level.id
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {level.name}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Courses List */}
            <section className="px-4 py-6">
                <div className="max-w-md mx-auto">
                    {filteredCourses.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 bg-gray-200 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                                <BookOpen className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Courses Found</h3>
                            <p className="text-gray-600">Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredCourses.map((course, index) => (
                                <div
                                    key={course._id}
                                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer"
                                >
                                    {/* Course Image Placeholder */}
                                    <div className="h-40 bg-gradient-to-br from-blue-100 via-purple-50 to-green-100 flex items-center justify-center">
                                        <div className="text-center text-gray-500">
                                            <BookOpen className="w-12 h-12 mx-auto mb-2" />
                                            <span className="text-sm font-medium">{course.category}</span>
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        {/* Course Header */}
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                                                        {course.level?.charAt(0).toUpperCase() + course.level?.slice(1)}
                                                    </span>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course)}`}>
                                                        {getStatusText(course)}
                                                    </span>
                                                </div>
                                                <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{course.title}</h3>
                                                <p className="text-sm text-blue-600 font-medium">{course.courseCode}</p>
                                            </div>
                                        </div>

                                        {/* Course Description */}
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                            {course.description}
                                        </p>

                                        {/* Course Meta Info */}
                                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex items-center space-x-1">
                                                    <User className="w-3 h-3" />
                                                    <span>{course.teacher?.firstName} {course.teacher?.lastName}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{course.duration} weeks</span>
                                                </div>
                                            </div>
                                            <span className="font-medium text-blue-600">{course.credits} credits</span>
                                        </div>

                                        {/* Enrollment Info */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Users className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm text-gray-600">
                                                    {course.enrolledCount || 0}/{course.maxStudents} enrolled
                                                </span>
                                                {/* Progress bar */}
                                                <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-blue-500 rounded-full transition-all"
                                                        style={{
                                                            width: `${((course.enrolledCount || 0) / course.maxStudents) * 100}%`
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
                                                <span>View Details</span>
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

export default CoursesPage