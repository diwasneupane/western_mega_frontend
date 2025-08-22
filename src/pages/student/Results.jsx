// pages/student/Results.jsx
import React, { useState, useEffect } from 'react'
import { Trophy, TrendingUp, Award, Calendar, BarChart3, Download, Eye, ChevronDown, ChevronUp, Star, Target, RefreshCw } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import apiService from '../../services/apiService'
import LoadingScreen from '../../components/LoadingScreen'

const Results = () => {
    const { user } = useAuth()
    const [results, setResults] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedSemester, setSelectedSemester] = useState('current')
    const [expandedCourse, setExpandedCourse] = useState(null)
    const [refreshing, setRefreshing] = useState(false)

    useEffect(() => {
        if (user?.id) {
            loadResults()
        }
    }, [user?.id])

    const loadResults = async () => {
        try {
            setLoading(true)
            setError(null)

            console.log('Loading results for user:', user?.id)

            const response = await apiService.getStudentResults()

            console.log('Results API response:', response)

            if (response.success && response.data) {
                setResults(response.data)

                // Set default selected semester to current or first available
                const currentSemester = response.data.semesters?.find(s => s.status === 'current')
                if (currentSemester) {
                    setSelectedSemester('current')
                } else if (response.data.semesters?.length > 0) {
                    setSelectedSemester(response.data.semesters[0].id)
                }
            } else {
                setError('No results data found. Please check with your academic advisor.')
                setResults(null)
            }
        } catch (err) {
            console.error('Results loading error:', err)
            setError(err.message || 'Failed to load results. Please try again.')
            setResults(null)
        } finally {
            setLoading(false)
        }
    }

    const handleRefresh = async () => {
        setRefreshing(true)
        await loadResults()
        setRefreshing(false)
    }

    if (loading) return <LoadingScreen message="Loading your academic results..." />

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="bg-gradient-to-r from-green-600 to-green-700 px-4 py-6 text-white">
                    <h1 className="text-xl font-bold">Academic Results</h1>
                    <p className="text-green-100 text-sm mt-1">Your grades and academic progress</p>
                </div>

                <div className="p-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trophy className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-red-900 mb-2">Unable to Load Results</h3>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
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

    if (!results || !results.overview) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="bg-gradient-to-r from-green-600 to-green-700 px-4 py-6 text-white">
                    <h1 className="text-xl font-bold">Academic Results</h1>
                    <p className="text-green-100 text-sm mt-1">Your grades and academic progress</p>
                </div>

                <div className="p-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BarChart3 className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">No Results Available</h3>
                        <p className="text-blue-600 mb-4">
                            You don't have any academic results yet. Results will appear here once your courses are graded.
                        </p>
                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Check Again
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    const getGradeColor = (grade) => {
        if (!grade) return 'text-gray-700 bg-gray-50'

        const gradeUpper = grade.toString().toUpperCase()
        if (gradeUpper === 'A' || gradeUpper === 'A+') return 'text-green-700 bg-green-50'
        if (gradeUpper === 'A-' || gradeUpper === 'B+') return 'text-blue-700 bg-blue-50'
        if (gradeUpper === 'B' || gradeUpper === 'B-') return 'text-yellow-700 bg-yellow-50'
        if (gradeUpper === 'C+' || gradeUpper === 'C') return 'text-orange-700 bg-orange-50'
        return 'text-red-700 bg-red-50'
    }

    const calculateCurrentScore = (assignments) => {
        if (!assignments || assignments.length === 0) return null

        const completed = assignments.filter(a => a.score !== null && a.score !== undefined)
        if (completed.length === 0) return null

        const totalScore = completed.reduce((sum, a) => {
            const percentage = (a.score / a.total) * 100
            return sum + (percentage * (a.weight / 100))
        }, 0)

        return totalScore
    }

    const currentSemester = results.semesters?.find(s => s.status === 'current')
    const selectedSemesterData = selectedSemester === 'current'
        ? currentSemester
        : results.semesters?.find(s => s.id === selectedSemester)

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-4 py-6 text-white">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold">Academic Results</h1>
                        <p className="text-green-100 text-sm mt-1">
                            Your grades and academic progress
                        </p>
                    </div>
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="p-2 rounded-lg bg-green-500 hover:bg-green-400 disabled:opacity-50"
                    >
                        <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* GPA Overview */}
            <div className="px-4 py-4 -mt-4 relative z-10">
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {results.overview.currentGPA?.toFixed(2) || '0.00'}
                                </p>
                                <p className="text-sm text-gray-600">Current GPA</p>
                            </div>
                            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {results.overview.cumulativeGPA?.toFixed(2) || '0.00'}
                                </p>
                                <p className="text-sm text-gray-600">Cumulative GPA</p>
                            </div>
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                <Trophy className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {results.overview.totalCredits || 0}
                                </p>
                                <p className="text-sm text-gray-600">Total Credits</p>
                            </div>
                            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                                <Award className="w-5 h-5 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-bold text-gray-900">
                                    #{results.overview.rank || 'N/A'}
                                </p>
                                <p className="text-sm text-gray-600">Class Rank</p>
                            </div>
                            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                                <Target className="w-5 h-5 text-yellow-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rank Progress */}
                {results.overview.rank && results.overview.totalStudents && (
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">Class Ranking</span>
                            <span className="text-sm font-medium text-gray-900">
                                {results.overview.rank} of {results.overview.totalStudents}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                                style={{
                                    width: `${((results.overview.totalStudents - results.overview.rank) / results.overview.totalStudents) * 100}%`
                                }}
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Top {Math.round(((results.overview.rank) / results.overview.totalStudents) * 100)}% of your class
                        </p>
                    </div>
                )}
            </div>

            {/* Semester Selector */}
            {results.semesters && results.semesters.length > 0 && (
                <div className="px-4 py-4">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Semester Results</h2>
                    <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
                        <select
                            value={selectedSemester}
                            onChange={(e) => setSelectedSemester(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            {currentSemester && (
                                <option value="current">
                                    Current Semester - {currentSemester.name} (GPA: {currentSemester.gpa})
                                </option>
                            )}
                            {results.semesters
                                .filter(s => s.status === 'completed')
                                .map(semester => (
                                    <option key={semester.id} value={semester.id}>
                                        {semester.name} - GPA: {semester.gpa}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                </div>
            )}

            {/* Course Results */}
            {selectedSemesterData && selectedSemesterData.courses && selectedSemesterData.courses.length > 0 && (
                <div className="px-4 py-4">
                    <div className="space-y-4">
                        {selectedSemesterData.courses.map(course => {
                            const currentScore = calculateCurrentScore(course.assignments || [])
                            const isExpanded = expandedCourse === course.id

                            return (
                                <div key={course.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                                    {/* Course Header */}
                                    <div
                                        onClick={() => setExpandedCourse(isExpanded ? null : course.id)}
                                        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="font-semibold text-gray-900">{course.name}</h3>
                                                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(course.grade)}`}>
                                                        {course.grade || 'Pending'}
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center text-sm text-gray-600">
                                                    <span>{course.code} • {course.credits} Credits</span>
                                                    <span>Points: {course.points?.toFixed(1) || '0.0'}</span>
                                                </div>
                                                {currentScore && (
                                                    <div className="mt-2">
                                                        <div className="flex justify-between text-xs mb-1">
                                                            <span className="text-gray-600">Current Score</span>
                                                            <span className="font-medium">{currentScore.toFixed(1)}%</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                            <div
                                                                className="bg-green-500 h-1.5 rounded-full"
                                                                style={{ width: `${Math.min(currentScore, 100)}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                {course.assignments && course.assignments.length > 0 && (
                                                    isExpanded ? (
                                                        <ChevronUp className="w-5 h-5 text-gray-400" />
                                                    ) : (
                                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Course Details */}
                                    {isExpanded && course.assignments && course.assignments.length > 0 && (
                                        <div className="border-t border-gray-100 p-4 bg-gray-50">
                                            <h4 className="font-medium text-gray-900 mb-3">Assignment Breakdown</h4>
                                            <div className="space-y-2">
                                                {course.assignments.map((assignment, index) => (
                                                    <div key={index} className="flex items-center justify-between py-2 px-3 bg-white rounded-lg">
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-gray-900">{assignment.name}</p>
                                                            <p className="text-xs text-gray-600">Weight: {assignment.weight}%</p>
                                                        </div>
                                                        <div className="text-right">
                                                            {assignment.score !== null && assignment.score !== undefined ? (
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-900">
                                                                        {assignment.score}/{assignment.total}
                                                                    </p>
                                                                    <p className="text-xs text-gray-600">
                                                                        {((assignment.score / assignment.total) * 100).toFixed(1)}%
                                                                    </p>
                                                                </div>
                                                            ) : (
                                                                <p className="text-sm text-gray-500">Pending</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Achievements */}
            {results.achievements && results.achievements.length > 0 && (
                <div className="px-4 py-4 mb-20">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h2>
                    <div className="space-y-3">
                        {results.achievements.map((achievement, index) => (
                            <div key={index} className="bg-white rounded-xl p-4 shadow-sm flex items-center">
                                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mr-4">
                                    <Star className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900">{achievement.name}</h3>
                                    <p className="text-sm text-gray-600">{achievement.description}</p>
                                    <p className="text-xs text-gray-500 mt-1">{achievement.semester}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Download Results */}
                    <div className="mt-6">
                        <button
                            onClick={() => {
                                // You can implement actual transcript download here
                                alert('Transcript download feature will be implemented based on your backend API')
                            }}
                            className="w-full flex items-center justify-center py-3 px-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                        >
                            <Download className="w-5 h-5 mr-2" />
                            Download Official Transcript
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Results