import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import WaveBackground from '../components/WaveBackground'
import GoogleIcon from '../assets/google-icon.svg'

const interestOptions = [
  { id: 'career', label: 'Carreira' },
  { id: 'relationships', label: 'Relacionamentos' },
  { id: 'health', label: 'Saúde' },
  { id: 'spirituality', label: 'Espiritualidade' },
  { id: 'finances', label: 'Finanças' },
  { id: 'creativity', label: 'Criatividade' },
]

const RegisterPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [name, setName] = useState('')
  const [birthdate, setBirthdate] = useState('')
  const [interests, setInterests] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [successMessage, setSuccessMessage] = useState('')
  
  const { signup, loginWithGoogle } = useAuth()
  const { darkMode } = useTheme()
  const navigate = useNavigate()
  
  const handleInterestToggle = (interestId) => {
    if (interests.includes(interestId)) {
      setInterests(interests.filter(id => id !== interestId))
    } else {
      setInterests([...interests, interestId])
    }
  }
  
  const validateStep1 = () => {
    if (!email || !password || !passwordConfirm) {
      setError('Todos os campos são obrigatórios')
      return false
    }
    
    if (password !== passwordConfirm) {
      setError('As senhas não correspondem')
      return false
    }
    
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return false
    }
    
    setError('')
    return true
  }
  
  const handleNextStep = () => {
    if (validateStep1()) {
      setCurrentStep(2)
    }
  }
  
  const handleGoogleLogin = async () => {
    setError('')
    setIsLoading(true)
    
    try {
      const { error } = await loginWithGoogle()
      
      if (error) throw new Error(error.message)
      
      // Não precisamos navegar aqui, o Supabase vai redirecionar para o Google
    } catch (err) {
      setError('Erro ao conectar com o Google. Por favor, tente novamente.')
      setIsLoading(false)
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')
    
    if (!name) {
      setError('O nome é obrigatório')
      return
    }
    
    if (interests.length === 0) {
      setError('Selecione pelo menos um interesse')
      return
    }
    
    setIsLoading(true)
    
    try {
      // Calcular idade baseada na data de nascimento
      let age = null
      if (birthdate) {
        const birthDate = new Date(birthdate)
        const today = new Date()
        age = today.getFullYear() - birthDate.getFullYear()
        const m = today.getMonth() - birthDate.getMonth()
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--
        }
      }
      
      // Dados de perfil para o Supabase
      const metadata = {
        name,
        birthdate,
        age,
        interests,
        // Dados iniciais para o perfil
        aspirations: [],
        daily_conversation_count: 0,
        daily_dream_count: 0,
        last_reset_date: new Date().toISOString().split('T')[0],
      }
      
      const { data, error } = await signup(email, password, metadata)
      
      if (error) {
        throw new Error(error.message || 'Erro no cadastro')
      }
      
      if (data?.user) {
        setSuccessMessage('Conta criada com sucesso! Redirecionando...')
        
        // Redirecionar após timeout curto
        setTimeout(() => {
          navigate('/dashboard')
        }, 1500)
      }
    } catch (err) {
      console.error('Erro no cadastro:', err)
      setError(err.message || 'Não foi possível criar sua conta. Verifique os dados e tente novamente.')
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
                    Crie sua conta
                  </h1>
                  <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Inicie sua jornada de autoconhecimento
                  </p>
                </div>

                <div className="mb-8">
                  <div className="flex items-center justify-between">
                    <div className={`flex-1 h-1 ${currentStep >= 1 ? 'bg-primary-500' : darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${currentStep >= 1 ? 'bg-primary-500' : darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      1
                    </div>
                    <div className={`flex-1 h-1 ${currentStep >= 2 ? 'bg-primary-500' : darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${currentStep >= 2 ? 'bg-primary-500' : darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      2
                    </div>
                    <div className={`flex-1 h-1 ${currentStep >= 2 ? 'bg-primary-500' : darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-center">
                    <div className={`w-1/3 ${currentStep === 1 ? darkMode ? 'text-white' : 'text-gray-900' : darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      Conta
                    </div>
                    <div className={`w-1/3 ${currentStep === 2 ? darkMode ? 'text-white' : 'text-gray-900' : darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      Perfil
                    </div>
                  </div>
                </div>
                
                {error && (
                  <div className="mb-6 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {successMessage && (
                  <div className="mb-6 p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm">
                    {successMessage}
                  </div>
                )}
                
                {currentStep === 1 ? (
                  <div className="space-y-6">
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
                    
                    <div>
                      <label htmlFor="passwordConfirm" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Confirmar Senha
                      </label>
                      <input
                        id="passwordConfirm"
                        type="password"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}`}
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    
                    <div>
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="w-full btn-primary"
                      >
                        Próximo
                      </button>
                    </div>
                    
                    <div className="relative my-4">
                      <div className={`absolute inset-0 flex items-center ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                        <div className={`w-full border-t ${darkMode ? 'border-gray-800' : 'border-gray-300'}`}></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className={`px-2 ${darkMode ? 'bg-gray-900 text-gray-400' : 'bg-white text-gray-500'}`}>
                          ou continue com
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className={`w-full flex items-center justify-center gap-2 py-2 px-4 border rounded-lg font-medium transition-colors ${
                          darkMode 
                            ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700' 
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        disabled={isLoading}
                      >
                        <img src={GoogleIcon} alt="Google" className="w-5 h-5" />
                        <span>Google</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Nome Completo
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}`}
                        placeholder="Seu nome completo"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="birthdate" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Data de Nascimento
                      </label>
                      <input
                        id="birthdate"
                        type="date"
                        value={birthdate}
                        onChange={(e) => setBirthdate(e.target.value)}
                        className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}`}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Seus Interesses
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {interestOptions.map((interest) => (
                          <button
                            key={interest.id}
                            type="button"
                            onClick={() => handleInterestToggle(interest.id)}
                            className={`px-4 py-2 rounded-lg border text-sm transition-colors
                              ${interests.includes(interest.id)
                                ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                                : darkMode
                                  ? 'border-gray-700 bg-gray-800 text-gray-300'
                                  : 'border-gray-200 bg-gray-50 text-gray-700'
                              }
                            `}
                          >
                            {interest.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className={`flex-1 py-2.5 px-5 rounded-lg border font-medium transition-colors
                          ${darkMode
                            ? 'border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700'
                            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                          }
                        `}
                      >
                        Voltar
                      </button>
                      
                      <button
                        type="submit"
                        className={`flex-1 btn-primary ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Registrando...' : 'Registrar'}
                      </button>
                    </div>
                  </form>
                )}
                
                <div className={`mt-8 pt-6 text-center border-t ${darkMode ? 'border-gray-800 text-gray-400' : 'border-gray-200 text-gray-600'}`}>
                  <p>
                    Já tem uma conta?{' '}
                    <Link to="/login" className={`font-medium ${darkMode ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-700'}`}>
                      Faça login
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

export default RegisterPage