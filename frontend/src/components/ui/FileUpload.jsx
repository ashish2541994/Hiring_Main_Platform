import { useState, useCallback } from 'react'
import { Upload, X, File, Image as ImageIcon, FileText } from 'lucide-react'
import { cn } from '../../utils/cn'
import Button from './Button'
import ProgressBar from './ProgressBar'

const FileUpload = ({
  onFileSelect,
  onFileRemove,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB
  allowedTypes = ['image/*', 'application/pdf', '.doc', '.docx'],
  accept,
  multiple = false,
  className,
}) => {
  const [files, setFiles] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }, [])

  const handleFileInput = useCallback((e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }, [])

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList)
    
    // Validate file count
    if (multiple && files.length + newFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`)
      return
    }

    // Validate each file
    const validFiles = newFiles.filter((file) => {
      if (file.size > maxSize) {
        alert(`File ${file.name} exceeds ${maxSize / 1024 / 1024}MB limit`)
        return false
      }
      return true
    })

    // Create previews for images
    const filesWithPreviews = validFiles.map((file) => {
      const preview = file.type.startsWith('image/') ? URL.createObjectURL(file) : null
      return {
        file,
        preview,
        id: Math.random().toString(36).substr(2, 9),
        progress: 0,
      }
    })

    setFiles((prev) => [...prev, ...filesWithPreviews])
    onFileSelect?.(validFiles)
  }

  const removeFile = useCallback((fileId) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === fileId)
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview)
      }
      const newFiles = prev.filter((f) => f.id !== fileId)
      onFileRemove?.(fileToRemove.file)
      return newFiles
    })
  }, [onFileRemove])

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="w-8 h-8" />
    } else if (file.type === 'application/pdf') {
      return <FileText className="w-8 h-8" />
    }
    return <File className="w-8 h-8" />
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200',
          dragActive
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50 hover:bg-muted/50'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          onChange={handleFileInput}
          accept={accept || allowedTypes.join(',')}
          multiple={multiple}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center justify-center"
        >
          <Upload className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground mb-2">
            {dragActive ? 'Drop files here' : 'Drag & drop files here'}
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            or click to browse
          </p>
          <Button variant="outline" size="sm" type="button">
            Select Files
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            Max {maxFiles} files, {formatFileSize(maxSize)} each
          </p>
        </label>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((fileObj) => (
            <div
              key={fileObj.id}
              className="flex items-center p-3 bg-muted rounded-lg group"
            >
              {fileObj.preview ? (
                <img
                  src={fileObj.preview}
                  alt={fileObj.file.name}
                  className="w-12 h-12 object-cover rounded mr-3"
                />
              ) : (
                <div className="w-12 h-12 bg-muted-foreground/10 rounded flex items-center justify-center mr-3">
                  {getFileIcon(fileObj.file)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {fileObj.file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(fileObj.file.size)}
                </p>
                {uploadProgress[fileObj.id] !== undefined && (
                  <ProgressBar
                    value={uploadProgress[fileObj.id]}
                    className="mt-2 h-1"
                  />
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(fileObj.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FileUpload
