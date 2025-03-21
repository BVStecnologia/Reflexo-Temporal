import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const NotFoundPage = () => {
  const { darkMode } = useTheme()
  
  return (
    <>
      <Navbar />
      
      <div className={`min-h-screen pt-24 ${darkMode ? 'bg-gray-950 text-gray-200' : 'bg-gray-50 text-gray-800'}`}>
        <div className="container-custom py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className={`text-6xl md:text-8xl font-heading font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <span className="gradient-text">404</span>
            </h1>
            
            <h2 className={`text-2xl md:text-3xl font-heading font-semibold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Página Não Encontrada
            </h2>
            
            <p className={`text-lg max-w-lg mx-auto mb-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              O reflexo temporal desta página parece estar distorcido. Ela pode ter sido movida para outra linha do tempo ou nunca ter existido nesta realidade.
            </p>
            
            <div className="space-x-4">
              <Link to="/" className="btn-primary">
                Voltar ao Início
              </Link>
              <Link to="/dashboard" className="btn-outline">
                Ir para Dashboard
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            className="mt-16 relative max-w-sm mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className={`h-36 w-36 absolute top-0 left-0 rounded-full opacity-60 filter blur-2xl ${darkMode ? 'bg-primary-800' : 'bg-primary-200'}`} />
            <div className={`h-36 w-36 absolute bottom-0 right-0 rounded-full opacity-60 filter blur-2xl ${darkMode ? 'bg-secondary-800' : 'bg-secondary-200'}`} />
            <div className="relative">
              <svg 
                viewBox="0 0 200 200" 
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  fill={darkMode ? '#6D28D9' : '#8B5CF6'} 
                  d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.2,73.3,42.6C65.2,56,54.5,68.3,41.2,76.3C27.9,84.3,13.9,88.1,-0.4,88.7C-14.7,89.4,-29.4,86.9,-43.3,80.5C-57.2,74.2,-70.3,63.9,-76.4,50.5C-82.6,37.2,-81.8,18.6,-79.8,1.1C-77.9,-16.3,-74.8,-32.6,-67.1,-47.2C-59.4,-61.9,-47.2,-74.9,-33.1,-81.8C-19,-88.8,-3,-89.8,9.8,-85.9C22.7,-82.1,30.6,-83.5,44.7,-76.4Z" 
                  transform="translate(100 100)" 
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl">🔍</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </>
  )
}

export default NotFoundPage