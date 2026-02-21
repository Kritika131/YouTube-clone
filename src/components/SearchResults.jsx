import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchDataFromApi } from '../utils/api'
import { Context } from '../context/contextApi'
import LeftNav from './LeftNav'
import SearchResultVideo from './SearchResultVideo'

const SearchResults = () => {
  const [result, setResult] = useState([]);
  const [continuation, setContinuation] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const {searchQuery} = useParams();
  const {loading, setLoading} = useContext(Context);
  const observerRef = useRef(null);

  const fetchSearchResults = useCallback(() => {
    setLoading(true);
    fetchDataFromApi(`search/?q=${searchQuery}`).then((res)=>{
      setResult(res?.contents || []);
      setContinuation(res?.continuation || null);
      setLoading(false);
    }).catch(()=>{
      setError("Failed to load search results.");
      setLoading(false);
    });
  }, [searchQuery, setLoading]);

  useEffect(()=>{
    document.getElementById("root").classList.remove("custom-h");
    setResult([]);
    setContinuation(null);
    setError(null);
    fetchSearchResults();
  },[searchQuery, fetchSearchResults])

  const loadMore = useCallback(() => {
    if(loadingMore || !continuation) return;
    setLoadingMore(true);
    fetchDataFromApi(`search/?q=${searchQuery}&continuation=${continuation}`).then((res)=>{
      setResult(prev => [...prev, ...(res?.contents || [])]);
      setContinuation(res?.continuation || null);
      setLoadingMore(false);
    }).catch(()=>{
      setLoadingMore(false);
    });
  },[continuation, loadingMore, searchQuery]);

  const lastElementRef = useCallback((node) => {
    if(loading || loadingMore) return;
    if(observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if(entries[0].isIntersecting && continuation) {
        loadMore();
      }
    }, { threshold: 0.1 });

    if(node) observerRef.current.observe(node);
  },[loading, loadingMore, continuation, loadMore]);

  const videos = result?.filter(item => item?.type === "video") || [];

  return (
    <div className='flex flex-row h-[calc(100%-56px)]'>
      <LeftNav />
      <div className="grow w-[calc(100%-240px)] h-full overflow-y-auto bg-black">
        {error ? (
          <div className="flex flex-col items-center justify-center h-full text-white">
            <svg className="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-lg font-semibold">{error}</p>
            <button
              onClick={() => { setError(null); fetchSearchResults(); }}
              className="mt-4 px-6 py-2 bg-red-600 rounded-full hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-2 p-5">
              {loading ? (
                Array.from({length: 6}).map((_, i) => (
                  <div key={i} className="flex mb-3 animate-pulse md:p-4">
                    <div className="h-28 lg:h-40 w-48 lg:w-64 rounded-xl bg-white/[0.1] flex-shrink-0" />
                    <div className="flex flex-col ml-6 flex-1 gap-3 justify-center">
                      <div className="h-5 bg-white/[0.1] rounded w-3/4" />
                      <div className="h-4 bg-white/[0.1] rounded w-1/2" />
                      <div className="flex items-center gap-3 mt-2">
                        <div className="h-8 w-8 rounded-full bg-white/[0.1]" />
                        <div className="h-3 bg-white/[0.1] rounded w-1/4" />
                      </div>
                    </div>
                  </div>
                ))
              ) : videos.length > 0 ? (
                videos.map((item, index) => (
                  <SearchResultVideo key={(item?.video?.videoId || '') + index} video={item?.video}/>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-white/[0.5]">
                  <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-lg">No results found for "{searchQuery}"</p>
                  <p className="text-sm mt-1">Try different keywords</p>
                </div>
              )}
            </div>

            {/* Scroll sentinel for infinite loading */}
            {!loading && videos.length > 0 && (
              <div ref={lastElementRef} className="flex justify-center py-6">
                {loadingMore && (
                  <div className="flex flex-col gap-2 px-5 w-full">
                    {Array.from({length: 3}).map((_, i) => (
                      <div key={`more-${i}`} className="flex mb-3 animate-pulse md:p-4">
                        <div className="h-28 w-48 rounded-xl bg-white/[0.1] flex-shrink-0" />
                        <div className="flex flex-col ml-6 flex-1 gap-3 justify-center">
                          <div className="h-5 bg-white/[0.1] rounded w-3/4" />
                          <div className="h-4 bg-white/[0.1] rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {!continuation && !loadingMore && (
                  <p className="text-white/[0.3] text-sm">No more results</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default SearchResults