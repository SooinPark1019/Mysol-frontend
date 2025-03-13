export function PostSkeleton() {
    return (
      <div className="overflow-hidden transition-all hover:shadow-md">
        <div className="p-4 pb-0">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
        </div>
        <div className="p-4">
          <div className="h-4 bg-gray-200 rounded w-full mb-2" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
        <div className="p-4 pt-0 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-gray-200" />
            <div className="h-4 bg-gray-200 rounded w-20" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-4 bg-gray-200 rounded w-8" />
            <div className="h-4 bg-gray-200 rounded w-8" />
            <div className="h-4 bg-gray-200 rounded w-8" />
          </div>
        </div>
      </div>
    )
  }
  
  