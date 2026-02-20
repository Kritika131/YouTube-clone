import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import LeftNav from './LeftNav'

const WatchHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    document.getElementById("root").classList.remove("custom-h");
    const saved = JSON.parse(localStorage.getItem("watchHistory") || "[]");
    setHistory(saved.filter(item => item.title));
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("watchHistory");
    setHistory([]);
  };

  const removeItem = (id) => {
    const saved = JSON.parse(localStorage.getItem("watchHistory") || "[]");
    const updated = saved.filter(item => item.id !== id);
    localStorage.setItem("watchHistory", JSON.stringify(updated));
    setHistory(updated.filter(item => item.title));
  };

  return (
    <div className="flex flex-row h-[calc(100%-56px)]">
      <LeftNav />
      <div className="grow w-[calc(100%-240px)] h-full overflow-y-auto bg-black p-5">
        <div className="max-w-[800px] mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-white text-2xl font-bold">Watch History</h1>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-blue-400 text-sm hover:text-blue-300 transition-colors"
              >
                Clear all history
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-white/[0.5]">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg">No watch history yet</p>
              <p className="text-sm mt-1">Videos you watch will show up here</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {history.map((item) => (
                <div key={item.id} className="flex group rounded-xl hover:bg-white/[0.1] p-2 transition-colors">
                  <Link to={`/video/${item.id}`} className="flex flex-1 gap-4">
                    <div className="relative flex-shrink-0 h-24 w-40 rounded-lg overflow-hidden bg-white/[0.1]">
                      {item.thumbnail && (
                        <img className="h-full w-full object-cover" src={item.thumbnail} alt="" />
                      )}
                    </div>
                    <div className="flex flex-col justify-center overflow-hidden">
                      <span className="text-white font-semibold text-sm line-clamp-2">
                        {item.title}
                      </span>
                      {item.channelName && (
                        <span className="text-white/[0.5] text-xs mt-1">
                          {item.channelName}
                        </span>
                      )}
                    </div>
                  </Link>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-white/[0.3] hover:text-red-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity self-center px-3"
                    title="Remove from history"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WatchHistory