import { motion } from 'framer-motion'

const StatsCard = ({ title, value, icon: Icon, color, change, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`glass-card p-6 hover-lift ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-1">{title}</p>
          <h3 className="text-3xl font-bold">{value}</h3>
          
          {change && (
            <div className={`inline-flex items-center mt-2 px-2 py-1 rounded-full text-xs ${
              change > 0 
                ? 'bg-green-500/20 text-green-300' 
                : 'bg-red-500/20 text-red-300'
            }`}>
              {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-xl ${color}`}>
          {Icon && <Icon className="text-2xl" />}
        </div>
      </div>
    </motion.div>
  )
}

export default StatsCard