import { useState, useRef, useCallback } from 'react'
import { Upload, X, FileText, AlertCircle, Check, Download, Replace, ExternalLink } from 'lucide-react'
import { validateResumeFile } from '../../utils/validation'

export const ResumeUpload = ({
  value,
  onChange,
  maxSize = 10 * 1024 * 1024, // 10MB
  allowedTypes = ['application/pdf'],
  className = '',
  error,
  helperText,
  showPreview = true,
  ...props
}) => {
  const [fileName, setFileName] = useState(null)
  const [fileSize, setFileSize] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const handleFileSelect = useCallback((file) => {
    const validation = validateResumeFile(file)
    
    if (!validation.isValid) {
      return validation
    }

    if (file.size > maxSize) {
      return { isValid: false, message: `File size cannot exceed ${maxSize / 1024 / 1024}MB` }
    }

    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, message: 'Only PDF files are allowed' }
    }

    setFileName(file.name)
    setFileSize(file.size)
    onChange(file)
    return { isValid: true }
  }, [maxSize, allowedTypes, onChange])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }, [handleFileSelect])

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleInputChange = useCallback((e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }, [handleFileSelect])

  const handleRemove = useCallback(() => {
    setFileName(null)
    setFileSize(null)
    onChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [onChange])

  const handleReplace = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }, [])

  const handleDownload = useCallback(() => {
    if (value) {
      const url = typeof value === 'string' ? value : URL.createObjectURL(value)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName || 'resume.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }, [value, fileName])

  const handleClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }, [])

  const handlePreview = useCallback(() => {
    if (value) {
      const url = typeof value === 'string' ? value : URL.createObjectURL(value)
      window.open(url, '_blank')
    }
  }, [value])

  return (
    <div className={`space-y-2 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleInputChange}
        className="hidden"
        {...props}
      />

      {/* Upload Area / Preview */}
      {!fileName ? (
        <div
          onClick={handleClick}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-lg p-8
            flex flex-col items-center justify-center cursor-pointer
            transition-colors
            ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
            ${error ? 'border-red-500 bg-red-50' : ''}
          `}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <FileText className="w-6 h-6 text-gray-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                PDF only (max {maxSize / 1024 / 1024}MB)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative group">
          {/* File Preview Card */}
          <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-start gap-4">
              {/* File Icon */}
              <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-red-600" />
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {fileName}
                </p>
                <p className="text-xs text-gray-500">
                  {fileSize && formatFileSize(fileSize)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePreview}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Preview resume"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Download resume"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleReplace}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Replace resume"
                >
                  <Replace className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove resume"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="mt-4">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600">{uploadProgress}%</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}

      {/* Success Message */}
      {fileName && !error && (
        <p className="text-sm text-green-600 flex items-center gap-1">
          <Check className="w-4 h-4" />
          Resume uploaded successfully
        </p>
      )}
    </div>
  )
}

// Document Upload Component (for other document types)
export const DocumentUpload = ({
  value,
  onChange,
  maxSize = 10 * 1024 * 1024,
  allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  className = '',
  error,
  helperText,
  ...props
}) => {
  const [fileName, setFileName] = useState(null)
  const [fileSize, setFileSize] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const handleFileSelect = useCallback((file) => {
    if (file.size > maxSize) {
      return { isValid: false, message: `File size cannot exceed ${maxSize / 1024 / 1024}MB` }
    }

    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, message: 'Only PDF and Word documents are allowed' }
    }

    setFileName(file.name)
    setFileSize(file.size)
    onChange(file)
    return { isValid: true }
  }, [maxSize, allowedTypes, onChange])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }, [handleFileSelect])

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleInputChange = useCallback((e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }, [handleFileSelect])

  const handleRemove = useCallback(() => {
    setFileName(null)
    setFileSize(null)
    onChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [onChange])

  const handleClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }, [])

  return (
    <div className={`space-y-2 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleInputChange}
        className="hidden"
        {...props}
      />

      {!fileName ? (
        <div
          onClick={handleClick}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-lg p-8
            flex flex-col items-center justify-center cursor-pointer
            transition-colors
            ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
            ${error ? 'border-red-500 bg-red-50' : ''}
          `}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <FileText className="w-6 h-6 text-gray-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                PDF or Word (max {maxSize / 1024 / 1024}MB)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative group">
          <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {fileName}
                </p>
                <p className="text-xs text-gray-500">
                  {fileSize && formatFileSize(fileSize)}
                </p>
              </div>
              <button
                type="button"
                onClick={handleRemove}
                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
}
