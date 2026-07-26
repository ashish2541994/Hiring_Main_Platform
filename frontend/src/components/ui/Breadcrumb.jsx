import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '../../utils/cn'

const BreadcrumbItem = ({ children, href, isLast = false }) => {
  if (isLast || !href) {
    return (
      <span className="text-foreground font-medium">{children}</span>
    )
  }

  return (
    <Link
      to={href}
      className="text-muted-foreground hover:text-foreground transition-colors"
    >
      {children}
    </Link>
  )
}

const Breadcrumb = ({ items, className, showHome = true }) => {
  const location = useLocation()

  const defaultItems = showHome
    ? [{ label: 'Home', href: '/', icon: Home }]
    : []

  const allItems = [...defaultItems, ...(items || [])]

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center space-x-2 text-sm', className)}>
      {allItems.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="w-4 h-4 text-muted-foreground mx-2" />
          )}
          <div className="flex items-center">
            {item.icon && (
              <item.icon className="w-4 h-4 mr-1 text-muted-foreground" />
            )}
            <BreadcrumbItem
              href={item.href}
              isLast={index === allItems.length - 1}
            >
              {item.label}
            </BreadcrumbItem>
          </div>
        </div>
      ))}
    </nav>
  )
}

export default Breadcrumb
