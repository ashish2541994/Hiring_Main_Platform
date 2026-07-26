import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '../../utils/cn'

const Drawer = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  position = 'right',
  size = 'md',
  className = '' 
}) => {
  const sizes = {
    sm: 'w-80',
    md: 'w-96',
    lg: 'w-[500px]',
    xl: 'w-[600px]',
  }

  const positions = {
    left: 'left-0',
    right: 'right-0',
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ x: position === 'right' ? '100%' : '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: position === 'right' ? '100%' : '-100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={cn(
            'absolute top-0 bottom-0 h-full border-l border-border bg-background shadow-2xl',
            positions[position],
            sizes[size],
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-border p-6">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-2 hover:bg-accent transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-6 h-[calc(100%-73px)] overflow-y-auto">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default Drawer
