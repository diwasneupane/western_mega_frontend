// App.jsx - Mobile App with Bottom Navigation
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ConfigProvider } from 'antd-mobile'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { GraduationCap, Home, User, BookOpen, MessageCircle, LayoutDashboard, BarChart3, Menu, ArrowLeft } from 'lucide-react'

// Components
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
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
      )}
      {showText && (
        <div>
          <h1 className="font-bold text-gray-900 text-sm">Western Mega</h1>
          <p className="text-xs text-gray-600 -mt-0.5">College</p>
        </div>
      )}
    </div>
  )
}

// Mobile Header Component
function MobileHeader({ showBack = false, title = "Western Mega", onBack, onMenuClick }) {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          {showBack ? (
            <button
              onClick={onBack}
              className="p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
          ) : (
            <Logo className="w-10 h-10" />
          )}

          <div className="flex-1">
            <h1 className="font-bold text-gray-900 text-lg leading-tight truncate">
              {title}
            </h1>
          </div>
        </div>

        <button
          onClick={onMenuClick}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
      </div>
    </header>
  )
}

// Bottom Navigation Component
function BottomNavigation({ isAuthenticated }) {
  const location = useLocation()
  const navigate = (path) => window.location.href = path

  const publicTabs = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/about', icon: User, label: 'About' },
    { path: '/courses', icon: BookOpen, label: 'Courses' },
    { path: '/blog', icon: MessageCircle, label: 'Blog' }
  ]

  const studentTabs = [
    { path: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/student/courses', icon: BookOpen, label: 'Courses' },
    { path: '/student/results', icon: BarChart3, label: 'Results' },
    { path: '/student/profile', icon: User, label: 'Profile' }
  ]

  const tabs = isAuthenticated ? studentTabs : publicTabs

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-50 safe-area-pb">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const IconComponent = tab.icon
          const isActive = location.pathname === tab.path

          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 ${isActive
                ? 'bg-blue-50 text-blue-600 scale-105'
                : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
                }`}
            >
              <div className={`relative ${isActive ? 'transform -translate-y-0.5' : ''}`}>
                <IconComponent
                  className={`w-6 h-6 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}
                />
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                )}
              </div>
              <span
                className={`text-xs mt-1 font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'
                  }`}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

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

// Public Route Component
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

// Main App Layout with Bottom Navigation
function AppLayout({ children }) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  const getPageTitle = () => {
    const path = location.pathname
    if (path === '/') return 'Western Mega College'
    if (path === '/about') return 'About Us'
    if (path === '/courses') return 'Courses'
    if (path === '/blog') return 'News & Updates'
    if (path === '/login') return 'Student Login'
    if (path.startsWith('/student')) {
      if (path === '/student/dashboard') return 'Dashboard'
      if (path === '/student/profile') return 'My Profile'
      if (path === '/student/courses') return 'My Courses'
      if (path === '/student/results') return 'My Results'
    }
    return 'Western Mega College'
  }

  const showBackButton = () => {
    return location.pathname !== '/' && !location.pathname.startsWith('/student/dashboard')
  }

  const handleBack = () => {
    if (location.pathname.startsWith('/student')) {
      window.location.href = '/student/dashboard'
    } else {
      window.location.href = '/'
    }
  }

  const closeMobileNav = () => setIsMobileNavOpen(false)

  // Don't show header and bottom nav on login page
  if (location.pathname === '/login') {
    return <div className="min-h-screen bg-gray-50">{children}</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <MobileHeader
        showBack={showBackButton()}
        title={getPageTitle()}
        onBack={handleBack}
        onMenuClick={() => setIsMobileNavOpen(true)}
      />

      {/* Sidebar Navigation */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={closeMobileNav}
        isAuthenticated={isAuthenticated}
      />

      {/* Main Content with Bottom Padding */}
      <main className="pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation isAuthenticated={isAuthenticated} />

      {/* User Welcome Message for Student Pages */}
      {isAuthenticated && user && location.pathname.startsWith('/student') && (
        <div className="fixed top-16 right-4 z-40 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1">
          <p className="text-xs text-blue-700 font-medium">
            Hi, {user.firstName}! 👋
          </p>
        </div>
      )}
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