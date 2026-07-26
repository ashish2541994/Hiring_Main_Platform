import { useState, useRef, useCallback } from 'react'
import { Upload, X, Image as ImageIcon, AlertCircle, Check, Replace } from 'lucide-react'
import { validateImageFile } from '../../utils/validation'

export const ImageUpload = ({
  value,
  onChange,
  maxSize = 5 * 1024 * 1024, // 5MB
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  className = '',
  error,
  helperText,
  showPreview = true,
  aspectRatio,
  ...props
}) => {
  const [preview, setPreview] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileSelect = useCallback((file) => {
    const validation = validateImageFile(file)
    
    if (!validation.isValid) {
      return validation
    }

    if (file.size > maxSize) {
      return { isValid: false, message: `File size cannot exceed ${maxSize / 1024 / 1024}MB` }
    }

    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, message: 'Only JPG, PNG, and WEBP images are allowed' }
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target.result)
    }
    reader.readAsDataURL(file)

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
    setPreview(null)
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
        accept="image/jpeg,image/png,image/webp"
        onChange={handleInputChange}
        className="hidden"
        {...props}
      />

      {/* Upload Area / Preview */}
      {!preview ? (
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
              <ImageIcon className="w-6 h-6 text-gray-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                JPG, PNG, or WEBP (max {maxSize / 1024 / 1024}MB)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative group">
          {/* Preview Image */}
          <div className="relative rounded-lg overflow-hidden border-2 border-gray-200">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-auto object-cover"
              style={{ aspectRatio }}
            />
            
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleReplace}
                className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                title="Replace image"
              >
                <Replace className="w-5 h-5 text-gray-700" />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                title="Remove image"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-3">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <span className="text-xs text-white">{uploadProgress}%</span>
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
      {preview && !error && (
        <p className="text-sm text-green-600 flex items-center gap-1">
          <Check className="w-4 h-4" />
          Image uploaded successfully
        </p>
      )}
    </div>
  )
}

// Avatar Upload Component
export const AvatarUpload = ({ value, onChange, size = 120, className = '', ...props }) => {
  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div className="relative">
        <div
          className="rounded-full overflow-hidden border-4 border-white shadow-lg"
          style={{ width: size, height: size }}
        >
          {value ? (
            <img
              src={typeof value === 'string' ? value : URL.createObjectURL(value)}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>
      </div>
      <ImageUpload
        value={value}
        onChange={onChange}
        className="w-full"
        {...props}
      />
    </div>
  )
}

// Company Logo Upload Component
export const LogoUpload = ({ value, onChange, className = '', ...props }) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Company Logo
      </label>
      <ImageUpload
        value={value}
        onChange={onChange}
        aspectRatio="1/1"
        helperText="Recommended: Square image (1:1 ratio)"
        {...props}
      />
    </div>
  )
}

// Cover Image Upload Component
export const CoverImageUpload = ({ value, onChange, className = '', ...props }) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Cover Image
      </label>
      <ImageUpload
        value={value}
        onChange={onChange}
        aspectRatio="16/9"
        helperText="Recommended: 16:9 ratio (1920x1080)"
        {...props}
      />
    </div>
  )
}

// Multiple Image Upload Component
export const MultipleImageUpload = ({
  value = [],
  onChange,
  maxImages = 5,
  className = '',
  error,
  helperText,
  ...props
}) => {
  const [previews, setPreviews] = useState([])

  const handleAddImage = useCallback((file) => {
    if (value.length >= maxImages) {
      return { isValid: false, message: `Maximum ${maxImages} images allowed` }
    }

    const validation = validateImageFile(file)
    if (!validation.isValid) {
      return validation
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviews(prev => [...prev, e.target.result])
    }
    reader.readAsDataURL(file)

    onChange([...value, file])
    return { isValid: true }
  }, [value, maxImages, onChange])

  const handleRemoveImage = useCallback((index) => {
    const newValue = value.filter((_, i) => i !== index)
    const newPreviews = previews.filter((_, i) => i !== index)
    onChange(newValue)
    setPreviews(newPreviews)
  }, [value, previews, onChange])

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Existing Images */}
        {previews.map((preview, index) => (
          <div key={index} className="relative group aspect-square">
            <img
              src={preview}
              alt={`Image ${index + 1}`}
              className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        ))}

        {/* Add Image Button */}
        {value.length < maxImages && (
          <ImageUpload
            value={null}
            onChange={handleAddImage}
            className="aspect-square"
            showPreview={false}
          />
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <p className="text-sm text-gray-500">
          {helperText} ({value.length}/{maxImages})
        </p>
      )}
    </div>
  )
}
