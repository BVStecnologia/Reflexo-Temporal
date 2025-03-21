import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// Simulação de mensagens
const initialMessages = [
  {
    id: 1,
    text: 'Olá! Eu sou você do futuro (2030). O que gostaria de me perguntar hoje?',
    sender: 'future',
    timestamp: new Date(Date.now() - 1000 * 60 * 2) // 2 minutos atrás
  }
]

const ConversationPage = () => {
  const { darkMode } = useTheme()
  const { user } = useAuth()
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [remainingConversations, setRemainingConversations] = useState(3)
  const [showLimitModal, setShowLimitModal] = useState(false)
  
  const messagesEndRef = useRef(null)
  
  // Scroll para o final quando novas mensagens são adicionadas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  const sendMessage = () => {
    if (!newMessage.trim()) return
    
    // Verificar limite de mensagens
    if (remainingConversations <= 0) {
      setShowLimitModal(true)
      return
    }
    
    // Adicionar mensagem do usuário
    const userMessage = {
      id: messages.length + 1,
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setNewMessage('')
    
    // Simular "digitando..."
    setIsTyping(true)
    
    // Timer para simular a resposta
    setTimeout(() => {
      // Gerar resposta do futuro
      const futureResponse = {
        id: messages.length + 2,
        text: generateFutureResponse(newMessage),
        sender: 'future',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, futureResponse])
      setIsTyping(false)
      
      // Decrementar contagem restante
      setRemainingConversations(prev => prev - 1)
    }, 2000 + Math.random() * 2000) // Entre 2 e 4 segundos
  }
  
  // Função para resposta simulada do "eu futuro"
  const generateFutureResponse = (question) => {
    const responses = [
      "Essa decisão que você está considerando agora vai abrir portas inesperadas para você. Confie em sua intuição.",
      "Lembre-se de valorizar mais o autocuidado. Nos próximos anos, sua saúde mental será seu maior ativo.",
      "Aquela oportunidade que parece insignificante hoje será crucial para sua trajetória. Dê a ela a atenção que merece.",
      "Você está preocupado com o caminho errado. O que realmente importará daqui a 5 anos é algo que você ainda nem considerou.",
      "As conexões que você está fazendo agora serão fundamentais no futuro. Cultive essas relações.",
      "Aquela ideia que você tem medo de compartilhar? É exatamente ela que trará sua maior realização profissional.",
      "O conhecimento que você está adquirindo agora, mesmo que pareça sem propósito imediato, será a base do seu sucesso futuro.",
      "Aprenda a dizer não mais frequentemente. Seu tempo e energia são seus recursos mais valiosos.",
      "Aquela dificuldade que está enfrentando vai moldar sua resiliência de uma forma que você nem imagina.",
      "Confie mais em si mesmo. A autoconfiança que você desenvolverá nos próximos anos transformará sua vida."
    ]
    
    return responses[Math.floor(Math.random() * responses.length)]
  }
  
  const formatTime = (date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }
  
  return (
    <>
      <Navbar />
      
      <div className={`min-h-screen pt-20 ${darkMode ? 'bg-gray-950 text-gray-200' : 'bg-gray-50 text-gray-800'}`}>
        <div className="container-custom py-4 max-w-4xl mx-auto">
          <div className="mb-4 flex justify-between items-center">
            <Link 
              to="/dashboard" 
              className={`flex items-center gap-2 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
              Voltar ao Dashboard
            </Link>
            
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
              {remainingConversations} conversas restantes hoje
            </div>
          </div>
          
          <div className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg mb-4`}>
            <div className="p-4 border-b flex items-center gap-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
              <div>
                <h2 className="font-heading font-semibold text-white text-lg">Conversa com Seu Futuro</h2>
                <p className="text-white/80 text-sm">Você em 2025 conversando com você em 2030</p>
              </div>
            </div>
            
            <div className="p-6 h-[calc(100vh-260px)] flex flex-col">
              <div className="flex-grow overflow-y-auto pr-2">
                <div className="space-y-6">
                  <AnimatePresence>
                    {messages.map(message => (
                      <motion.div 
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-start gap-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            message.sender === 'user' 
                              ? darkMode ? 'bg-primary-700' : 'bg-primary-100' 
                              : 'bg-gradient-to-br from-secondary-500 to-primary-500'
                          }`}>
                            {message.sender === 'user' ? (
                              <span className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-primary-700'}`}>
                                {user?.email?.[0].toUpperCase() || 'U'}
                              </span>
                            ) : (
                              <span className="text-xs font-bold text-white">F</span>
                            )}
                          </div>
                          
                          <div>
                            <div className={`rounded-2xl p-3 mb-1 ${
                              message.sender === 'user' 
                                ? darkMode ? 'bg-primary-700 text-white' : 'bg-primary-100 text-primary-800'
                                : darkMode ? 'bg-secondary-800 text-white' : 'bg-secondary-100 text-secondary-800'
                            }`}>
                              <p>{message.text}</p>
                            </div>
                            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} ${message.sender === 'user' ? 'text-right' : ''}`}>
                              {message.sender === 'user' ? 'Você (2025)' : 'Você (2030)'} · {formatTime(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    
                    {isTyping && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex justify-start"
                      >
                        <div className="flex items-start gap-3 max-w-[80%]">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-secondary-500 to-primary-500 flex items-center justify-center">
                            <span className="text-xs font-bold text-white">F</span>
                          </div>
                          
                          <div>
                            <div className={`rounded-2xl p-3 mb-1 ${darkMode ? 'bg-secondary-800 text-white' : 'bg-secondary-100 text-secondary-800'}`}>
                              <div className="flex gap-1">
                                <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                                <span className="w-2 h-2 rounded-full bg-current animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                                <span className="w-2 h-2 rounded-full bg-current animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                              </div>
                            </div>
                            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              Você (2030) está digitando...
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>
              </div>
              
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Digite sua mensagem..."
                  className={`flex-grow px-4 py-3 rounded-lg focus:outline-none focus:ring-2 ${
                    darkMode 
                      ? 'bg-gray-800 text-white border-gray-700 focus:ring-primary-500' 
                      : 'bg-gray-100 text-gray-900 border-gray-200 focus:ring-primary-400'
                  }`}
                  disabled={isTyping}
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || isTyping}
                  className={`p-3 rounded-lg ${
                    !newMessage.trim() || isTyping
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-opacity-90'
                  } bg-gradient-to-r from-primary-600 to-secondary-600 text-white`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              As respostas são geradas por IA e têm caráter especulativo. Não considere-as como previsões reais do futuro.
            </p>
          </div>
        </div>
      </div>
      
      {/* Modal de Limite Atingido */}
      <AnimatePresence>
        {showLimitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`max-w-md w-full rounded-2xl p-6 ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-xl`}
            >
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                  </svg>
                </div>
                <h3 className={`text-xl font-heading font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Limite de Conversas Atingido
                </h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
                  Você atingiu seu limite diário de conversas gratuitas. Faça um upgrade para continuar conversando com seu futuro sem limitações.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/subscription" className="btn-primary">
                    Ver Planos Premium
                  </Link>
                  <button
                    onClick={() => setShowLimitModal(false)}
                    className={`btn border ${darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                  >
                    Voltar à Conversa
                  </button>
                </div>
                <div className="mt-6">
                  <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Oferecendo 50% de desconto no seu primeiro mês!
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Footer />
    </>
  )
}

export default ConversationPage