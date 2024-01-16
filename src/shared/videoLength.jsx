import React from 'react'
import moment from "moment"

const VideoLength = ({time}) => {
    const videoLenSec = moment().startOf("day").seconds(time).format("H:mm:ss")
  return (
    <div className='absolute bottom-2 right-2 bg-blackpy-1 px-2 text-white text-xs rounded-md '>
        {videoLenSec}
    </div>
  )
}

export default VideoLength