import { useState } from 'react'
import { cn } from '../../utils/cn'
import { ChevronUp, ChevronDown } from 'lucide-react'
import Button from './Button'
import Pagination from './Pagination'
import EmptyState from './EmptyState'

const DataTable = ({
  columns,
  data,
  loading = false,
  pagination,
  onPageChange,
  onSort,
  sortConfig,
  selectable = false,
  onSelect,
  onRowClick,
  className,
  emptyStateProps,
}) => {
  const [selectedRows, setSelectedRows] = useState([])

  const handleSort = (key) => {
    if (!onSort) return

    let direction = 'asc'
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc'
    }

    onSort({ key, direction })
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      const allIds = data.map((row) => row.id)
      setSelectedRows(allIds)
      onSelect?.(allIds)
    } else {
      setSelectedRows([])
      onSelect?.([])
    }
  }

  const handleSelectRow = (id, checked) => {
    const newSelected = checked
      ? [...selectedRows, id]
      : selectedRows.filter((rowId) => rowId !== id)
    
    setSelectedRows(newSelected)
    onSelect?.(newSelected)
  }

  const isRowSelected = (id) => selectedRows.includes(id)
  const isAllSelected = data.length > 0 && selectedRows.length === data.length
  const isSomeSelected = selectedRows.length > 0 && !isAllSelected

  if (loading) {
    return (
      <div className={cn('w-full', className)}>
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className={cn('w-full', className)}>
        <EmptyState {...emptyStateProps} />
      </div>
    )
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {selectable && (
                <th className="w-12 px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = isSomeSelected
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded border-input"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => column.sortable && handleSort(column.key)}
                  className={cn(
                    'px-4 py-3 text-left text-sm font-medium text-muted-foreground',
                    column.sortable && 'cursor-pointer hover:text-foreground transition-colors',
                    column.className
                  )}
                >
                  <div className="flex items-center space-x-2">
                    <span>{column.label}</span>
                    {column.sortable && sortConfig?.key === column.key && (
                      <span>
                        {sortConfig.direction === 'asc' ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  'border-b border-border hover:bg-muted/50 transition-colors',
                  onRowClick && 'cursor-pointer'
                )}
              >
                {selectable && (
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={isRowSelected(row.id)}
                      onChange={(e) => handleSelectRow(row.id, e.target.checked)}
                      className="w-4 h-4 rounded border-input"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      'px-4 py-3 text-sm text-foreground',
                      column.cellClassName
                    )}
                  >
                    {column.render
                      ? column.render(row[column.key], row, rowIndex)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {pagination.startIndex + 1} to {pagination.endIndex} of{' '}
            {pagination.total} results
          </p>
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  )
}

export default DataTable
