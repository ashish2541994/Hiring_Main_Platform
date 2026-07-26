import { Loader2 } from "lucide-react";

// ============================================
// LOADING SPINNER
// ============================================

export const LoadingSpinner = ({ size = 24, className = "" }) => {
  return <Loader2 className={`animate-spin ${className}`} size={size} />;
};

// Button loading state
export const ButtonLoader = ({ size = 16, className = "" }) => {
  return <Loader2 className={`animate-spin ${className}`} size={size} />;
};

// Full page loader
export const PageLoader = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <LoadingSpinner size={48} className="text-blue-600 mb-4" />
      <p className="text-gray-600 text-lg">{message}</p>
    </div>
  );
};

// ============================================
// SKELETON LOADERS
// ============================================

const SkeletonBase = ({ className, animate = true, style = {} }) => {
  return (
    <div
      className={`
        bg-gray-200 rounded
        ${animate ? "animate-pulse" : ""}
        ${className}
      `}
      style={style}
    />
  );
};

// Text skeleton
export const SkeletonText = ({ className = "", lines = 1 }) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBase
          key={i}
          className={`h-4 ${className}`}
          style={{ width: i === lines - 1 ? "70%" : "100%" }}
        />
      ))}
    </div>
  );
};

// Avatar skeleton
export const SkeletonAvatar = ({ size = 40, className = "" }) => {
  return (
    <SkeletonBase
      className={`rounded-full ${className}`}
      style={{ width: size, height: size }}
    />
  );
};

// Card skeleton
export const SkeletonCard = ({ className = "" }) => {
  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      <div className="flex items-start gap-4 mb-4">
        <SkeletonAvatar size={48} />
        <div className="flex-1 space-y-2">
          <SkeletonBase className="h-5 w-3/4" />
          <SkeletonBase className="h-4 w-1/2" />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  );
};

// Job card skeleton
export const SkeletonJobCard = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          <SkeletonBase className="h-6 w-3/4" />
          <SkeletonBase className="h-4 w-1/2" />
        </div>
        <SkeletonAvatar size={48} />
      </div>
      <SkeletonText lines={2} />
      <div className="flex gap-2 flex-wrap">
        <SkeletonBase className="h-6 w-20 rounded-full" />
        <SkeletonBase className="h-6 w-24 rounded-full" />
        <SkeletonBase className="h-6 w-16 rounded-full" />
      </div>
      <div className="flex items-center justify-between pt-4 border-t">
        <SkeletonBase className="h-4 w-24" />
        <SkeletonBase className="h-4 w-20" />
      </div>
    </div>
  );
};

// Company card skeleton
export const SkeletonCompanyCard = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <div className="flex items-center gap-4">
        <SkeletonAvatar size={64} />
        <div className="flex-1 space-y-2">
          <SkeletonBase className="h-6 w-3/4" />
          <SkeletonBase className="h-4 w-1/2" />
        </div>
      </div>
      <SkeletonText lines={2} />
      <div className="flex gap-4">
        <SkeletonBase className="h-4 w-16" />
        <SkeletonBase className="h-4 w-20" />
        <SkeletonBase className="h-4 w-16" />
      </div>
    </div>
  );
};

// User profile skeleton
export const SkeletonUserProfile = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <div className="flex items-center gap-6">
        <SkeletonAvatar size={80} />
        <div className="flex-1 space-y-3">
          <SkeletonBase className="h-7 w-1/2" />
          <SkeletonBase className="h-4 w-3/4" />
          <SkeletonBase className="h-4 w-1/3" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <SkeletonBase className="h-4 w-20" />
          <SkeletonBase className="h-5 w-full" />
        </div>
        <div className="space-y-2">
          <SkeletonBase className="h-4 w-16" />
          <SkeletonBase className="h-5 w-full" />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  );
};

