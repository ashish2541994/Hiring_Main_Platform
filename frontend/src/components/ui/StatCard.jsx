import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'
import { AnimatedWrapper } from './AnimatedWrapper'

const StatCard = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  trend,
  className,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  const valueSizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
  }

  const changeColors = {
    positive: 'text-success',
    negative: 'text-danger',
    neutral: 'text-muted-foreground',
  }

  const trendIcons = {
    up: '↑',
    down: '↓',
    neutral: '→',
  }

  return (
    <AnimatedWrapper variant="scale" className={className}>
      <div className={cn('card-premium', sizeClasses[size])}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {title}
            </p>
            <motion.p
              className={cn('font-bold text-foreground', valueSizeClasses[size])}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {value}
            </motion.p>
            {change !== undefined && (
              <div className="flex items-center mt-2 space-x-1">
                <span className={cn('text-sm font-medium', changeColors[changeType])}>
                  {trendIcons[trend] || ''} {change}
                </span>
                <span className="text-sm text-muted-foreground">
                  from last month
                </span>
              </div>
            )}
          </div>
          {Icon && (
            <div className="p-3 rounded-lg bg-primary/10">
              <Icon className="w-6 h-6 text-primary" />
            </div>
          )}
        </div>
      </div>
    </AnimatedWrapper>
  )
}

export default StatCard
