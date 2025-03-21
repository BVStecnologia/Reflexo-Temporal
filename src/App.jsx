import { Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'

// Pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ConversationPage from './pages/ConversationPage'
import DreamAnalysisPage from './pages/DreamAnalysisPage'
import SubscriptionPage from './pages/SubscriptionPage'
import NotFoundPage from './pages/NotFoundPage'

// Context
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // Simulando carregamento inicial
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 to-secondary-600">
        <div className="text-white text-2xl font-heading animate-pulse">
          <span className="text-5xl">RT</span>
          <span className="ml-4">Carregando...</span>
        </div>
      </div>
    )
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/conversation" element={<ConversationPage />} />
          <Route path="/dream-analysis" element={<DreamAnalysisPage />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