// Application card skeleton
export const SkeletonApplicationCard = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          <SkeletonBase className="h-6 w-3/4" />
          <SkeletonBase className="h-4 w-1/2" />
        </div>
        <SkeletonBase className="h-8 w-24 rounded-full" />
      </div>
      <div className="flex items-center gap-4">
        <SkeletonAvatar size={40} />
        <div className="flex-1 space-y-2">
          <SkeletonBase className="h-4 w-1/3" />
          <SkeletonBase className="h-4 w-1/4" />
        </div>
      </div>
      <div className="flex items-center justify-between pt-4 border-t">
        <SkeletonBase className="h-4 w-32" />
        <SkeletonBase className="h-4 w-24" />
      </div>
    </div>
  );
};

// Message skeleton
export const SkeletonMessage = () => {
  return (
    <div className="flex gap-3 p-4">
      <SkeletonAvatar size={40} />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <SkeletonBase className="h-4 w-24" />
          <SkeletonBase className="h-3 w-16" />
        </div>
        <SkeletonBase className="h-16 w-full rounded-lg" />
      </div>
    </div>
  );
};

// Table row skeleton
export const SkeletonTableRow = ({ columns = 4 }) => {
  return (
    <div className="flex items-center gap-4 p-4 border-b">
      {Array.from({ length: columns }).map((_, i) => (
        <SkeletonBase
          key={i}
          className="h-5 flex-1"
          style={{ maxWidth: `${100 / columns}%` }}
        />
      ))}
    </div>
  );
};

// Table skeleton
export const SkeletonTable = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="flex items-center gap-4 p-4 bg-gray-50 border-b">
        {Array.from({ length: columns }).map((_, i) => (
          <SkeletonBase
            key={i}
            className="h-5 flex-1"
            style={{ maxWidth: `${100 / columns}%` }}
          />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonTableRow key={i} columns={columns} />
      ))}
    </div>
  );
};

// Stats card skeleton
export const SkeletonStatsCard = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <SkeletonBase className="h-4 w-20" />
      <SkeletonBase className="h-8 w-32" />
      <SkeletonBase className="h-2 w-full" />
    </div>
  );
};

// Form skeleton
export const SkeletonForm = ({ fields = 4 }) => {
  return (
    <div className="space-y-6">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <SkeletonBase className="h-4 w-24" />
          <SkeletonBase className="h-10 w-full" />
        </div>
      ))}
      <SkeletonBase className="h-10 w-32" />
    </div>
  );
};

// ============================================
// LOADING OVERLAY
// ============================================

export const LoadingOverlay = ({ message = "Loading...", show = true }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4">
        <LoadingSpinner size={48} className="text-blue-600" />
        <p className="text-gray-700">{message}</p>
      </div>
    </div>
  );
};

// ============================================
// PROGRESS BAR
// ============================================

export const ProgressBar = ({ progress = 0, className = "" }) => {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div
        className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
};

// Upload progress bar
export const UploadProgress = ({ progress, fileName, onCancel }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 truncate flex-1">
          {fileName}
        </span>
        <span className="text-sm text-gray-500 ml-2">{progress}%</span>
      </div>
      <ProgressBar progress={progress} />
      {onCancel && (
        <button
          onClick={onCancel}
          className="text-sm text-red-600 hover:text-red-700"
        >
          Cancel
        </button>
      )}
    </div>
  );
};

// ============================================
// WITH LOADING HOC
// ============================================

export const withLoading = (Component) => {
  return ({ isLoading, ...props }) => {
    if (isLoading) {
      return <PageLoader />;
    }
    return <Component {...props} />;
  };
};

// ============================================
// LOADING BUTTON
// ============================================

export const LoadingButton = ({
  children,
  isLoading,
  disabled,
  className = "",
  ...props
}) => {
  return (
    <button
      disabled={isLoading || disabled}
      className={`
        relative inline-flex items-center justify-center gap-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {isLoading && <ButtonLoader />}
      {children}
    </button>
  );
};
