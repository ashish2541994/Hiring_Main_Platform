import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '../../utils/cn'
import useDebounce from '../../hooks/useDebounce'

const SearchBar = ({
  placeholder = 'Search...',
  value: controlledValue,
  onChange,
  onSearch,
  debounceDelay = 300,
  className,
  showClearButton = true,
  size = 'md',
}) => {
  const [internalValue, setInternalValue] = useState(controlledValue || '')
  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : internalValue
  const debouncedValue = useDebounce(value, debounceDelay)

  const handleChange = (e) => {
    const newValue = e.target.value
    if (!isControlled) {
      setInternalValue(newValue)
    }
    onChange?.(newValue)
  }

  const handleClear = () => {
    if (!isControlled) {
      setInternalValue('')
    }
    onChange?.('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch?.(value)
    }
  }

  const sizeClasses = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-11 px-5 text-lg',
  }

  return (
    <div className={cn('relative w-full', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          'w-full pl-10 pr-10 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200',
          sizeClasses[size]
        )}
      />
      {showClearButton && value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          type="button"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

export default SearchBar
