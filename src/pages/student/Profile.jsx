// pages/student/Profile.jsx
import React, { useState, useRef } from 'react'
import { Camera, Edit3, Save, X, User, Mail, Phone, MapPin, Calendar, BookOpen } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { motion } from 'framer-motion'
const StudentProfile = () => {
    const { user, updateUserProfile, uploadProfilePicture } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const fileInputRef = useRef(null)

    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        dateOfBirth: user?.dateOfBirth || '',
        emergencyContact: user?.emergencyContact || ''
    })

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSave = async () => {
        setLoading(true)
        setError('')
        setSuccess('')

        try {
            const result = await updateUserProfile(formData)
            if (result.success) {
                setSuccess('Profile updated successfully!')
                setIsEditing(false)
            } else {
                setError(result.error || 'Failed to update profile')
            }
        } catch (err) {
            console.error('Update profile error:', err)
            setError('An error occurred while updating profile')
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        setFormData({
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || '',
            phone: user?.phone || '',
            address: user?.address || '',
            dateOfBirth: user?.dateOfBirth || '',
            emergencyContact: user?.emergencyContact || ''
        })
        setIsEditing(false)
        setError('')
        setSuccess('')
    }

    const handleProfilePictureChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('File size must be less than 5MB')
            return
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please select a valid image file')
            return
        }

        setLoading(true)
        setError('')

        try {
            const result = await uploadProfilePicture(file)
            if (result.success) {
                setSuccess('Profile picture updated successfully!')
            } else {
                setError(result.error || 'Failed to update profile picture')
            }
        } catch (err) {
            console.error('Upload profile picture error:', err)
            setError('An error occurred while uploading image')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">My Profile</h1>
                        <p className="text-blue-100 text-sm mt-1">Manage your personal information</p>
                    </div>
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                        >
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit
                        </button>
                    ) : (
                        <div className="flex space-x-2">
                            <button
                                onClick={handleCancel}
                                className="flex items-center px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                            >
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {loading ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Messages */}
            {error && (
                <div className="mx-4 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            {success && (
                <div className="mx-4 mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-600 text-sm">{success}</p>
                </div>
            )}

            {/* Profile Content */}
            <div className="px-4 py-4">
                {/* Profile Picture Section */}
                <div className="bg-white rounded-xl p-6 shadow-sm mb-4">
                    <div className="flex items-center space-x-6">
                        <div className="relative">
                            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                                {user?.profilePicture ? (
                                    <img
                                        src={user.profilePicture}
                                        alt="Profile"
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="text-white text-2xl font-bold">
                                        {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                                    </span>
                                )}
                            </div>

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={loading}
                                className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white shadow-lg transition-colors disabled:opacity-50"
                            >
                                <Camera className="w-4 h-4" />
                            </button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleProfilePictureChange}
                                className="hidden"
                            />
                        </div>

                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-gray-900">
                                {user?.firstName} {user?.lastName}
                            </h2>
                            <p className="text-gray-600">{user?.studentId}</p>
                            <p className="text-sm text-gray-500 mt-1">{user?.program}</p>
                        </div>
                    </div>
                </div>

                {/* Personal Information */}
                <div className="bg-white rounded-xl p-6 shadow-sm mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    First Name
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                ) : (
                                    <div className="flex items-center px-3 py-2 bg-gray-50 rounded-lg">
                                        <User className="w-4 h-4 text-gray-400 mr-2" />
                                        <span className="text-gray-900">{user?.firstName}</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Last Name
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                ) : (
                                    <div className="flex items-center px-3 py-2 bg-gray-50 rounded-lg">
                                        <User className="w-4 h-4 text-gray-400 mr-2" />
                                        <span className="text-gray-900">{user?.lastName}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            ) : (
                                <div className="flex items-center px-3 py-2 bg-gray-50 rounded-lg">
                                    <Mail className="w-4 h-4 text-gray-400 mr-2" />
                                    <span className="text-gray-900">{user?.email}</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number
                            </label>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            ) : (
                                <div className="flex items-center px-3 py-2 bg-gray-50 rounded-lg">
                                    <Phone className="w-4 h-4 text-gray-400 mr-2" />
                                    <span className="text-gray-900">{user?.phone || 'Not provided'}</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date of Birth
                            </label>
                            {isEditing ? (
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            ) : (
                                <div className="flex items-center px-3 py-2 bg-gray-50 rounded-lg">
                                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                                    <span className="text-gray-900">
                                        {user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not provided'}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Address
                            </label>
                            {isEditing ? (
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            ) : (
                                <div className="flex items-start px-3 py-2 bg-gray-50 rounded-lg">
                                    <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                                    <span className="text-gray-900">{user?.address || 'Not provided'}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Academic Information */}
                <div className="bg-white rounded-xl p-6 shadow-sm mb-20">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h3>

                    <div className="space-y-4">
                        <div className="flex items-center px-3 py-2 bg-gray-50 rounded-lg">
                            <BookOpen className="w-4 h-4 text-gray-400 mr-2" />
                            <div>
                                <span className="text-sm text-gray-600">Student ID: </span>
                                <span className="text-gray-900 font-medium">{user?.studentId}</span>
                            </div>
                        </div>

                        <div className="flex items-center px-3 py-2 bg-gray-50 rounded-lg">
                            <BookOpen className="w-4 h-4 text-gray-400 mr-2" />
                            <div>
                                <span className="text-sm text-gray-600">Program: </span>
                                <span className="text-gray-900 font-medium">{user?.program}</span>
                            </div>
                        </div>

                        <div className="flex items-center px-3 py-2 bg-gray-50 rounded-lg">
                            <BookOpen className="w-4 h-4 text-gray-400 mr-2" />
                            <div>
                                <span className="text-sm text-gray-600">Semester: </span>
                                <span className="text-gray-900 font-medium">{user?.semester}</span>
                            </div>
                        </div>

                        <div className="flex items-center px-3 py-2 bg-gray-50 rounded-lg">
                            <BookOpen className="w-4 h-4 text-gray-400 mr-2" />
                            <div>
                                <span className="text-sm text-gray-600">Current GPA: </span>
                                <span className="text-gray-900 font-medium">{user?.gpa || 'N/A'}</span>
                            </div>
                        </div>

                        <div className="flex items-center px-3 py-2 bg-gray-50 rounded-lg">
                            <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                            <div>
                                <span className="text-sm text-gray-600">Enrollment Date: </span>
                                <span className="text-gray-900 font-medium">
                                    {user?.enrollmentDate ? new Date(user.enrollmentDate).toLocaleDateString() : 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudentProfile