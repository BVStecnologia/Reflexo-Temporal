import { motion } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'

const FeatureCard = ({ icon, title, description }) => {
  const { darkMode } = useTheme()

  return (
    <motion.div 
      className={`rounded-xl p-6 h-full ${darkMode ? 'bg-gray-800 hover:bg-gray-800/80' : 'bg-white hover:bg-gray-50'} shadow-lg hover:shadow-xl transition-all duration-300`}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col h-full">
        <div className="mb-4 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
          {icon}
        </div>
        <h3 className={`text-xl font-heading font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} flex-grow`}>{description}</p>
      </div>
    </motion.div>
  )
}

export default FeatureCard
