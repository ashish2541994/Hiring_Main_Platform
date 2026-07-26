import { useState, useEffect, useRef, useCallback } from 'react'
import { io } from 'socket.io-client'

const useSocket = (url, options = {}) => {
  const socketRef = useRef(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState(null)

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return

    const socket = io(url, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      ...options,
    })

    socket.on('connect', () => {
      setIsConnected(true)
      setError(null)
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    socket.on('connect_error', (err) => {
      setError(err.message)
      setIsConnected(false)
    })

    socketRef.current = socket
  }, [url, options])

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
      setIsConnected(false)
    }
  }, [])

  const emit = useCallback((event, data) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data)
    }
  }, [])

  const on = useCallback((event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback)
    }
  }, [])

  const off = useCallback((event, callback) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback)
    }
  }, [])

  useEffect(() => {
    connect()
    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  return {
    socket: socketRef.current,
    isConnected,
    error,
    connect,
    disconnect,
    emit,
    on,
    off,
  }
}

export default useSocket
