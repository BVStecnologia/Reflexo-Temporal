import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import WaveBackground from '../components/WaveBackground'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetSuccess, setResetSuccess] = useState(false)
  
  const { login, resetPassword } = useAuth()
  const { darkMode } = useTheme()
  const navigate = useNavigate()
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      const { error } = await login(email, password)
      
      if (error) throw new Error(error.message)
      
      navigate('/dashboard')
    } catch (err) {
      setError('Email ou senha inválidos. Por favor, tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      const { error } = await resetPassword(resetEmail)
      
      if (error) throw new Error(error.message)
      
      setResetSuccess(true)
    } catch (err) {
      setError('Não foi possível enviar o email de recuperação. Verifique o endereço e tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <>
      <Navbar />
      
      <WaveBackground>
        <div className="min-h-screen pt-24 pb-20">
          <div className="container-custom max-w-md mx-auto">
            <motion.div 
              className={`rounded-2xl shadow-lg overflow-hidden ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-8">
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 text-white font-bold mb-4">
                    <span className="font-heading text-2xl">RT</span>
                  </div>
                  <h1 className={`text-2xl font-heading font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {showForgotPassword ? 'Recuperar Senha' : 'Bem-vindo de volta'}
                  </h1>
                  <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {showForgotPassword 
                      ? 'Enviaremos um link para redefinir sua senha'
                      : 'Continue sua jornada de autoconhecimento'
                    }
                  </p>
                </div>
                
                {error && (
                  <div className="mb-6 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                
                {resetSuccess && (
                  <div className="mb-6 p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm">
                    Um email foi enviado com instruções para redefinir sua senha.
                  </div>
                )}
                
                {showForgotPassword ? (
                  <form onSubmit={handleResetPassword} className="space-y-6">
                    <div>
                      <label htmlFor="reset-email" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Email
                      </label>
                      <input
                        id="reset-email"
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}`}
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                    
                    <div>
                      <button
                        type="submit"
                        className={`w-full btn-primary ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                      </button>
                    </div>
                    
                    <div className="text-center mt-4">
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(false)}
                        className={`text-sm ${darkMode ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-700'}`}
                      >
                        Voltar para o login
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="email" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}`}
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="password" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Senha
                      </label>
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}`}
                        placeholder="••••••••"
                        required
                        minLength={6}
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className={`text-sm ${darkMode ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-700'}`}
                      >
                        Esqueceu a senha?
                      </button>
                    </div>
                    
                    <div>
                      <button
                        type="submit"
                        className={`w-full btn-primary ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Entrando...' : 'Entrar'}
                      </button>
                    </div>
                  </form>
                )}
                
                <div className={`mt-8 pt-6 text-center border-t ${darkMode ? 'border-gray-800 text-gray-400' : 'border-gray-200 text-gray-600'}`}>
                  <p>
                    Não tem uma conta?{' '}
                    <Link to="/register" className={`font-medium ${darkMode ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-700'}`}>
                      Registre-se agora
                    </Link>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </WaveBackground>
      
      <Footer />
    </>
  )
}

export default LoginPage