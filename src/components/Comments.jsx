import React, { useState, useEffect } from 'react'

const Comments = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [userName, setUserName] = useState(
    () => localStorage.getItem("yt_username") || ""
  );
  const [showNameInput, setShowNameInput] = useState(false);

  useEffect(() => {
    const allComments = JSON.parse(localStorage.getItem("yt_comments") || "{}");
    setComments(allComments[videoId] || []);
  }, [videoId]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    if (!userName.trim()) {
      setShowNameInput(true);
      return;
    }

    const comment = {
      id: Date.now(),
      text: newComment.trim(),
      author: userName.trim(),
      timestamp: new Date().toISOString(),
    };

    const allComments = JSON.parse(localStorage.getItem("yt_comments") || "{}");
    const videoComments = allComments[videoId] || [];
    const updated = [comment, ...videoComments];
    allComments[videoId] = updated;
    localStorage.setItem("yt_comments", JSON.stringify(allComments));
    localStorage.setItem("yt_username", userName.trim());

    setComments(updated);
    setNewComment("");
  };

  const handleDeleteComment = (commentId) => {
    const allComments = JSON.parse(localStorage.getItem("yt_comments") || "{}");
    const videoComments = (allComments[videoId] || []).filter(c => c.id !== commentId);
    allComments[videoId] = videoComments;
    localStorage.setItem("yt_comments", JSON.stringify(allComments));
    setComments(videoComments);
  };

  const getTimeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  return (
    <div className="mt-6">
      <h3 className="text-white font-bold text-lg mb-4">
        {comments.length} Comment{comments.length !== 1 ? 's' : ''}
      </h3>

      {/* Comment input */}
      <div className="flex flex-col gap-3 mb-6">
        {showNameInput && (
          <input
            type="text"
            className="bg-transparent border-b border-white/[0.3] text-white outline-none py-2 px-1 focus:border-blue-500 transition-colors"
            placeholder="Enter your name first..."
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && userName.trim()) {
                setShowNameInput(false);
                handleAddComment();
              }
            }}
            autoFocus
          />
        )}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm">
            {userName ? userName[0].toUpperCase() : "?"}
          </div>
          <div className="flex-1">
            <input
              type="text"
              className="w-full bg-transparent border-b border-white/[0.3] text-white outline-none py-2 px-1 focus:border-blue-500 transition-colors"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
            />
            <div className="flex justify-end gap-3 mt-2">
              {newComment && (
                <button
                  className="text-white/[0.7] text-sm px-4 py-1.5 rounded-full hover:bg-white/[0.1] transition-colors"
                  onClick={() => setNewComment("")}
                >
                  Cancel
                </button>
              )}
              <button
                className={`text-sm px-4 py-1.5 rounded-full transition-colors ${
                  newComment.trim()
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-white/[0.1] text-white/[0.3] cursor-not-allowed"
                }`}
                onClick={handleAddComment}
                disabled={!newComment.trim()}
              >
                Comment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments list */}
      <div className="flex flex-col gap-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3 group">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-teal-700 flex items-center justify-center text-white font-bold text-sm">
              {comment.author[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-white text-sm font-semibold">
                  @{comment.author}
                </span>
                <span className="text-white/[0.5] text-xs">
                  {getTimeAgo(comment.timestamp)}
                </span>
              </div>
              <p className="text-white/[0.9] text-sm mt-1">{comment.text}</p>
            </div>
            <button
              className="text-white/[0.3] hover:text-red-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity self-start mt-1"
              onClick={() => handleDeleteComment(comment.id)}
              title="Delete comment"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments