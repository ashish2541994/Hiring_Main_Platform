import { cn } from '../../utils/cn'

const Avatar = ({ src, alt = '', initials, className = '', size = 'md' }) => {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
  }

  return (
    <div
      className={cn(
        'relative flex items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold overflow-hidden',
        sizes[size],
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{initials || 'U'}</span>
      )}
    </div>
  )
}

export default Avatar
