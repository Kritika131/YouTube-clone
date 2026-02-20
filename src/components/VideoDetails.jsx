import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ReactPlayer from "react-player/youtube"
import { BsFillCheckCircleFill } from 'react-icons/bs'
import { AiOutlineLike } from 'react-icons/ai'
import {abbreviateNumber} from "js-abbreviation-number"
import { fetchDataFromApi } from '../utils/api'
import { Context } from '../context/contextApi'
import SuggetionVideoCard from './SuggetionVideoCard'
import Comments from './Comments'


const VideoDetails = () => {
  const [video,setVideo] =useState();
  const [relatedVideo,setRelatedVideo] = useState();
  const [error, setError] = useState(null);
  const {id} =useParams();

  const {setLoading} =useContext(Context);

  useEffect(()=>{
    document.getElementById("root").classList.add("custom-h");
    setError(null);
    fetchVideoDetails();
    fetchRelatedVideos();
    // Save to watch history
    const history = JSON.parse(localStorage.getItem("watchHistory") || "[]");
    const existingIdx = history.findIndex(item => item.id === id);
    if(existingIdx > -1) history.splice(existingIdx, 1);
    history.unshift({ id, timestamp: Date.now() });
    localStorage.setItem("watchHistory", JSON.stringify(history.slice(0, 50)));
  },[id])

  const fetchVideoDetails =()=>{
      setLoading(true);
      fetchDataFromApi(`video/details/?id=${id}`).then((res)=>{
        setVideo(res);
        setLoading(false);
        // Update watch history with title/thumbnail after data loads
        const history = JSON.parse(localStorage.getItem("watchHistory") || "[]");
        const idx = history.findIndex(item => item.id === id);
        if(idx > -1) {
          history[idx] = {
            ...history[idx],
            title: res?.title,
            thumbnail: res?.thumbnails?.[0]?.url,
            channelName: res?.author?.title,
          };
          localStorage.setItem("watchHistory", JSON.stringify(history));
        }
      }).catch(()=>{
        setError("Failed to load video details.");
        setLoading(false);
      })
  }

  const fetchRelatedVideos=()=>{
    fetchDataFromApi(`video/related-contents/?id=${id}`).then((res)=>{
      setRelatedVideo(res);
    }).catch(()=>{
      // Related videos failing is non-critical
    })
  }

  if(error) {
    return (
      <div className="flex justify-center items-center h-[calc(100%-56px)] bg-black">
        <div className="flex flex-col items-center text-white">
          <svg className="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-lg font-semibold">{error}</p>
          <button
            onClick={() => { setError(null); fetchVideoDetails(); fetchRelatedVideos(); }}
            className="mt-4 px-6 py-2 bg-red-600 rounded-full hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center flex-row h-[calc(100%-56px)] bg-black">
      <div className="w-full max-w-[1280px] flex flex-col lg:flex-row">
        <div className="flex flex-col lg:w-[calc(100%-350px)] xl:w-[calc(100%-400px)] px-4 py-3 lg:py-6 overflow-auto">
          <div className="h-[200px] md:h-[400px] lg:h-[400px] xl:h-[550px] ml-[-16px] lg:ml-0 mr-[-16px] lg:mr-0">
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${id}`}
              controls
              width="100%"
              height="100%"
              style={{backgroundColor:"#000000"}}
              playing={true}
            />
          </div>
          <div className="text-white font-bold text-sm md:text-xl mt-4 line-clamp-2">
            {video?.title}
          </div>
          <div className="flex justify-between flex-col md:flex-row mt-4">
            <div className="flex items-center justify-center">
              <div className="flex items-start">
                <div className="flex h-11 w-11 rounded-full overflow-hidden">
                  <img className='h-full w-full object-cover' src={video?.author?.avatar?.[0]?.url} alt="" />
                </div>
              </div>
              <div className="flex flex-col ml-3">
                <div className="text-white text-md font-semibold flex items-center">
                  {video?.author?.title}
                  {video?.author?.badges?.[0]?.type==="VERIFIED_CHANNEL" && (
                    <BsFillCheckCircleFill className='text-white/[0.5] text-[12px] ml-1'/>
                  )}
                </div>
                <div className="text-white/[0.7] text-sm ">
                  {video?.author?.stats?.subscribersText}
                </div>
              </div>
              <div className="flex items-center justify-center h-9 px-5 rounded-3xl bg-black text-white border border-white/[0.1] ml-8 mt-1 hover:bg-white/[0.1] cursor-pointer transition-all" >
                <h1>Join</h1>
              </div>
              <div className="flex items-center justify-center h-9 px-5 rounded-3xl mt-1 bg-white  ml-3 hover:bg-white/[0.7] cursor-pointer transition-all" >
                <h1>Subscribe</h1>
              </div>
            </div>
            <div className="flex text-white mt-4 md:mt-0">
              <div className="flex items-center justify-center h-11 px-6 rounded-3xl bg-white/[0.15]">
                <AiOutlineLike className='text-xl text-white mr-2'/>
                <span>{`${abbreviateNumber(video?.stats?.likes,2)} Likes`}</span>
              </div>
              <div className="flex items-center justify-center h-11 px-6 rounded-3xl bg-white/[0.15] ml-4">
                <span>{`${abbreviateNumber(video?.stats?.views,2)} Views`}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {video?.description && (
            <div className="mt-4 p-4 bg-white/[0.1] rounded-xl">
              <p className="text-white/[0.8] text-sm whitespace-pre-line line-clamp-4 hover:line-clamp-none cursor-pointer transition-all">
                {video.description}
              </p>
            </div>
          )}

          {/* Comments Section */}
          <Comments videoId={id} />
        </div>
        <div className="flex flex-col py-6 px-4 overflow-y-auto lg:w-[350px] xl:w-[400px]">
          {relatedVideo?.contents?.map((item,idx)=>{
            if(item?.type!=="video") return false;
            return (
              <SuggetionVideoCard key={idx} video ={item?.video}/>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default VideoDetails