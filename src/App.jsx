// App.jsx - Updated with Logo Support
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider } from 'antd-mobile'
import { AuthProvider, useAuth } from './contexts/AuthContext'

// Components
import MobileHeader from './components/MobileHeader'
import MobileNav from './components/MobileNav'
import LoadingScreen from './components/LoadingScreen'

// Pages
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import CoursesPage from './pages/CoursesPage'
import BlogPage from './pages/BlogPage'
import LoginPage from './pages/LoginPage'

// Student Dashboard Pages (Protected)
import StudentDashboard from './pages/student/Dashboard'
import StudentProfile from './pages/student/Profile'
import StudentCourses from './pages/student/Courses'
import StudentResults from './pages/student/Results'

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

// Public Route Component (redirect if already logged in)
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  if (isAuthenticated) {
    return <Navigate to="/student/dashboard" replace />
  }

  return children
}

// Logo Component with fallback
function Logo({ className = "w-8 h-8", showText = false }) {
  const [imageError, setImageError] = useState(false)

  return (
    <div className="flex items-center space-x-2">
      {!imageError ? (
        <img
          src="/logo.jpeg"
          alt="Western Mega College"
          className={`${className} rounded-lg object-cover`}
          onError={() => setImageError(true)}
          onLoad={() => setImageError(false)}
        />
      ) : (
        <div className={`${className} bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center`}>
          <span className="text-white font-bold text-sm">W</span>
        </div>
      )}
      {showText && (
        <div>
          <h1 className="font-bold text-gray-900">Western Mega</h1>
          <p className="text-xs text-gray-600">College</p>
        </div>
      )}
    </div>
  )
}

// Main App Layout
function AppLayout({ children }) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const { isAuthenticated } = useAuth()

  const closeMobileNav = () => setIsMobileNavOpen(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader
        onMenuClick={() => setIsMobileNavOpen(true)}
        Logo={Logo}
      />

      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={closeMobileNav}
        isAuthenticated={isAuthenticated}
        Logo={Logo}
      />

      <main className="flex-1 pb-safe">
        {children}
      </main>
    </div>
  )
}

function App() {
  return (
    <ConfigProvider
      theme={{
        primaryColor: '#2563eb',
      }}
    >
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={
                <AppLayout>
                  <HomePage />
                </AppLayout>
              } />

              <Route path="/about" element={
                <AppLayout>
                  <AboutPage />
                </AppLayout>
              } />

              <Route path="/courses" element={
                <AppLayout>
                  <CoursesPage />
                </AppLayout>
              } />

              <Route path="/blog" element={
                <AppLayout>
                  <BlogPage />
                </AppLayout>
              } />

              <Route path="/login" element={
                <PublicRoute>
                  <LoginPage Logo={Logo} />
                </PublicRoute>
              } />

              {/* Protected Student Routes */}
              <Route path="/student/dashboard" element={
                <ProtectedRoute>
                  <AppLayout>
                    <StudentDashboard />
                  </AppLayout>
                </ProtectedRoute>
              } />

              <Route path="/student/profile" element={
                <ProtectedRoute>
                  <AppLayout>
                    <StudentProfile />
                  </AppLayout>
                </ProtectedRoute>
              } />

              <Route path="/student/courses" element={
                <ProtectedRoute>
                  <AppLayout>
                    <StudentCourses />
                  </AppLayout>
                </ProtectedRoute>
              } />

              <Route path="/student/results" element={
                <ProtectedRoute>
                  <AppLayout>
                    <StudentResults />
                  </AppLayout>
                </ProtectedRoute>
              } />

              {/* Redirect unknown routes */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ConfigProvider>
  )
}

export default App