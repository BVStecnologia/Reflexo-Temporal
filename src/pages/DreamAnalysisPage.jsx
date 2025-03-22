import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import { createDream, updateDream, incrementDailyCounter, createShareCard } from '../services/supabase'
import { analyzeDream } from '../services/anthropic'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const emotions = [
  { id: 'joy', label: 'Alegria', color: 'bg-yellow-500' },
  { id: 'fear', label: 'Medo', color: 'bg-purple-500' },
  { id: 'sadness', label: 'Tristeza', color: 'bg-blue-500' },
  { id: 'anger', label: 'Raiva', color: 'bg-red-500' },
  { id: 'surprise', label: 'Surpresa', color: 'bg-green-500' },
  { id: 'confusion', label: 'Confusão', color: 'bg-amber-500' },
  { id: 'peace', label: 'Paz', color: 'bg-teal-500' },
  { id: 'anxiety', label: 'Ansiedade', color: 'bg-orange-500' },
  { id: 'love', label: 'Amor', color: 'bg-pink-500' }
]

const DreamAnalysisPage = () => {
  const { darkMode } = useTheme()
  const { user, profile, checkDailyLimit } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedEmotions, setSelectedEmotions] = useState([])
  const [dreamId, setDreamId] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [shareSuccess, setShareSuccess] = useState(false)
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [showLimitModal, setShowLimitModal] = useState(false)
  const [limit, setLimit] = useState({ allowed: false, remaining: 0 })
  
  const navigate = useNavigate()
  
  // Buscar limite diário
  useEffect(() => {
    if (profile) {
      const limitInfo = checkDailyLimit('dream')
      setLimit(limitInfo)
    }
  }, [profile, checkDailyLimit])
  
  // Verificar autenticação
  useEffect(() => {
    if (!user && !isAnalyzing) {
      navigate('/login')
    }
  }, [user, isAnalyzing, navigate])
  
  const handleEmotionToggle = (emotionId) => {
    if (selectedEmotions.includes(emotionId)) {
      setSelectedEmotions(selectedEmotions.filter(id => id !== emotionId))
    } else {
      setSelectedEmotions([...selectedEmotions, emotionId])
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // Validação
    if (!title.trim()) {
      setError('Por favor, adicione um título para o seu sonho')
      return
    }
    
    if (!description.trim() || description.length < 20) {
      setError('Por favor, descreva seu sonho com mais detalhes (mínimo 20 caracteres)')
      return
    }
    
    if (selectedEmotions.length === 0) {
      setError('Por favor, selecione pelo menos uma emoção')
      return
    }
    
    // Verificar limite
    if (!limit.allowed) {
      setShowLimitModal(true)
      return
    }
    
    try {
      setIsAnalyzing(true)
      
      // Construir os dados do sonho
      const dreamData = {
        title,
        description,
        emotions: selectedEmotions.map(id => {
          const emotion = emotions.find(e => e.id === id)
          return emotion ? emotion.label : id
        })
      }
      
      // Criar o registro do sonho no banco de dados
      const { data: dreamResult, error: dreamError } = await createDream(user.id, dreamData)
      
      if (dreamError) {
        throw new Error(dreamError.message || 'Erro ao salvar o sonho')
      }
      
      // Guardar o ID do sonho
      const newDreamId = dreamResult[0].id
      setDreamId(newDreamId)
      
      // Incrementar contador diário
      await incrementDailyCounter(user.id, 'dream')
      
      // Atualizar informações de limite
      const newLimitInfo = checkDailyLimit('dream')
      setLimit(newLimitInfo)
      
      // Avançar para o próximo passo
      setStep(2)
      
      // Dados do usuário para contextualização
      const userData = {
        name: profile?.name || user.email.split('@')[0],
        interests: profile?.interests || []
      }
      
      // Analisar o sonho usando a API Claude via Edge Function
      try {
        // Chamar a API para analisar o sonho
        const { analysis: dreamAnalysis, error: analysisError } = await analyzeDream(dreamData, userData)
        
        if (analysisError) {
          console.error('Erro na análise do sonho:', analysisError)
          throw new Error(analysisError)
        }
        
        // Atualizar o sonho no banco de dados com a análise recebida
        // Garantir que a análise seja armazenada como JSONB
        const updatedDreamData = {
          analysis: typeof dreamAnalysis === 'string' 
            ? JSON.parse(dreamAnalysis) 
            : dreamAnalysis
        }
        
        console.log('Salvando análise no banco de dados:', updatedDreamData);
        
        // Salvar a análise no banco de dados
        const { error: updateError } = await updateDream(newDreamId, updatedDreamData)
        
        if (updateError) {
          console.error('Erro ao salvar análise:', updateError)
        }
        
        setAnalysis(dreamAnalysis)
      } catch (error) {
        console.error('Falha na análise do sonho:', error)
        
        // Fallback em caso de erro - usar uma análise simplificada
        const fallbackAnalysis = {
          symbols: [
            {
              name: "Símbolo Principal",
              meaning: "Este símbolo parece representar um aspecto importante do seu subconsciente."
            }
          ],
          interpretation: "Não foi possível realizar uma análise completa do seu sonho neste momento. Por favor, tente novamente mais tarde.",
          message_from_future: "Toda situação, mesmo as difíceis, trazem aprendizados valiosos.",
          reflection_questions: [
            "O que este sonho pode estar tentando me dizer?",
            "Que padrões deste sonho já apareceram em outras áreas da minha vida?"
          ]
        }
        
        setAnalysis(fallbackAnalysis)
      } finally {
        setIsAnalyzing(false)
      }
      
    } catch (error) {
      console.error('Erro ao analisar sonho:', error)
      setError(error.message || 'Ocorreu um erro ao analisar o sonho')
      setIsAnalyzing(false)
    }
  }
  
  return (
    <>
      <Navbar />
      
      <div className={`min-h-screen pt-20 ${darkMode ? 'bg-gray-950 text-gray-200' : 'bg-gray-50 text-gray-800'}`}>
        <div className="container-custom py-8 max-w-4xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
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
              {limit.remaining} análises restantes hoje
            </div>
          </div>
          
          <div className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg mb-8`}>
            <div className="p-4 border-b flex items-center gap-4 bg-gradient-to-r from-secondary-600 to-primary-600 text-white">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                </svg>
              </div>
              <div>
                <h2 className="font-heading font-semibold text-white text-lg">Análise de Sonhos</h2>
                <p className="text-white/80 text-sm">Descubra os significados e mensagens ocultas em seus sonhos</p>
              </div>
            </div>
            
            <div className="p-6">
              {error && (
                <div className="mb-6 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="title" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Título do Sonho
                        </label>
                        <input
                          id="title"
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}`}
                          placeholder="Ex: Voando sobre o oceano"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="description" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Descrição Detalhada
                        </label>
                        <textarea
                          id="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}`}
                          placeholder="Descreva seu sonho com o máximo de detalhes que conseguir lembrar..."
                          rows={6}
                          required
                        />
                        <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Quanto mais detalhes você incluir, mais precisa será a análise.
                        </p>
                      </div>
                      
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Emoções Sentidas Durante o Sonho
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {emotions.map((emotion) => (
                            <button
                              key={emotion.id}
                              type="button"
                              onClick={() => handleEmotionToggle(emotion.id)}
                              className={`px-3 py-2 rounded-full text-sm font-medium transition-colors
                                ${selectedEmotions.includes(emotion.id)
                                  ? `${emotion.color} text-white`
                                  : darkMode
                                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }
                              `}
                            >
                              {emotion.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <button
                          type="submit"
                          className="w-full btn-secondary"
                        >
                          Analisar Sonho
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
                
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center py-8"
                  >
                    {isAnalyzing ? (
                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-6 relative">
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 animate-spin opacity-25"></div>
                          <div className="absolute inset-2 rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 animate-pulse"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-white">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                            </svg>
                          </div>
                        </div>
                        <h3 className={`text-xl font-heading font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Analisando Seu Sonho...
                        </h3>
                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Estamos decifrando os símbolos e mensagens do seu subconsciente.
                        </p>
                      </div>
                    ) : analysis ? (
                      <div className="w-full">
                        <h3 className={`text-xl font-heading font-bold mb-6 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Análise do Sonho: {title}
                        </h3>
                        
                        <div className="space-y-8">
                          <div>
                            <h4 className={`text-lg font-heading font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              Símbolos Principais
                            </h4>
                            <div className="space-y-4">
                              {analysis.symbols.map((symbol, index) => (
                                <div 
                                  key={index}
                                  className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
                                >
                                  <h5 className={`font-medium mb-1 ${darkMode ? 'text-secondary-400' : 'text-secondary-600'}`}>
                                    {symbol.name}
                                  </h5>
                                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {symbol.meaning}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className={`text-lg font-heading font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              Interpretação
                            </h4>
                            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {analysis.interpretation}
                              </p>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className={`text-lg font-heading font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              Mensagem do Futuro
                            </h4>
                            <div className={`p-4 rounded-lg bg-gradient-to-r from-primary-600/20 to-secondary-600/20 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                              <div className="flex items-center">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-secondary-500 to-primary-500 flex items-center justify-center mr-3">
                                  <span className="text-xs font-bold text-white">F</span>
                                </div>
                                <p className="italic">
                                  "{analysis.message_from_future}"
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className={`text-lg font-heading font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              Perguntas para Reflexão
                            </h4>
                            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                              <ul className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {analysis.reflection_questions.map((question, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="mr-2">•</span>
                                    {question}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between mt-8">
                          <button
                            onClick={() => setStep(1)}
                            className={`px-4 py-2 rounded-lg font-medium ${
                              darkMode
                                ? 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            Novo Sonho
                          </button>
                          
                          <button
                            onClick={async () => {
                              if (!dreamId) return;
                              
                              try {
                                setIsSharing(true);
                                // Criar compartilhamento
                                const { data, error } = await createShareCard(
                                  user.id,
                                  'dream',
                                  dreamId
                                );
                                
                                if (error) throw error;
                                
                                setShareSuccess(true);
                                // Esconder mensagem de sucesso após 3 segundos
                                setTimeout(() => setShareSuccess(false), 3000);
                              } catch (err) {
                                console.error('Erro ao compartilhar sonho:', err);
                                setError('Erro ao compartilhar sonho. Tente novamente mais tarde.');
                              } finally {
                                setIsSharing(false);
                              }
                            }}
                            disabled={isSharing}
                            className="btn-outline flex items-center gap-2"
                          >
                            {isSharing ? (
                              <>
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1"></div>
                                Compartilhando...
                              </>
                            ) : shareSuccess ? (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Compartilhado!
                              </>
                            ) : (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935-2.186 2.25 2.25 0 0 0-3.935-2.186" />
                                </svg>
                                Compartilhar
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Ocorreu um erro ao analisar o sonho. Por favor, tente novamente.
                        </p>
                        <button
                          onClick={() => setStep(1)}
                          className="mt-4 btn-primary"
                        >
                          Voltar e Tentar Novamente
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <div className="text-center">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              As análises são baseadas em simbolismo e psicologia dos sonhos, mas não substituem aconselhamento profissional.
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
                  Limite de Análises Atingido
                </h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
                  Você atingiu seu limite diário de análises de sonhos gratuitas. Faça um upgrade para continuar decifrando seus sonhos sem limitações.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/subscription" className="btn-primary">
                    Ver Planos Premium
                  </Link>
                  <button
                    onClick={() => setShowLimitModal(false)}
                    className={`btn border ${darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                  >
                    Voltar
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

export default DreamAnalysisPage