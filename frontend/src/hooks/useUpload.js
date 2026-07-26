import { useState, useCallback } from 'react'

const useUpload = (maxFileSize = 5 * 1024 * 1024, allowedTypes = []) => {
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)

  const validateFile = useCallback((file) => {
    if (maxFileSize && file.size > maxFileSize) {
      setError(`File size exceeds ${maxFileSize / 1024 / 1024}MB limit`)
      return false
    }

    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      setError(`File type ${file.type} is not allowed`)
      return false
    }

    setError(null)
    return true
  }, [maxFileSize, allowedTypes])

  const handleFileSelect = useCallback((selectedFiles) => {
    const validFiles = Array.from(selectedFiles).filter(validateFile)
    setFiles((prev) => [...prev, ...validFiles])

    // Generate previews for images
    validFiles.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreviews((prev) => [...prev, reader.result])
        }
        reader.readAsDataURL(file)
      }
    })
  }, [validateFile])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    const droppedFiles = e.dataTransfer.files
    handleFileSelect(droppedFiles)
  }, [handleFileSelect])

  const removeFile = useCallback((index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const clearFiles = useCallback(() => {
    setFiles([])
    setPreviews([])
    setError(null)
  }, [])

  const uploadFiles = useCallback(async (uploadFunction) => {
    if (files.length === 0) return

    setUploading(true)
    setProgress(0)
    setError(null)

    try {
      await uploadFunction(files, (progressValue) => {
        setProgress(progressValue)
      })
      clearFiles()
    } catch (err) {
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }, [files, uploadFunction, clearFiles])

  return {
    files,
    previews,
    uploading,
    progress,
    error,
    handleFileSelect,
    handleDrop,
    removeFile,
    clearFiles,
    uploadFiles,
    setError,
  }
}

export default useUpload
