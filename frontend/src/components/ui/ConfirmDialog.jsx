import { createContext, useContext, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'
import Button from './Button'

const ConfirmDialogContext = createContext(undefined)

export const useConfirmDialog = () => {
  const context = useContext(ConfirmDialogContext)
  if (!context) {
    throw new Error('useConfirmDialog must be used within a ConfirmDialogProvider')
  }
  return context
}

export const ConfirmDialogProvider = ({ children }) => {
  const [dialog, setDialog] = useState(null)

  const confirm = useCallback((options) => {
    return new Promise((resolve) => {
      setDialog({
        ...options,
        onConfirm: () => {
          resolve(true)
          setDialog(null)
        },
        onCancel: () => {
          resolve(false)
          setDialog(null)
        },
      })
    })
  }, [])

  const close = useCallback(() => {
    setDialog(null)
  }, [])

  const value = {
    dialog,
    confirm,
    close,
  }

  return (
    <ConfirmDialogContext.Provider value={value}>
      {children}
      <ConfirmDialog />
    </ConfirmDialogContext.Provider>
  )
}

const ConfirmDialog = () => {
  const { dialog, close } = useConfirmDialog()

  if (!dialog) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget && dialog.closeOnOverlayClick !== false) {
            dialog.onCancel()
          }
        }}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50"
        />

        {/* Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={dialog.onCancel}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon */}
          {dialog.showIcon !== false && (
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          )}

          {/* Title */}
          {dialog.title && (
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              {dialog.title}
            </h3>
          )}

          {/* Message */}
          {dialog.message && (
            <p className="text-gray-600 text-center mb-6">
              {dialog.message}
            </p>
          )}

          {/* Warning text */}
          {dialog.warning && (
            <p className="text-sm text-red-600 text-center mb-6">
              {dialog.warning}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={dialog.onCancel}
              className="flex-1"
            >
              {dialog.cancelText || 'Cancel'}
            </Button>
            <Button
              variant={dialog.variant || 'destructive'}
              onClick={dialog.onConfirm}
              className="flex-1"
              disabled={dialog.isConfirming}
            >
              {dialog.isConfirming ? 'Confirming...' : (dialog.confirmText || 'Confirm')}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Pre-configured confirmation dialogs
export const confirmDelete = (itemName, itemType = 'item') => {
  const { confirm } = useConfirmDialog()
  return confirm({
    title: 'Delete Confirmation',
    message: `Are you sure you want to delete this ${itemType}?`,
    warning: `This action cannot be undone. "${itemName}" will be permanently deleted.`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    variant: 'destructive',
  })
}

export const confirmLogout = () => {
  const { confirm } = useConfirmDialog()
  return confirm({
    title: 'Logout',
    message: 'Are you sure you want to logout?',
    confirmText: 'Logout',
    cancelText: 'Cancel',
    variant: 'default',
  })
}

export const confirmUnsavedChanges = () => {
  const { confirm } = useConfirmDialog()
  return confirm({
    title: 'Unsaved Changes',
    message: 'You have unsaved changes. Do you want to leave without saving?',
    warning: 'Your changes will be lost if you leave.',
    confirmText: 'Leave',
    cancelText: 'Stay',
    variant: 'destructive',
  })
}

export const confirmRemove = (itemName, itemType = 'item') => {
  const { confirm } = useConfirmDialog()
  return confirm({
    title: 'Remove Confirmation',
    message: `Are you sure you want to remove ${itemName}?`,
    confirmText: 'Remove',
    cancelText: 'Cancel',
    variant: 'destructive',
  })
}

export const confirmArchive = (itemName, itemType = 'item') => {
  const { confirm } = useConfirmDialog()
  return confirm({
    title: 'Archive Confirmation',
    message: `Are you sure you want to archive this ${itemType}?`,
    confirmText: 'Archive',
    cancelText: 'Cancel',
    variant: 'default',
  })
}

export const confirmRestore = (itemName, itemType = 'item') => {
  const { confirm } = useConfirmDialog()
  return confirm({
    title: 'Restore Confirmation',
    message: `Are you sure you want to restore this ${itemType}?`,
    confirmText: 'Restore',
    cancelText: 'Cancel',
    variant: 'default',
  })
}

export const confirmDeactivate = (itemName) => {
  const { confirm } = useConfirmDialog()
  return confirm({
    title: 'Deactivate Account',
    message: `Are you sure you want to deactivate ${itemName}?`,
    warning: 'The user will not be able to access their account.',
    confirmText: 'Deactivate',
    cancelText: 'Cancel',
    variant: 'destructive',
  })
}

export const confirmActivate = (itemName) => {
  const { confirm } = useConfirmDialog()
  return confirm({
    title: 'Activate Account',
    message: `Are you sure you want to activate ${itemName}?`,
    confirmText: 'Activate',
    cancelText: 'Cancel',
    variant: 'default',
  })
}

export const confirmReject = (itemName, itemType = 'application') => {
  const { confirm } = useConfirmDialog()
  return confirm({
    title: 'Reject Confirmation',
    message: `Are you sure you want to reject this ${itemType}?`,
    warning: 'This action cannot be undone.',
    confirmText: 'Reject',
    cancelText: 'Cancel',
    variant: 'destructive',
  })
}

export const confirmApprove = (itemName, itemType = 'application') => {
  const { confirm } = useConfirmDialog()
  return confirm({
    title: 'Approve Confirmation',
    message: `Are you sure you want to approve this ${itemType}?`,
    confirmText: 'Approve',
    cancelText: 'Cancel',
    variant: 'default',
  })
}

export const confirmPublish = (itemName, itemType = 'job') => {
  const { confirm } = useConfirmDialog()
  return confirm({
    title: 'Publish Confirmation',
    message: `Are you sure you want to publish this ${itemType}?`,
    confirmText: 'Publish',
    cancelText: 'Cancel',
    variant: 'default',
  })
}

export const confirmUnpublish = (itemName, itemType = 'job') => {
  const { confirm } = useConfirmDialog()
  return confirm({
    title: 'Unpublish Confirmation',
    message: `Are you sure you want to unpublish this ${itemType}?`,
    confirmText: 'Unpublish',
    cancelText: 'Cancel',
    variant: 'default',
  })
}

export const confirmCancel = (itemName, itemType = 'request') => {
  const { confirm } = useConfirmDialog()
  return confirm({
    title: 'Cancel Confirmation',
    message: `Are you sure you want to cancel this ${itemType}?`,
    warning: 'This action cannot be undone.',
    confirmText: 'Cancel',
    cancelText: 'Keep',
    variant: 'destructive',
  })
}

export const confirmResend = (itemName, itemType = 'invitation') => {
  const { confirm } = useConfirmDialog()
  return confirm({
    title: 'Resend Confirmation',
    message: `Are you sure you want to resend this ${itemType}?`,
    confirmText: 'Resend',
    cancelText: 'Cancel',
    variant: 'default',
  })
}

// Custom confirmation hook
export const useConfirm = () => {
  const { confirm } = useConfirmDialog()

  const showConfirm = useCallback((options) => {
    return confirm(options)
  }, [confirm])

  return showConfirm
}

// HOC for wrapping components with confirmation
export const withConfirm = (Component) => {
  return function WrappedComponent(props) {
    const confirm = useConfirm()
    return <Component {...props} confirm={confirm} />
  }
}
