// pages/student/Results.jsx
import React, { useState, useEffect } from 'react'
import { Trophy, TrendingUp, Award, Calendar, BarChart3, Download, Eye, ChevronDown, ChevronUp, Star, Target } from 'lucide-react'
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

    useEffect(() => {
        loadResults()
    }, [])

    const loadResults = async () => {
        try {
            setLoading(true)
            const response = await apiService.getStudentResults()
            if (response.success) {
                setResults(response.data)
            } else {
                setError('Failed to load results')
            }
        } catch (err) {
            setError('Failed to load results')
            console.error('Results error:', err)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <LoadingScreen message="Loading your results..." />

    if (error) {
        return (
            <div className="p-4 text-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={loadResults}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    // Mock data if API fails
    const mockResults = {
        overview: {
            currentGPA: 3.85,
            cumulativeGPA: 3.78,
            totalCredits: 45,
            completedCourses: 15,
            rank: 12,
            totalStudents: 150
        },
        semesters: [
            {
                id: 'fall2024',
                name: 'Fall 2024',
                gpa: 3.85,
                credits: 15,
                status: 'current',
                courses: [
                    {
                        id: 1,
                        name: 'Advanced Algorithms',
                        code: 'CS-401',
                        credits: 3,
                        grade: 'A',
                        points: 4.0,
                        assignments: [
                            { name: 'Assignment 1', score: 28, total: 30, weight: 20 },
                            { name: 'Assignment 2', score: 25, total: 25, weight: 20 },
                            { name: 'Mid-term Exam', score: 42, total: 50, weight: 30 },
                            { name: 'Final Project', score: null, total: 40, weight: 30 }
                        ]
                    },
                    {
                        id: 2,
                        name: 'Database Systems',
                        code: 'CS-402',
                        credits: 3,
                        grade: 'A-',
                        points: 3.7,
                        assignments: [
                            { name: 'ER Diagram', score: 18, total: 20, weight: 25 },
                            { name: 'SQL Assignment', score: 23, total: 25, weight: 25 },
                            { name: 'Database Project', score: 35, total: 40, weight: 50 }
                        ]
                    },
                    {
                        id: 3,
                        name: 'Software Engineering',
                        code: 'CS-403',
                        credits: 4,
                        grade: 'B+',
                        points: 3.3,
                        assignments: [
                            { name: 'System Design', score: 32, total: 40, weight: 40 },
                            { name: 'Testing Project', score: 27, total: 30, weight: 30 },
                            { name: 'Final Exam', score: null, total: 50, weight: 30 }
                        ]
                    }
                ]
            },
            {
                id: 'spring2024',
                name: 'Spring 2024',
                gpa: 3.72,
                credits: 15,
                status: 'completed',
                courses: [
                    {
                        id: 4,
                        name: 'Data Structures',
                        code: 'CS-301',
                        credits: 3,
                        grade: 'A',
                        points: 4.0,
                        assignments: []
                    },
                    {
                        id: 5,
                        name: 'Computer Networks',
                        code: 'CS-302',
                        credits: 3,
                        grade: 'B+',
                        points: 3.3,
                        assignments: []
                    },
                    {
                        id: 6,
                        name: 'Operating Systems',
                        code: 'CS-303',
                        credits: 4,
                        grade: 'A-',
                        points: 3.7,
                        assignments: []
                    }
                ]
            }
        ],
        achievements: [
            { name: 'Dean\'s List', semester: 'Fall 2024', description: 'GPA above 3.75' },
            { name: 'Top Performer', semester: 'Spring 2024', description: 'Highest score in CS-301' },
            { name: 'Perfect Attendance', semester: 'Fall 2024', description: '100% class attendance' }
        ]
    }

    const data = results || mockResults

    const getGradeColor = (grade) => {
        if (grade === 'A' || grade === 'A+') return 'text-green-700 bg-green-50'
        if (grade === 'A-' || grade === 'B+') return 'text-blue-700 bg-blue-50'
        if (grade === 'B' || grade === 'B-') return 'text-yellow-700 bg-yellow-50'
        if (grade === 'C+' || grade === 'C') return 'text-orange-700 bg-orange-50'
        return 'text-red-700 bg-red-50'
    }

    const calculateCurrentScore = (assignments) => {
        const completed = assignments.filter(a => a.score !== null)
        if (completed.length === 0) return null

        const totalScore = completed.reduce((sum, a) => sum + (a.score / a.total) * a.weight, 0)
        const totalWeight = completed.reduce((sum, a) => sum + a.weight, 0)

        return totalWeight > 0 ? (totalScore / totalWeight * 100) : null
    }

    const currentSemester = data.semesters.find(s => s.status === 'current')
    const selectedSemesterData = selectedSemester === 'current'
        ? currentSemester
        : data.semesters.find(s => s.id === selectedSemester)

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-4 py-6 text-white">
                <h1 className="text-xl font-bold">Academic Results</h1>
                <p className="text-green-100 text-sm mt-1">
                    Your grades and academic progress
                </p>
            </div>

            {/* GPA Overview */}
            <div className="px-4 py-4 -mt-4 relative z-10">
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{data.overview.currentGPA}</p>
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
                                <p className="text-2xl font-bold text-gray-900">{data.overview.cumulativeGPA}</p>
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
                                <p className="text-2xl font-bold text-gray-900">{data.overview.totalCredits}</p>
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
                                <p className="text-2xl font-bold text-gray-900">#{data.overview.rank}</p>
                                <p className="text-sm text-gray-600">Class Rank</p>
                            </div>
                            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                                <Target className="w-5 h-5 text-yellow-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rank Progress */}
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Class Ranking</span>
                        <span className="text-sm font-medium text-gray-900">
                            {data.overview.rank} of {data.overview.totalStudents}
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                            style={{ width: `${((data.overview.totalStudents - data.overview.rank) / data.overview.totalStudents) * 100}%` }}
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Top {Math.round(((data.overview.rank) / data.overview.totalStudents) * 100)}% of your class</p>
                </div>
            </div>

            {/* Semester Selector */}
            <div className="px-4 py-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Semester Results</h2>
                <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
                    <select
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        <option value="current">Current Semester - {currentSemester?.name}</option>
                        {data.semesters.filter(s => s.status === 'completed').map(semester => (
                            <option key={semester.id} value={semester.id}>
                                {semester.name} - GPA: {semester.gpa}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Course Results */}
            {selectedSemesterData && (
                <div className="px-4 py-4">
                    <div className="space-y-4">
                        {selectedSemesterData.courses.map(course => {
                            const currentScore = calculateCurrentScore(course.assignments)
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
                                                        {course.grade}
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center text-sm text-gray-600">
                                                    <span>{course.code} • {course.credits} Credits</span>
                                                    <span>Points: {course.points}</span>
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
                                                {isExpanded ? (
                                                    <ChevronUp className="w-5 h-5 text-gray-400" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Course Details */}
                                    {isExpanded && course.assignments.length > 0 && (
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
                                                            {assignment.score !== null ? (
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
            <div className="px-4 py-4 mb-20">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h2>
                <div className="space-y-3">
                    {data.achievements.map((achievement, index) => (
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
                    <button className="w-full flex items-center justify-center py-3 px-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors">
                        <Download className="w-5 h-5 mr-2" />
                        Download Official Transcript
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Results;