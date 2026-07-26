import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { chatApi } from '../services'
import useSocket from '../hooks/useSocket'

const ChatContext = createContext(null)

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState([])
  const [activeConversation, setActiveConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [typingUsers, setTypingUsers] = useState({})

  const { socket, isConnected } = useSocket(
    import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'
  )

  // Fetch conversations
  const fetchConversations = useCallback(async (params = {}) => {
    setLoading(true)
    try {
      const response = await chatApi.getConversations(params)
      setConversations(response.data)
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Failed to fetch conversations:', error)
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch messages for a conversation
  const fetchMessages = useCallback(async (conversationId, params = {}) => {
    setLoading(true)
    try {
      const response = await chatApi.getMessages(conversationId, params)
      setMessages(response.data)
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }, [])

  // Send message
  const sendMessage = useCallback(async (conversationId, messageData) => {
    try {
      const response = await chatApi.sendMessage(conversationId, messageData)
      setMessages((prev) => [...prev, response.data])
      
      // Emit via socket for real-time
      if (socket?.connected) {
        socket.emit('send_message', {
          conversationId,
          message: response.data,
        })
      }
      
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Failed to send message:', error)
      return { success: false, error }
    }
  }, [socket])

  // Create conversation
  const createConversation = useCallback(async (participantsData) => {
    try {
      const response = await chatApi.createConversation(participantsData)
      setConversations((prev) => [response.data, ...prev])
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Failed to create conversation:', error)
      return { success: false, error }
    }
  }, [])

  // Mark messages as read
  const markAsRead = useCallback(async (conversationId) => {
    try {
      await chatApi.markAsRead(conversationId)
      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === conversationId ? { ...conv, unreadCount: 0 } : conv
        )
      )
      return { success: true }
    } catch (error) {
      console.error('Failed to mark as read:', error)
      return { success: false, error }
    }
  }, [])

  // Set typing status
  const setTypingStatus = useCallback((conversationId, isTyping) => {
    if (socket?.connected) {
      socket.emit('typing', { conversationId, isTyping })
    }
  }, [socket])

  // Socket event listeners
  useEffect(() => {
    if (!socket) return

    const handleNewMessage = (data) => {
      if (data.conversationId === activeConversation?._id) {
        setMessages((prev) => [...prev, data.message])
      }
      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === data.conversationId
            ? { ...conv, lastMessage: data.message, unreadCount: conv.unreadCount + 1 }
            : conv
        )
      )
    }

    const handleTyping = (data) => {
      setTypingUsers((prev) => ({
        ...prev,
        [data.conversationId]: data.isTyping,
      }))
    }

    socket.on('new_message', handleNewMessage)
    socket.on('typing', handleTyping)

    return () => {
      socket.off('new_message', handleNewMessage)
      socket.off('typing', handleTyping)
    }
  }, [socket, activeConversation])

  // Initial fetch
  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  const value = {
    conversations,
    activeConversation,
    messages,
    loading,
    unreadCount,
    typingUsers,
    isConnected,
    setActiveConversation,
    fetchConversations,
    fetchMessages,
    sendMessage,
    createConversation,
    markAsRead,
    setTypingStatus,
  }

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within ChatProvider')
  }
  return context
}
