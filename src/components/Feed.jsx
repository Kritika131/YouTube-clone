import { useContext, useEffect, useRef, useCallback } from "react"
import {Context} from "../context/contextApi"
import LeftNav from "./LeftNav"
import VideoCard from "./VideoCard"
import SkeletonCard from "./SkeletonCard"

const Feed = () => {

  const {loading, loadingMore, searchResults, error, continuation, loadMoreResults} = useContext(Context);
  const observerRef = useRef(null);

  useEffect(()=>{
    document.getElementById("root").classList.remove("custom-h")
  },[]);

  // IntersectionObserver callback for the sentinel element
  const lastElementRef = useCallback((node) => {
    if(loading || loadingMore) return;
    if(observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if(entries[0].isIntersecting && continuation) {
        loadMoreResults();
      }
    }, { threshold: 0.1 });

    if(node) observerRef.current.observe(node);
  },[loading, loadingMore, continuation, loadMoreResults]);

  const videos = searchResults?.filter(item => item?.type === "video") || [];

  return (
    <div className="flex flex-row h-[calc(100%-56px)]">
       <LeftNav/>
       <div className="grow w-[calc(100%-240px)] h-full overflow-y-auto bg-black">
        {error ? (
          <div className="flex flex-col items-center justify-center h-full text-white">
            <svg className="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-lg font-semibold">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-red-600 rounded-full hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-5">
              {loading ? (
                Array.from({length: 12}).map((_, i) => <SkeletonCard key={i} />)
              ) : videos.length > 0 ? (
                videos.map((item, index) => (
                  <VideoCard
                    key={item?.video?.videoId + index}
                    video={item?.video}
                  />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-white/[0.5]">
                  <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p className="text-lg">No videos found</p>
                  <p className="text-sm mt-1">Try selecting a different category</p>
                </div>
              )}
            </div>

            {/* Loading more indicator + scroll sentinel */}
            {!loading && videos.length > 0 && (
              <div ref={lastElementRef} className="flex justify-center py-6">
                {loadingMore && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-5 w-full">
                    {Array.from({length: 4}).map((_, i) => <SkeletonCard key={`more-${i}`} />)}
                  </div>
                )}
                {!continuation && !loadingMore && (
                  <p className="text-white/[0.3] text-sm">You've reached the end</p>
                )}
              </div>
            )}
          </>
        )}
       </div>
    </div>
  )
}

export default Feed