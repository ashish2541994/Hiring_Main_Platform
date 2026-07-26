import { useState, useCallback } from 'react'
import { X, ZoomIn, ZoomOut, RotateCw, Download } from 'lucide-react'
import { cn } from '../../utils/cn'
import Button from './Button'

const ImagePreview = ({
  src,
  alt,
  onClose,
  onDownload,
  className,
}) => {
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)

  const handleRotate = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360)
  }, [])

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 0.25, 3))
  }, [])

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5))
  }, [])

  const handleReset = useCallback(() => {
    setRotation(0)
    setZoom(1)
  }, [])

  const handleDownload = useCallback(() => {
    if (onDownload) {
      onDownload(src)
    } else {
      const link = document.createElement('a')
      link.href = src
      link.download = alt || 'image'
      link.click()
    }
  }, [src, alt, onDownload])

  return (
    <div className={cn('relative w-full h-full bg-black/90', className)}>
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleZoomOut}
          className="bg-white/10 hover:bg-white/20 text-white"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleZoomIn}
          className="bg-white/10 hover:bg-white/20 text-white"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRotate}
          className="bg-white/10 hover:bg-white/20 text-white"
        >
          <RotateCw className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDownload}
          className="bg-white/10 hover:bg-white/20 text-white"
        >
          <Download className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleReset}
          className="bg-white/10 hover:bg-white/20 text-white"
        >
          Reset
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="bg-white/10 hover:bg-white/20 text-white"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center justify-center w-full h-full p-8">
        <img
          src={src}
          alt={alt}
          style={{
            transform: `rotate(${rotation}deg) scale(${zoom})`,
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            transition: 'transform 0.3s ease',
          }}
          className="rounded-lg"
        />
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
        <span className="text-white text-sm">
          {Math.round(zoom * 100)}% • {rotation}°
        </span>
      </div>
    </div>
  )
}

export default ImagePreview
