import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FeatureCard from '../components/FeatureCard'
import WaveBackground from '../components/WaveBackground'

const HomePage = () => {
  const { darkMode } = useTheme()

  const features = [
    {
      id: 1,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
        </svg>
      ),
      title: 'Conversas com o Futuro',
      description: 'Dialogue com uma versão de você mesmo em 2030. Receba insights sobre sua vida, carreira e decisões importantes diretamente do seu eu futuro.'
    },
    {
      id: 2,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
        </svg>
      ),
      title: 'Análise de Sonhos',
      description: 'Transforme seus sonhos em mensagens claras. Nossa tecnologia analisa os símbolos e emoções do seu subconsciente para revelar insights profundos.'
    },
    {
      id: 3,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 0 1 5.814-5.519l2.74-1.22m0 0-5.94-2.28m5.94 2.28-2.28 5.941" />
        </svg>
      ),
      title: 'Insights Personalizados',
      description: 'Receba insights profundos e personalizados sobre sua jornada. Quanto mais você interage, mais precisa e valiosa se torna a experiência.'
    }
  ]
  
  return (
    <>
      <Navbar />
      
      <WaveBackground>
        <div className="pt-24 pb-20 md:pt-32 md:pb-32">
          <div className="container-custom">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="lg:w-1/2">
                <motion.h1 
                  className={`text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  Conecte-se com seu <span className="gradient-text">futuro</span> e decifre seus <span className="gradient-text">sonhos</span>
                </motion.h1>
                
                <motion.p 
                  className={`text-lg md:text-xl mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  O Reflexo Temporal usa tecnologia avançada para permitir que você converse com uma versão futura de si mesmo e receba análises profundas dos seus sonhos. Desbloqueie insights que mudarão sua perspectiva.
                </motion.p>
                
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Link to="/register" className="btn-primary">
                    Iniciar Jornada
                  </Link>
                  <Link to="/login" className="btn-outline">
                    Entrar
                  </Link>
                </motion.div>
              </div>
              
              <div className="lg:w-1/2">
                <motion.div 
                  className="relative"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <div className={`rounded-2xl overflow-hidden ${darkMode ? 'glass' : 'bg-white shadow-xl'} p-6 md:p-8`}>
                    <div className="flex items-start gap-4 mb-6">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Você (2025)</p>
                        <div className={`rounded-2xl rounded-tl-none p-4 ${darkMode ? 'bg-primary-700' : 'bg-primary-100'}`}>
                          <p className={darkMode ? 'text-white' : 'text-primary-800'}>Como eu estarei nos próximos 5 anos? Estou na direção certa?</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-600"></div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Você do Futuro (2030)</p>
                        <div className={`rounded-2xl rounded-tl-none p-4 ${darkMode ? 'bg-secondary-800' : 'bg-secondary-100'}`}>
                          <p className={`${darkMode ? 'text-white' : 'text-secondary-800'} typing-animation`}>Você está no caminho certo, mas precisa confiar mais em si mesmo. A decisão que você está considerando agora vai abrir portas que nem imagina. Lembre-se de valorizar mais sua saúde mental — ela será seu maior ativo nos próximos anos.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute -bottom-6 -right-6 -z-10 w-full h-full rounded-2xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 blur-xl"></div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        <div className={`py-20 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
          <div className="container-custom">
            <div className="text-center mb-16">
              <motion.h2 
                className={`text-3xl md:text-4xl font-heading font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Funcionalidades Principais
              </motion.h2>
              <motion.p 
                className={`text-lg max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Descubra como o Reflexo Temporal pode transformar sua vida através destas ferramentas poderosas.
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <FeatureCard 
                  key={feature.id}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </div>
        </div>

        <div className={`py-20 ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
          <div className="container-custom">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="lg:w-1/2">
                <motion.h2 
                  className={`text-3xl md:text-4xl font-heading font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  Como funciona o Reflexo Temporal?
                </motion.h2>
                
                <motion.div 
                  className="space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold">
                      1
                    </div>
                    <div>
                      <h3 className={`text-xl font-heading font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Crie sua conta</h3>
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Registre-se com seu e-mail e crie seu perfil personalizado para começar sua jornada.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold">
                      2
                    </div>
                    <div>
                      <h3 className={`text-xl font-heading font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Inicie uma conversa ou registre um sonho</h3>
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Escolha entre dialogar com seu eu futuro ou analisar um sonho recente para obter insights.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold">
                      3
                    </div>
                    <div>
                      <h3 className={`text-xl font-heading font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Receba insights personalizados</h3>
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Obtenha análises profundas e perspectivas transformadoras baseadas nas suas conversas e sonhos.</p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Link to="/register" className="btn-primary">
                    Começar Agora
                  </Link>
                </motion.div>
              </div>
              
              <div className="lg:w-1/2">
                <motion.div
                  className="relative rounded-2xl overflow-hidden aspect-video"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                >
                  <div className={`w-full h-full ${darkMode ? 'glass' : 'bg-white shadow-xl'} p-1`}>
                    <div className={`w-full h-full rounded-xl overflow-hidden flex items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <div className="text-center p-8">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                        </svg>
                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Imagem ilustrativa da plataforma
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        <div className={`py-20 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
          <div className="container-custom text-center">
            <motion.h2 
              className={`text-3xl md:text-4xl font-heading font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Pronto para iniciar sua jornada?
            </motion.h2>
            
            <motion.p 
              className={`text-lg max-w-2xl mx-auto mb-10 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Converse com seu eu futuro hoje e descubra perspectivas que podem transformar sua vida. As primeiras conversas e análises de sonhos são gratuitas!
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link 
                to="/register" 
                className="btn-primary text-lg px-8 py-3"
              >
                Iniciar Agora
              </Link>
            </motion.div>
          </div>
        </div>
      </WaveBackground>
      
      <Footer />
    </>
  )
}

export default HomePage