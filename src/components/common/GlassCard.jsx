import { motion } from 'framer-motion'

const GlassCard = ({ children, className = '', hover = true, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={`glass-card p-6 ${hover ? 'hover-lift' : ''} ${className}`}
      whileHover={hover ? { y: -5 } : {}}
    >
      {children}
    </motion.div>
  )
}

export default GlassCard