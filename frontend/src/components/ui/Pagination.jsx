import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { cn } from '../../utils/cn'
import Button from './Button'

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showEdges = true,
  showFirstLast = true,
  maxVisiblePages = 5,
  className,
}) => {
  const getPageNumbers = () => {
    const pages = []
    const halfVisible = Math.floor(maxVisiblePages / 2)

    let startPage = Math.max(1, currentPage - halfVisible)
    let endPage = Math.min(totalPages, currentPage + halfVisible)

    if (currentPage - halfVisible < 1) {
      endPage = Math.min(totalPages, maxVisiblePages)
    }

    if (currentPage + halfVisible > totalPages) {
      startPage = Math.max(1, totalPages - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }

  const pages = getPageNumbers()

  return (
    <div className={cn('flex items-center justify-center space-x-2', className)}>
      {showFirstLast && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-2"
        >
          <ChevronsLeft className="w-4 h-4" />
        </Button>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {showEdges && pages[0] > 1 && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            className={cn(
              'w-10 h-10',
              currentPage === 1 && 'bg-primary text-primary-foreground'
            )}
          >
            1
          </Button>
          {pages[0] > 2 && <span className="px-2 text-muted-foreground">...</span>}
        </>
      )}

      {pages.map((page) => (
        <Button
          key={page}
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page)}
          className={cn(
            'w-10 h-10',
            currentPage === page && 'bg-primary text-primary-foreground'
          )}
        >
          {page}
        </Button>
      ))}

      {showEdges && pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span className="px-2 text-muted-foreground">...</span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            className={cn(
              'w-10 h-10',
              currentPage === totalPages && 'bg-primary text-primary-foreground'
            )}
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>

      {showFirstLast && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2"
        >
          <ChevronsRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  )
}

export default Pagination
