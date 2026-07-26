import api from './api'

const notificationApi = {
  // Get all notifications
  getNotifications: (params = {}) => {
    return api.get('/notifications', { params })
  },

  // Get unread notifications
  getUnreadNotifications: (params = {}) => {
    return api.get('/notifications/unread', { params })
  },

  // Get notification by ID
  getNotificationById: (notificationId) => {
    return api.get(`/notifications/${notificationId}`)
  },

  // Mark notification as read
  markAsRead: (notificationId) => {
    return api.put(`/notifications/${notificationId}/read`)
  },

  // Mark all notifications as read
  markAllAsRead: () => {
    return api.put('/notifications/read-all')
  },

  // Delete notification
  deleteNotification: (notificationId) => {
    return api.delete(`/notifications/${notificationId}`)
  },

  // Delete all notifications
  deleteAllNotifications: () => {
    return api.delete('/notifications')
  },

  // Delete read notifications
  deleteReadNotifications: () => {
    return api.delete('/notifications/read')
  },

  // Get unread count
  getUnreadCount: () => {
    return api.get('/notifications/unread-count')
  },

  // Get notification settings
  getSettings: () => {
    return api.get('/notifications/settings')
  },

  // Update notification settings
  updateSettings: (settingsData) => {
    return api.put('/notifications/settings', settingsData)
  },

  // Subscribe to notification type
  subscribeToType: (type) => {
    return api.post(`/notifications/subscribe/${type}`)
  },

  // Unsubscribe from notification type
  unsubscribeFromType: (type) => {
    return api.delete(`/notifications/subscribe/${type}`)
  },
}

export default notificationApi
