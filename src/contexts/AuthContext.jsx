// contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react'
import apiService from '../services/apiService'

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    // Check authentication status on app load
    useEffect(() => {
        checkAuthStatus()
    }, [])

    const checkAuthStatus = async () => {
        try {
            const token = apiService.getToken()
            if (!token) {
                setLoading(false)
                return
            }

            const response = await apiService.get('/auth/me')
            if (response.success) {
                setUser(response.data.user)
                setIsAuthenticated(true)
            }
        } catch (error) {
            console.error('Auth check failed:', error)
            logout() // Clear invalid tokens
        } finally {
            setLoading(false)
        }
    }

    const login = async (identifier, password) => {
        try {
            setLoading(true)
            const response = await apiService.post('/auth/login', {
                identifier,
                password
            })

            if (response.success) {
                const { user, token } = response.data

                // Store token
                apiService.setToken(token)

                setUser(user)
                setIsAuthenticated(true)

                return { success: true, user }
            } else {
                return { success: false, error: response.error }
            }
        } catch (error) {
            console.error('Login error:', error)
            return {
                success: false,
                error: error.response?.data?.error || 'Login failed. Please try again.'
            }
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        apiService.removeToken()
        setUser(null)
        setIsAuthenticated(false)
    }

    const updateUserProfile = async (profileData) => {
        try {
            const response = await apiService.put('/users/profile', profileData)
            if (response.success) {
                setUser(prev => ({ ...prev, ...response.data.user }))
                return { success: true }
            }
            return { success: false, error: response.error }
        } catch (error) {
            console.error('Update profile error:', error)
            return { success: false, error: 'Failed to update profile' }
        }
    }

    const uploadProfilePicture = async (file) => {
        try {
            const formData = new FormData()
            formData.append('profilePicture', file)

            const response = await apiService.post('/users/upload-profile-picture', formData, {
                'Content-Type': 'multipart/form-data'
            })

            if (response.success) {
                setUser(prev => ({ ...prev, profilePicture: response.data.profilePicture }))
                return { success: true, data: response.data }
            }
            return { success: false, error: response.error }
        } catch (error) {
            console.error('Upload profile picture error:', error)
            return { success: false, error: 'Failed to upload profile picture' }
        }
    }

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        updateUserProfile,
        uploadProfilePicture,
        checkAuthStatus
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}