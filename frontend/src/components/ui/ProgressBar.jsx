import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

const ProgressBar = ({ value = 0, max = 100, className, showLabel = false, label }) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-foreground">{label}</span>
          {showLabel && (
            <span className="text-sm text-muted-foreground">{percentage}%</span>
          )}
        </div>
      )}
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={cn(
            'h-full rounded-full transition-all duration-500',
            percentage < 30 && 'bg-danger',
            percentage < 70 && percentage >= 30 && 'bg-warning',
            percentage >= 70 && 'bg-success'
          )}
        />
      </div>
    </div>
  )
}

const CircularProgress = ({ value = 0, max = 100, size = 40, strokeWidth = 4, className, showLabel = false }) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-muted"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={cn(
            'transition-all duration-500',
            percentage < 30 && 'text-danger',
            percentage < 70 && percentage >= 30 && 'text-warning',
            percentage >= 70 && 'text-success'
          )}
        />
      </svg>
      {showLabel && (
        <span className="absolute text-xs font-medium text-foreground">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  )
}

const LinearProgress = ({ className, variant = 'default' }) => {
  return (
    <div className={cn('h-1 w-full overflow-hidden bg-muted rounded-full', className)}>
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
        className={cn(
          'h-full rounded-full',
          variant === 'primary' && 'bg-primary',
          variant === 'secondary' && 'bg-secondary',
          variant === 'success' && 'bg-success',
          variant === 'warning' && 'bg-warning',
          variant === 'danger' && 'bg-danger',
          variant === 'default' && 'bg-foreground'
        )}
      />
    </div>
  )
}

export { ProgressBar, CircularProgress, LinearProgress }
