// pages/student/Courses.jsx
import React, { useState, useEffect } from 'react'
import { BookOpen, Clock, User, Calendar, FileText, Video, CheckCircle, AlertCircle, ChevronRight, Download, Play, RefreshCw, BookmarkX } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import apiService from '../../services/apiService'
import LoadingScreen from '../../components/LoadingScreen'

const Courses = () => {
    const { user } = useAuth()
    const [courses, setCourses] = useState([])
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [activeTab, setActiveTab] = useState('all')
    const [refreshing, setRefreshing] = useState(false)

    useEffect(() => {
        if (user?.id) {
            loadCourses()
        }
    }, [user?.id])

    const loadCourses = async () => {
        try {
            setLoading(true)
            setError(null)

            console.log('Loading courses for user:', user?.id)

            const response = await apiService.getStudentCourses()

            console.log('Courses API response:', response)

            if (response.success && response.data && response.data.courses) {
                setCourses(response.data.courses)
            } else {
                setCourses([])
                setError('No courses found. You may not be enrolled in any courses yet.')
            }
        } catch (err) {
            console.error('Courses loading error:', err)
            setError(err.message || 'Failed to load courses. Please try again.')
            setCourses([])
        } finally {
            setLoading(false)
        }
    }

    const handleRefresh = async () => {
        setRefreshing(true)
        await loadCourses()
        setRefreshing(false)
    }

    const getCourseDetails = async (courseId) => {
        try {
            const response = await apiService.getCourseDetails(courseId)
            return response.data || response
        } catch (error) {
            console.error('Error fetching course details:', error)
            return null
        }
    }

    const handleCourseClick = async (course) => {
        // Try to get detailed course information
        const detailedCourse = await getCourseDetails(course._id || course.id)

        // Merge basic course info with detailed info
        const fullCourseData = {
            ...course,
            ...(detailedCourse || {}),
            // Ensure we have the basic structure
            assignments: course.assignments || detailedCourse?.assessments || [],
            materials: course.materials || detailedCourse?.materials || [],
            progress: course.progress || 0,
            nextClass: course.nextClass || detailedCourse?.nextClass,
            totalLectures: course.totalLectures || detailedCourse?.totalLectures || 0,
            attendedLectures: course.attendedLectures || detailedCourse?.attendedLectures || 0
        }

        setSelectedCourse(fullCourseData)
    }

    if (loading) return <LoadingScreen message="Loading your courses..." />

    if (error && courses.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-6 text-white">
                    <h1 className="text-xl font-bold">My Courses</h1>
                    <p className="text-blue-100 text-sm mt-1">
                        {user?.program} • {user?.semester}
                    </p>
                </div>

                <div className="p-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookmarkX className="w-8 h-8 text-yellow-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-yellow-900 mb-2">No Courses Found</h3>
                        <p className="text-yellow-600 mb-4">{error}</p>
                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {refreshing ? (
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <RefreshCw className="w-4 h-4 mr-2" />
                            )}
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    const filteredCourses = courses.filter(course => {
        if (activeTab === 'active') return course.status === 'active' || course.isActive !== false
        if (activeTab === 'completed') return course.status === 'completed' || course.isActive === false
        return true
    })

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'text-orange-600 bg-orange-50'
            case 'submitted': return 'text-blue-600 bg-blue-50'
            case 'graded': return 'text-green-600 bg-green-50'
            case 'completed': return 'text-green-600 bg-green-50'
            case 'active': return 'text-blue-600 bg-blue-50'
            default: return 'text-gray-600 bg-gray-50'
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <AlertCircle className="w-4 h-4" />
            case 'submitted': return <Clock className="w-4 h-4" />
            case 'graded': return <CheckCircle className="w-4 h-4" />
            case 'completed': return <CheckCircle className="w-4 h-4" />
            default: return <FileText className="w-4 h-4" />
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'Not scheduled'

        try {
            return new Date(dateString).toLocaleString()
        } catch (error) {
            return 'Invalid date'
        }
    }

    if (selectedCourse) {
        return (
            <div className="min-h-screen bg-gray-50">
                {/* Course Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-6 text-white">
                    <button
                        onClick={() => setSelectedCourse(null)}
                        className="text-blue-200 hover:text-white mb-4 flex items-center"
                    >
                        ← Back to Courses
                    </button>
                    <h1 className="text-xl font-bold">{selectedCourse.title || selectedCourse.name}</h1>
                    <p className="text-blue-100 text-sm">
                        {selectedCourse.courseCode || selectedCourse.code} • {selectedCourse.teacher?.firstName} {selectedCourse.teacher?.lastName || selectedCourse.instructor}
                    </p>
                </div>

                {/* Course Progress */}
                <div className="px-4 py-4 bg-white border-b">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Course Progress</span>
                        <span className="text-gray-900 font-medium">{selectedCourse.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${selectedCourse.progress || 0}%` }}
                        />
                    </div>
                </div>

                {/* Course Stats */}
                <div className="px-4 py-4 bg-white border-b">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {selectedCourse.attendedLectures || 0}/{selectedCourse.totalLectures || 0}
                            </p>
                            <p className="text-sm text-gray-600">Lectures</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {selectedCourse.assignments?.length || selectedCourse.assessments?.length || 0}
                            </p>
                            <p className="text-sm text-gray-600">Assignments</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {selectedCourse.credits || 0}
                            </p>
                            <p className="text-sm text-gray-600">Credits</p>
                        </div>
                    </div>
                </div>

                {/* Course Description */}
                {selectedCourse.description && (
                    <div className="px-4 py-4 bg-white border-b">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                        <p className="text-gray-600">{selectedCourse.description}</p>
                    </div>
                )}

                {/* Assignments/Assessments */}
                {(selectedCourse.assignments?.length > 0 || selectedCourse.assessments?.length > 0) && (
                    <div className="px-4 py-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            {selectedCourse.assignments ? 'Assignments' : 'Assessments'}
                        </h2>
                        <div className="space-y-3">
                            {(selectedCourse.assignments || selectedCourse.assessments || []).map((item, index) => (
                                <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-medium text-gray-900">
                                            {item.title || item.name || item.type || `Assessment ${index + 1}`}
                                        </h3>
                                        <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                                            {getStatusIcon(item.status)}
                                            <span className="ml-1 capitalize">{item.status || 'pending'}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">
                                            Due: {formatDate(item.dueDate || item.deadline)}
                                        </span>
                                        <span className="text-gray-900 font-medium">
                                            {item.marksObtained && item.totalMarks
                                                ? `${item.marksObtained}/${item.totalMarks}`
                                                : item.grade
                                                    ? `${item.grade}/${item.points || item.totalMarks || 'N/A'}`
                                                    : `${item.totalMarks || item.points || 'N/A'} points`
                                            }
                                        </span>
                                    </div>

                                    {item.description && (
                                        <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Course Materials */}
                {selectedCourse.materials?.length > 0 && (
                    <div className="px-4 py-4 mb-20">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Materials</h2>
                        <div className="space-y-3">
                            {selectedCourse.materials.map((material, index) => (
                                <div key={index} className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                                            {material.type === 'video' ? (
                                                <Video className="w-5 h-5 text-blue-600" />
                                            ) : (
                                                <FileText className="w-5 h-5 text-blue-600" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {material.title || material.name || `Material ${index + 1}`}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {material.type === 'video'
                                                    ? (material.duration || 'Video file')
                                                    : (material.size || 'Document file')
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (material.url) {
                                                window.open(material.url, '_blank')
                                            } else {
                                                alert('Material URL not available')
                                            }
                                        }}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                    >
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
                )}
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-6 text-white">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold">My Courses</h1>
                        <p className="text-blue-100 text-sm mt-1">
                            {user?.program || 'Student'} • Semester {user?.currentSemester || user?.semester || 'N/A'}
                        </p>
                    </div>
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="p-2 rounded-lg bg-blue-500 hover:bg-blue-400 disabled:opacity-50"
                    >
                        <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                    </button>
                </div>
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
                {filteredCourses.length === 0 ? (
                    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <BookmarkX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No {activeTab !== 'all' ? activeTab : ''} courses found
                        </h3>
                        <p className="text-gray-600">
                            {activeTab === 'active'
                                ? 'You don\'t have any active courses at the moment.'
                                : activeTab === 'completed'
                                    ? 'You haven\'t completed any courses yet.'
                                    : 'You are not enrolled in any courses yet.'
                            }
                        </p>
                    </div>
                ) : (
                    filteredCourses.map(course => (
                        <div
                            key={course._id || course.id}
                            onClick={() => handleCourseClick(course)}
                            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        >
                            {/* Course Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {course.title || course.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm">{course.courseCode || course.code}</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </div>

                            {/* Course Info */}
                            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                <div className="flex items-center text-gray-600">
                                    <User className="w-4 h-4 mr-2" />
                                    {course.teacher?.firstName ?
                                        `${course.teacher.firstName} ${course.teacher.lastName}` :
                                        course.instructor || 'Instructor TBA'
                                    }
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <BookOpen className="w-4 h-4 mr-2" />
                                    {course.credits || 0} Credits
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    {course.semester || course.academicYear || 'Current Semester'}
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Clock className="w-4 h-4 mr-2" />
                                    {course.duration ? `${course.duration} weeks` : 'Duration TBA'}
                                </div>
                            </div>

                            {/* Progress Bar */}
                            {typeof course.progress === 'number' && (
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
                            )}

                            {/* Course Stats */}
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>
                                    Enrolled: {formatDate(course.enrollmentDate || course.startDate)}
                                </span>
                                <span>
                                    Status: {course.isActive !== false ? 'Active' : 'Inactive'}
                                </span>
                            </div>

                            {/* Course Description Preview */}
                            {course.description && (
                                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                    {course.description}
                                </p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Courses