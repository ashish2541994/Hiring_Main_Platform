import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' } : {}}
      className={cn(
        'rounded-xl border border-border bg-card text-card-foreground shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}

const CardHeader = ({ children, className = '' }) => {
  return (
    <div className={cn('flex flex-col space-y-1.5 p-6', className)}>
      {children}
    </div>
  )
}

const CardTitle = ({ children, className = '' }) => {
  return (
    <h3 className={cn('text-2xl font-semibold leading-none tracking-tight', className)}>
      {children}
    </h3>
  )
}

const CardDescription = ({ children, className = '' }) => {
  return (
    <p className={cn('text-sm text-muted-foreground', className)}>
      {children}
    </p>
  )
}

const CardContent = ({ children, className = '' }) => {
  return (
    <div className={cn('p-6 pt-0', className)}>
      {children}
    </div>
  )
}

const CardFooter = ({ children, className = '' }) => {
  return (
    <div className={cn('flex items-center p-6 pt-0', className)}>
      {children}
    </div>
  )
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
