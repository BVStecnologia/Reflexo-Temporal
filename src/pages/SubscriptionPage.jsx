import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const SubscriptionPage = () => {
  const { darkMode } = useTheme()
  const { user } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState(null)
  
  const plans = [
    {
      id: 'vislumbre',
      name: 'Vislumbre',
      price: '$2.99',
      features: [
        '10 conversas com seu futuro',
        '5 análises de sonhos',
        'Acesso por 30 dias',
        'Compartilhamento básico'
      ],
      color: 'primary'
    },
    {
      id: 'clarividencia',
      name: 'Clarividência',
      price: '$7.99/mês',
      features: [
        'Conversas ilimitadas',
        'Análises de sonhos ilimitadas',
        'Badge exclusivo de assinante',
        'Compartilhamento premium',
        'Análises detalhadas',
        'Acesso antecipado a novidades'
      ],
      recommended: true,
      color: 'secondary'
    }
  ]
  
  const handleSubscribe = () => {
    // Aqui seria integrada a API de pagamento
    alert(`Assinatura do plano ${selectedPlan} seria processada aqui.`)
  }
  
  return (
    <>
      <Navbar />
      
      <div className={`min-h-screen pt-20 ${darkMode ? 'bg-gray-950 text-gray-200' : 'bg-gray-50 text-gray-800'}`}>
        <div className="container-custom py-12 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <motion.h1 
              className={`text-3xl md:text-4xl font-heading font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Expanda Suas Possibilidades
            </motion.h1>
            
            <motion.p 
              className={`text-lg max-w-2xl mx-auto mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Escolha o plano perfeito para sua jornada de autoconhecimento e transformação pessoal.
            </motion.p>
            
            <motion.div 
              className="p-2 px-4 rounded-full inline-block bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-sm font-medium mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              50% de desconto na primeira compra!
            </motion.div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => {
              const isSelected = selectedPlan === plan.id
              const isPrimary = plan.color === 'primary'
              
              return (
                <motion.div 
                  key={plan.id}
                  className={`relative rounded-2xl overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'} ${
                    isSelected ? 'ring-4 ring-offset-2 ' + (isPrimary ? 'ring-primary-500' : 'ring-secondary-500') : ''
                  } shadow-lg`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  {plan.recommended && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-secondary-500 to-primary-500 text-white text-xs font-bold py-1 px-4 rounded-bl-lg">
                      RECOMENDADO
                    </div>
                  )}
                  
                  <div className={`p-8 ${plan.recommended ? 'pt-10' : ''}`}>
                    <h3 className={`text-2xl font-heading font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                    <p className={`text-3xl font-bold mb-6 ${isPrimary ? 'text-primary-500' : 'text-secondary-500'}`}>{plan.price}</p>
                    
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                               className={`w-5 h-5 flex-shrink-0 ${isPrimary ? 'text-primary-500' : 'text-secondary-500'}`}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                          <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    
                    <button 
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`w-full py-3 px-6 rounded-xl transition-all ${isSelected
                        ? isPrimary 
                          ? 'bg-primary-600 text-white' 
                          : 'bg-secondary-600 text-white'
                        : darkMode 
                          ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {isSelected ? 'Selecionado' : 'Selecionar'}
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
          
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <button
              onClick={handleSubscribe}
              disabled={!selectedPlan}
              className={`btn-primary px-8 py-3 text-lg ${!selectedPlan ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Continuar com a Assinatura
            </button>
            
            <p className={`mt-4 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Você pode cancelar sua assinatura a qualquer momento.
            </p>
            
            <div className="mt-8">
              <Link to="/dashboard" className={`text-sm ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`}>
                ← Voltar para o Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </>
  )
}

export default SubscriptionPage