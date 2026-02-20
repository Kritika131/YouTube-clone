import React from 'react'

const SkeletonCard = () => {
  return (
    <div className="flex flex-col mb-8 animate-pulse">
      <div className="relative h-48 md:h-40 rounded-xl bg-white/[0.1]" />
      <div className="flex mt-3">
        <div className="flex-shrink-0 h-9 w-9 rounded-full bg-white/[0.1]" />
        <div className="flex flex-col ml-3 flex-1 gap-2">
          <div className="h-4 bg-white/[0.1] rounded w-full" />
          <div className="h-4 bg-white/[0.1] rounded w-3/4" />
          <div className="h-3 bg-white/[0.1] rounded w-1/2 mt-1" />
          <div className="h-3 bg-white/[0.1] rounded w-2/5" />
        </div>
      </div>
    </div>
  )
}

export default SkeletonCard