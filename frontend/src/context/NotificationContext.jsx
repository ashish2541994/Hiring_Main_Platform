import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { notificationApi } from '../services'

const NotificationContext = createContext(null)

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState(null)

  // Fetch notifications
  const fetchNotifications = useCallback(async (params = {}) => {
    setLoading(true)
    try {
      const response = await notificationApi.getNotifications(params)
      setNotifications(response.data)
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch unread notifications
  const fetchUnreadNotifications = useCallback(async (params = {}) => {
    try {
      const response = await notificationApi.getUnreadNotifications(params)
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Failed to fetch unread notifications:', error)
      return { success: false, error }
    }
  }, [])

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await notificationApi.getUnreadCount()
      setUnreadCount(response.data.count)
      return { success: true, count: response.data.count }
    } catch (error) {
      console.error('Failed to fetch unread count:', error)
      return { success: false, error }
    }
  }, [])

  // Mark as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await notificationApi.markAsRead(notificationId)
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
      return { success: true }
    } catch (error) {
      console.error('Failed to mark as read:', error)
      return { success: false, error }
    }
  }, [])

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationApi.markAllAsRead()
      setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
      setUnreadCount(0)
      return { success: true }
    } catch (error) {
      console.error('Failed to mark all as read:', error)
      return { success: false, error }
    }
  }, [])

  // Delete notification
  const deleteNotification = useCallback(async (notificationId) => {
    try {
      await notificationApi.deleteNotification(notificationId)
      setNotifications((prev) => prev.filter((notif) => notif._id !== notificationId))
      return { success: true }
    } catch (error) {
      console.error('Failed to delete notification:', error)
      return { success: false, error }
    }
  }, [])

  // Delete all notifications
  const deleteAllNotifications = useCallback(async () => {
    try {
      await notificationApi.deleteAllNotifications()
      setNotifications([])
      setUnreadCount(0)
      return { success: true }
    } catch (error) {
      console.error('Failed to delete all notifications:', error)
      return { success: false, error }
    }
  }, [])

  // Fetch notification settings
  const fetchSettings = useCallback(async () => {
    try {
      const response = await notificationApi.getSettings()
      setSettings(response.data)
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
      return { success: false, error }
    }
  }, [])

  // Update notification settings
  const updateSettings = useCallback(async (settingsData) => {
    try {
      const response = await notificationApi.updateSettings(settingsData)
      setSettings(response.data)
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Failed to update settings:', error)
      return { success: false, error }
    }
  }, [])

  // Add new notification (for real-time updates)
  const addNotification = useCallback((notification) => {
    setNotifications((prev) => [notification, ...prev])
    if (!notification.read) {
      setUnreadCount((prev) => prev + 1)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchUnreadCount()
    fetchSettings()
  }, [fetchUnreadCount, fetchSettings])

  const value = {
    notifications,
    unreadCount,
    loading,
    settings,
    fetchNotifications,
    fetchUnreadNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    fetchSettings,
    updateSettings,
    addNotification,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}
