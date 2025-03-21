import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// Lista de emoções para seleção
const emotions = [
  { id: 'joy', label: 'Alegria', color: 'yellow' },
  { id: 'fear', label: 'Medo', color: 'red' },
  { id: 'sadness', label: 'Tristeza', color: 'blue' },
  { id: 'confusion', label: 'Confusão', color: 'purple' },
  { id: 'peace', label: 'Paz', color: 'green' },
  { id: 'anxiety', label: 'Ansiedade', color: 'orange' },
  { id: 'surprise', label: 'Surpresa', color: 'teal' },
  { id: 'anger', label: 'Raiva', color: 'pink' },
]

// Função para gerar uma cor de gradiente baseada na emoção
const getGradientForEmotion = (emotionId) => {
  const emotionColors = {
    joy: 'from-yellow-300 to-yellow-500',
    fear: 'from-red-400 to-red-600',
    sadness: 'from-blue-400 to-blue-600',
    confusion: 'from-purple-400 to-purple-600',
    peace: 'from-green-400 to-green-600',
    anxiety: 'from-orange-400 to-orange-600',
    surprise: 'from-teal-400 to-teal-600',
    anger: 'from-pink-400 to-pink-600',
  }
  
  return emotionColors[emotionId] || 'from-primary-400 to-secondary-600'
}

