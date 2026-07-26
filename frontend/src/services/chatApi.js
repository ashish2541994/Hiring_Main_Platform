import api from './api'

const chatApi = {
  // Get all conversations
  getConversations: (params = {}) => {
    return api.get('/chat/conversations', { params })
  },

  // Get conversation by ID
  getConversationById: (conversationId) => {
    return api.get(`/chat/conversations/${conversationId}`)
  },

  // Get conversation with specific user
  getConversationWithUser: (userId) => {
    return api.get(`/chat/conversations/user/${userId}`)
  },

  // Create new conversation
  createConversation: (participantsData) => {
    return api.post('/chat/conversations', participantsData)
  },

  // Get messages in conversation
  getMessages: (conversationId, params = {}) => {
    return api.get(`/chat/conversations/${conversationId}/messages`, { params })
  },

  // Send message
  sendMessage: (conversationId, messageData) => {
    return api.post(`/chat/conversations/${conversationId}/messages`, messageData)
  },

  // Mark messages as read
  markAsRead: (conversationId) => {
    return api.put(`/chat/conversations/${conversationId}/read`)
  },

  // Mark message as read
  markMessageAsRead: (messageId) => {
    return api.put(`/chat/messages/${messageId}/read`)
  },

  // Delete message
  deleteMessage: (messageId) => {
    return api.delete(`/chat/messages/${messageId}`)
  },

  // Edit message
  editMessage: (messageId, content) => {
    return api.put(`/chat/messages/${messageId}`, { content })
  },

  // Get unread message count
  getUnreadCount: () => {
    return api.get('/chat/unread-count')
  },

  // Search messages
  searchMessages: (conversationId, query) => {
    return api.get(`/chat/conversations/${conversationId}/search`, { params: { q: query } })
  },

  // Get typing status
  getTypingStatus: (conversationId) => {
    return api.get(`/chat/conversations/${conversationId}/typing`)
  },

  // Set typing status
  setTypingStatus: (conversationId, isTyping) => {
    return api.post(`/chat/conversations/${conversationId}/typing`, { isTyping })
  },

  // Archive conversation
  archiveConversation: (conversationId) => {
    return api.put(`/chat/conversations/${conversationId}/archive`)
  },

  // Unarchive conversation
  unarchiveConversation: (conversationId) => {
    return api.put(`/chat/conversations/${conversationId}/unarchive`)
  },

  // Delete conversation
  deleteConversation: (conversationId) => {
    return api.delete(`/chat/conversations/${conversationId}`)
  },

  // Block user
  blockUser: (userId) => {
    return api.post(`/chat/block/${userId}`)
  },

  // Unblock user
  unblockUser: (userId) => {
    return api.delete(`/chat/block/${userId}`)
  },
}

export default chatApi
