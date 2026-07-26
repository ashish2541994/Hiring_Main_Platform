import { lazy, Suspense } from 'react'
import { Loader } from '../components/ui/Loader'

// Lazy load pages with loading state
export const lazyPage = (importFn) => {
  const LazyComponent = lazy(importFn)
  return (props) => (
    <Suspense fallback={<Loader fullScreen />}>
      <LazyComponent {...props} />
    </Suspense>
  )
}

// Lazy load components with custom fallback
export const lazyComponent = (importFn, FallbackComponent = Loader) => {
  const LazyComponent = lazy(importFn)
  return (props) => (
    <Suspense fallback={<FallbackComponent />}>
      <LazyComponent {...props} />
    </Suspense>
  )
}

// Preload component
export const preloadComponent = (importFn) => {
  const componentPromise = importFn()
  componentPromise.catch((error) => {
    console.error('Failed to preload component:', error)
  })
  return componentPromise
}

// Prefetch component (for future navigation)
export const prefetchComponent = (importFn) => {
  return () => {
    const componentPromise = importFn()
    componentPromise.catch((error) => {
      console.error('Failed to prefetch component:', error)
    })
  }
}
