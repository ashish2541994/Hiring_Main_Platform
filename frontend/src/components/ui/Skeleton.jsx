import { cn } from '../../utils/cn'

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'animate-shimmer bg-muted/30 rounded-md',
        'bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30',
        'bg-[length:1000px_100%]',
        className
      )}
      {...props}
    />
  )
}

const SkeletonCard = ({ className }) => {
  return (
    <div className={cn('rounded-xl border border-border p-6 space-y-4', className)}>
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  )
}

const SkeletonAvatar = ({ className }) => {
  return <Skeleton className={cn('h-10 w-10 rounded-full', className)} />
}

const SkeletonButton = ({ className }) => {
  return <Skeleton className={cn('h-10 w-24 rounded-lg', className)} />
}

const SkeletonInput = ({ className }) => {
  return <Skeleton className={cn('h-10 w-full rounded-lg', className)} />
}

const SkeletonText = ({ className, lines = 3 }) => {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-4', i === lines - 1 ? 'w-3/4' : 'w-full')}
        />
      ))}
    </div>
  )
}

const SkeletonTable = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={`cell-${rowIndex}-${colIndex}`} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

export {
  Skeleton,
  SkeletonCard,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonInput,
  SkeletonText,
  SkeletonTable,
}
