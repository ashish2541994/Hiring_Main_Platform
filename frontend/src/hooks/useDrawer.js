import { useState, useCallback } from 'react'

const useDrawer = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState)
  const [position, setPosition] = useState('right')

  const open = useCallback((drawerPosition = 'right') => {
    setPosition(drawerPosition)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  const toggle = useCallback((drawerPosition = 'right') => {
    setPosition(drawerPosition)
    setIsOpen((prev) => !prev)
  }, [])

  return {
    isOpen,
    position,
    open,
    close,
    toggle,
    setPosition,
    setIsOpen,
  }
}

export default useDrawer
