import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'
import { 
  FileX, 
  Search, 
  Inbox, 
  Users, 
  Briefcase, 
  Plus,
  RefreshCw 
} from 'lucide-react'
import Button from './Button'

const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
  onAction,
  variant = 'default',
  className,
}) => {
  const getIcon = () => {
    if (Icon) return Icon
    switch (variant) {
      case 'no-results':
        return Search
      case 'no-data':
        return FileX
      case 'no-messages':
        return Inbox
      case 'no-users':
        return Users
      case 'no-jobs':
        return Briefcase
      default:
        return FileX
    }
  }

  const getTitle = () => {
    if (title) return title
    switch (variant) {
      case 'no-results':
        return 'No results found'
      case 'no-data':
        return 'No data available'
      case 'no-messages':
        return 'No messages yet'
      case 'no-users':
        return 'No users found'
      case 'no-jobs':
        return 'No jobs available'
      default:
        return 'Nothing here'
    }
  }

  const getDescription = () => {
    if (description) return description
    switch (variant) {
      case 'no-results':
        return 'Try adjusting your search or filters to find what you\'re looking for.'
      case 'no-data':
        return 'There\'s no data to display at the moment. Check back later.'
      case 'no-messages':
        return 'Start a conversation to see your messages here.'
      case 'no-users':
        return 'No users match your current criteria.'
      case 'no-jobs':
        return 'There are no job postings available right now.'
      default:
        return 'It looks like there\'s nothing here yet.'
    }
  }

  const getActionLabel = () => {
    if (actionLabel) return actionLabel
    switch (variant) {
      case 'no-results':
        return 'Clear filters'
      case 'no-data':
        return 'Refresh'
      case 'no-messages':
        return 'Start conversation'
      case 'no-users':
        return 'Add user'
      case 'no-jobs':
        return 'Post a job'
      default:
        return 'Take action'
    }
  }

  const CurrentIcon = getIcon()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex flex-col items-center justify-center text-center py-12 px-6',
        className
      )}
    >
      <div className="w-20 h-20 mb-6 rounded-full bg-muted/50 flex items-center justify-center">
        <CurrentIcon className="h-10 w-10 text-muted-foreground" />
      </div>
      
      <h3 className="text-xl font-semibold text-foreground mb-2">
        {getTitle()}
      </h3>
      
      <p className="text-muted-foreground max-w-md mb-6">
        {getDescription()}
      </p>
      
      {onAction && (
        <Button onClick={onAction} variant="outline">
          {variant === 'no-results' ? (
            <RefreshCw className="h-4 w-4 mr-2" />
          ) : variant === 'no-jobs' || variant === 'no-users' ? (
            <Plus className="h-4 w-4 mr-2" />
          ) : null}
          {getActionLabel()}
        </Button>
      )}
    </motion.div>
  )
}

const EmptyStateCard = ({ className, ...props }) => {
  return (
    <div className={cn('rounded-xl border border-border bg-card p-8', className)}>
      <EmptyState {...props} />
    </div>
  )
}

export { EmptyState, EmptyStateCard }
