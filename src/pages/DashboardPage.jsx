import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const DashboardPage = () => {
  const { user } = useAuth()
  const { darkMode } = useTheme()
  const [conversations, setConversations] = useState([])
  const [dreams, setDreams] = useState([])
  const [conversationsRemaining, setConversationsRemaining] = useState(3)
  const [dreamsRemaining, setDreamsRemaining] = useState(2)
  const [loading, setLoading] = useState(true)
  
  // Simulando carregamento de dados
  useEffect(() => {
    const timer = setTimeout(() => {
      // Dados simulados
      setConversations([
        {
          id: 1,
          date: new Date(2025, 2, 15),
          topic: 'Carreira e propósito de vida',
          previewMessage: 'Você encontrará um novo caminho que une sua paixão por tecnologia e seu desejo de ajudar as pessoas.'
        },
      ])
      
      setDreams([
        {
          id: 1,
          date: new Date(2025, 2, 14),
          title: 'Sonho com oceano e montanhas',
          emotion: 'Calma',
          interpretation: 'Você está buscando equilíbrio entre desafios (montanhas) e emoções (oceano).'
        },
      ])
      
      setLoading(false)
    }, 1500)
    
    return () => clearTimeout(timer)
  }, [])
  
  // Funções para formatação de data
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date)
  }
  
  const formatTimeAgo = (date) => {
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 24) {
      return `${diffInHours} hora${diffInHours !== 1 ? 's' : ''} atrás`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays} dia${diffInDays !== 1 ? 's' : ''} atrás`
    }
  }
  
  // Animação para os itens da dashboard
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }
  
  return (
    <>
      <Navbar />
      
      <div className={`min-h-screen pt-24 pb-20 ${darkMode ? 'bg-gray-950 text-gray-200' : 'bg-gray-50 text-gray-800'}`}>
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="md:w-64 flex-shrink-0">
              <motion.div 
                className={`rounded-xl p-6 ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-md`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center text-white text-xl font-bold">
                    {user?.email?.[0].toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h3 className={`font-semibold text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {user?.email?.split('@')[0] || 'Usuário'}
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Plano Gratuito
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-6">
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <p className="text-sm font-medium mb-1">Conversas Restantes</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-semibold">{conversationsRemaining}</span>
                      <Link to="/subscription" className={`text-xs underline ${darkMode ? 'text-primary-400' : 'text-primary-600'}`}>
                        Aumentar Limite
                      </Link>
                    </div>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <p className="text-sm font-medium mb-1">Análises Restantes</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-semibold">{dreamsRemaining}</span>
                      <Link to="/subscription" className={`text-xs underline ${darkMode ? 'text-primary-400' : 'text-primary-600'}`}>
                        Aumentar Limite
                      </Link>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Link 
                    to="/dashboard"
                    className={`flex items-center gap-3 p-3 rounded-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-primary-100 text-primary-800'} font-medium`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                    Dashboard
                  </Link>
                  
                  <Link 
                    to="/conversation"
                    className={`flex items-center gap-3 p-3 rounded-lg ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'} transition-colors`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                    </svg>
                    Nova Conversa
                  </Link>
                  
                  <Link 
                    to="/dream-analysis"
                    className={`flex items-center gap-3 p-3 rounded-lg ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'} transition-colors`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                    </svg>
                    Analisar Sonho
                  </Link>
                  
                  <Link 
                    to="/subscription"
                    className={`flex items-center gap-3 p-3 rounded-lg ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'} transition-colors`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                    </svg>
                    Planos Premium
                  </Link>
                </div>
              </motion.div>
            </div>
            
            {/* Main Content */}
            <div className="flex-grow">
              <motion.h1 
                className={`text-2xl font-heading font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                Dashboard
              </motion.h1>
              
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map(i => (
                    <div 
                      key={i}
                      className={`rounded-xl p-6 ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-md animate-pulse`}
                    >
                      <div className="flex flex-col gap-4">
                        <div className={`h-6 w-1/2 rounded ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
                        <div className={`h-4 w-3/4 rounded ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
                        <div className={`h-4 w-full rounded ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
                        <div className={`h-4 w-2/3 rounded ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className={`text-xl font-heading font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Ferramentas
                      </h2>
                    </div>
                    
                    <motion.div
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.div variants={itemVariants}>
                        <Link to="/conversation" className="block h-full">
                          <div className={`rounded-xl p-6 h-full ${darkMode ? 'bg-gray-900 hover:bg-gray-900/80' : 'bg-white hover:bg-gray-50'} shadow-md border-2 border-primary-500 transition-colors duration-300`}>
                            <div className="mb-4 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                              </svg>
                            </div>
                            <h3 className={`text-xl font-heading font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Iniciar Conversa</h3>
                            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Fale com a versão de você de 2030 e receba insights valiosos sobre seu futuro.</p>
                            <div className="mt-4">
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                                {conversationsRemaining} conversas restantes hoje
                              </span>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <Link to="/dream-analysis" className="block h-full">
                          <div className={`rounded-xl p-6 h-full ${darkMode ? 'bg-gray-900 hover:bg-gray-900/80' : 'bg-white hover:bg-gray-50'} shadow-md border-2 border-secondary-500 transition-colors duration-300`}>
                            <div className="mb-4 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-secondary-500 to-primary-500 text-white">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                              </svg>
                            </div>
                            <h3 className={`text-xl font-heading font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Analisar Sonho</h3>
                            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Descreva seu sonho e receba uma análise detalhada dos símbolos e mensagens ocultas.</p>
                            <div className="mt-4">
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                                {dreamsRemaining} análises restantes hoje
                              </span>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    </motion.div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className={`text-xl font-heading font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Atividades Recentes
                      </h2>
                      {conversations.length > 0 || dreams.length > 0 ? (
                        <Link to="/history" className={`text-sm ${darkMode ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-700'}`}>
                          Ver tudo
                        </Link>
                      ) : null}
                    </div>
                    
                    <motion.div
                      className="space-y-4"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {conversations.length === 0 && dreams.length === 0 ? (
                        <motion.div
                          variants={itemVariants}
                          className={`rounded-xl p-6 ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-md text-center`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-gray-700' : 'text-gray-300'}`}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                          </svg>
                          <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Nenhuma atividade recente</h3>
                          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                            Inicie uma conversa ou análise de sonho para ver suas atividades aqui.
                          </p>
                          <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/conversation" className="btn-primary">
                              Iniciar Conversa
                            </Link>
                            <Link to="/dream-analysis" className="btn-outline">
                              Analisar Sonho
                            </Link>
                          </div>
                        </motion.div>
                      ) : (
                        <>
                          {conversations.map(conversation => (
                            <motion.div
                              key={conversation.id}
                              variants={itemVariants}
                              className={`rounded-xl p-5 ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-md`}
                            >
                              <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                                  </svg>
                                </div>
                                <div className="flex-grow">
                                  <div className="flex justify-between items-start">
                                    <h3 className={`font-heading font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                      {conversation.topic}
                                    </h3>
                                    <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                      {formatTimeAgo(conversation.date)}
                                    </span>
                                  </div>
                                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {conversation.previewMessage}
                                  </p>
                                  <div className="mt-3 flex justify-between items-center">
                                    <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                      {formatDate(conversation.date)}
                                    </span>
                                    <Link 
                                      to={`/conversation/${conversation.id}`}
                                      className={`text-sm font-medium ${darkMode ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-700'}`}
                                    >
                                      Continuar
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                          
                          {dreams.map(dream => (
                            <motion.div
                              key={dream.id}
                              variants={itemVariants}
                              className={`rounded-xl p-5 ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-md`}
                            >
                              <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-secondary-500 to-primary-500 flex items-center justify-center text-white">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                                  </svg>
                                </div>
                                <div className="flex-grow">
                                  <div className="flex justify-between items-start">
                                    <h3 className={`font-heading font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                      {dream.title}
                                    </h3>
                                    <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                      {formatTimeAgo(dream.date)}
                                    </span>
                                  </div>
                                  <div className="mt-1 flex items-center">
                                    <span className={`text-sm mr-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Emoção:</span>
                                    <span className={`text-sm px-2 py-0.5 rounded-full ${darkMode ? 'bg-secondary-900/50 text-secondary-300' : 'bg-secondary-100 text-secondary-700'}`}>
                                      {dream.emotion}
                                    </span>
                                  </div>
                                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {dream.interpretation}
                                  </p>
                                  <div className="mt-3 flex justify-between items-center">
                                    <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                      {formatDate(dream.date)}
                                    </span>
                                    <Link 
                                      to={`/dream-analysis/${dream.id}`}
                                      className={`text-sm font-medium ${darkMode ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-700'}`}
                                    >
                                      Ver Detalhes
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </>
                      )}
                    </motion.div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  )
}

export default DashboardPage