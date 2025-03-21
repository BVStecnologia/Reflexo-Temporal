import { motion } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'

const WaveBackground = ({ children }) => {
  const { darkMode } = useTheme()

  return (
    <div className={`relative overflow-hidden ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <div className="absolute inset-0 overflow-hidden z-0">
        <motion.div 
          className="wave-animation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 1.5 }}
        />
        <motion.div 
          className="wave-animation"
          style={{ animationDelay: '2s', top: '15%', left: '10%' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1.5, delay: 0.2 }}
        />
        <motion.div 
          className="wave-animation"
          style={{ animationDelay: '4s', top: '35%', right: '5%' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1.5, delay: 0.4 }}
        />
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

export default WaveBackground