const DreamAnalysisPage = () => {
  const { darkMode } = useTheme()
  const [dreamDescription, setDreamDescription] = useState('')
  const [selectedEmotions, setSelectedEmotions] = useState([])
  const [analysisStep, setAnalysisStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [dreamAnalysis, setDreamAnalysis] = useState(null)
  const [remainingAnalyses, setRemainingAnalyses] = useState(2)
  const [showLimitModal, setShowLimitModal] = useState(false)
  
  const toggleEmotion = (emotionId) => {
    if (selectedEmotions.includes(emotionId)) {
      setSelectedEmotions(selectedEmotions.filter(id => id !== emotionId))
    } else {
      setSelectedEmotions([...selectedEmotions, emotionId])
    }
  }
  
  const handleAnalyze = () => {
    if (remainingAnalyses <= 0) {
      setShowLimitModal(true)
      return
    }
    
    setLoading(true)
    
    // Simulando análise do sonho
    setTimeout(() => {
      // Simulação de resultado de análise
      const result = {
        symbols: [
          {
            name: 'Oceano',
            meaning: 'Representa o inconsciente e emoções profundas. A vastidão do oceano sugere que você está conectando-se com aspectos mais amplos da sua mente.'
          },
          {
            name: 'Montanha',
            meaning: 'Simboliza desafios e aspirações. Subir uma montanha no sonho indica que você está enfrentando obstáculos com determinação.'
          },
          {
            name: 'Porta',
            meaning: 'Representa transições e oportunidades. Uma porta em um sonho sugere que você está prestes a descobrir novas possibilidades em sua vida.'
          }
        ],
        interpretation: `Seu sonho revela uma jornada de autodescoberta. Os cenários e elementos presentes estão conectados com um momento de transição em sua vida. A presença ${selectedEmotions.includes('fear') ? 'do medo' : 'da emoção predominante'} indica que você está processando mudanças significativas.

As imagens sugerem que você está buscando equilíbrio entre desafios (representados pela montanha) e suas emoções profundas (simbolizadas pelo oceano). A narrativa do sonho aponta para um desejo de encontrar estabilidade em meio à transformação.`,
        
        futureMessage: 'Este sonho é um reflexo do seu momento atual de vida, mas também contém pistas sobre seu futuro. As decisões que você está considerando agora terão um impacto significativo em sua trajetória. Confie em sua intuição e não tema explorar novos caminhos - seu subconsciente já está lhe guiando nessa direção.',
        
        emotionalTone: selectedEmotions.length > 0 ? selectedEmotions[0] : 'neutral'
      }
      
      setDreamAnalysis(result)
      setLoading(false)
      setAnalysisStep(2)
      setRemainingAnalyses(prev => prev - 1)
    }, 3000)
  }
  
  const resetAnalysis = () => {
    setDreamDescription('')
    setSelectedEmotions([])
    setDreamAnalysis(null)
    setAnalysisStep(1)
  }
  
  // Componente de visualização artística do sonho
  const DreamVisualization = ({ emotionId }) => {
    return (
      <div className="relative rounded-xl overflow-hidden w-full aspect-video mb-6">
        <div className={`absolute inset-0 bg-gradient-to-br ${getGradientForEmotion(emotionId)} opacity-70`}></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center px-6">
            <p className="text-lg font-medium mb-4">Visualização artística do sonho</p>
            <div className="flex justify-center space-x-2">
              {Array(5).fill(0).map((_, i) => (
                <div 
                  key={i} 
                  className="w-3 h-12 rounded-full bg-white/30"
                  style={{ 
                    animation: `waveAnimation ${1 + i * 0.2}s ease-in-out infinite alternate`,
                    animationDelay: `${i * 0.1}s`
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <style jsx="true">{`
          @keyframes waveAnimation {
            0% { height: 12px; }
            100% { height: 36px; }
          }
        `}</style>
      </div>
    )
  }
  
  return (
    <>
      <Navbar />
      
      <div className={`min-h-screen pt-20 pb-20 ${darkMode ? 'bg-gray-950 text-gray-200' : 'bg-gray-50 text-gray-800'}`}>
        <div className="container-custom max-w-4xl mx-auto">
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
              {remainingAnalyses} análises restantes hoje
            </div>
          </div>
          
          <div className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
            <div className="p-4 border-b flex items-center gap-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                </svg>
              </div>
              <div>
                <h2 className="font-heading font-semibold text-white text-lg">Análise de Sonhos</h2>
                <p className="text-white/80 text-sm">Descubra os significados ocultos nos seus sonhos</p>
              </div>
            </div>
            
            <div className="p-6">
              <AnimatePresence mode="wait">
                {analysisStep === 1 ? (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="mb-8">
                      <label htmlFor="dream-description" className={`block text-base font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Descreva seu sonho em detalhes
                      </label>
                      <textarea
                        id="dream-description"
                        value={dreamDescription}
                        onChange={(e) => setDreamDescription(e.target.value)}
                        className={`w-full p-4 rounded-lg border ${
                          darkMode 
                            ? 'bg-gray-800 text-white border-gray-700 focus:border-primary-500' 
                            : 'bg-white text-gray-900 border-gray-300 focus:border-primary-400'
                        } focus:ring-2 focus:ring-primary-500 focus:outline-none transition-colors`}
                        placeholder="Descreva o cenário, personagens, emoções e eventos do seu sonho..."
                        rows={6}
                      />
                      <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Quanto mais detalhes você fornecer, mais precisa será a análise.
                      </p>
                    </div>
                    
                    <div className="mb-8">
                      <label className={`block text-base font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Quais emoções você sentiu durante o sonho?
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {emotions.map((emotion) => (
                          <button
                            key={emotion.id}
                            type="button"
                            onClick={() => toggleEmotion(emotion.id)}
                            className={`py-2 px-3 rounded-lg border text-sm transition-colors
                              ${selectedEmotions.includes(emotion.id)
                                ? `border-${emotion.color}-500 bg-${emotion.color}-50 text-${emotion.color}-700 dark:bg-${emotion.color}-900/30 dark:text-${emotion.color}-400`
                                : darkMode
                                  ? 'border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700'
                                  : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                              }
                            `}
                          >
                            {emotion.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        onClick={handleAnalyze}
                        disabled={!dreamDescription.trim() || loading}
                        className={`${
                          !dreamDescription.trim() || loading
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-opacity-90'
                        } btn-primary`}
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Analisando sonho...
                          </span>
                        ) : 'Analisar Sonho'}
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="mb-8 text-center">
                      <h3 className={`text-2xl font-heading font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Análise do Seu Sonho
                      </h3>
                    </div>
                    
                    <DreamVisualization emotionId={dreamAnalysis?.emotionalTone} />
                    
                    <div className="space-y-8">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
                      >
                        <h4 className={`text-lg font-heading font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Símbolos Principais
                        </h4>
                        <div className="space-y-4">
                          {dreamAnalysis?.symbols.map((symbol, index) => (
                            <div key={index} className="flex gap-3">
                              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white mt-1">
                                <span className="text-xs font-bold">{index + 1}</span>
                              </div>
                              <div>
                                <h5 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{symbol.name}</h5>
                                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{symbol.meaning}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
                      >
                        <h4 className={`text-lg font-heading font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Interpretação
                        </h4>
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} whitespace-pre-line`}>
                          {dreamAnalysis?.interpretation}
                        </p>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="rounded-xl p-6 bg-gradient-to-br from-primary-600 to-secondary-600 text-white"
                      >
                        <h4 className="text-lg font-heading font-semibold mb-4">
                          Mensagem do Futuro
                        </h4>
                        <p className="whitespace-pre-line">
                          {dreamAnalysis?.futureMessage}
                        </p>
                      </motion.div>
                    </div>
                    
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={resetAnalysis}
                        className="btn-primary"
                      >
                        Analisar Outro Sonho
                      </button>
                      
                      <button
                        className={`btn ${darkMode ? 'border border-gray-700 text-white hover:bg-gray-800' : 'border border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                      >
                        Compartilhar Análise
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              As análises são baseadas em psicologia dos sonhos e simbologia arquetípica, mas não substituem aconselhamento profissional.
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
                  Você atingiu seu limite diário de análises de sonhos gratuitas. Faça um upgrade para continuar explorando os significados dos seus sonhos sem limitações.
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