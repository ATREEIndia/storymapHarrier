import React from 'react'

const HeaderVideo = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
        <video
          className="absolute inset-0 h-screen w-full object-cover"
          src="https://atree-communication.s3.ap-south-1.amazonaws.com/storymap-harrier/video/harrier3-1.mp4"
          autoPlay
          muted
          loop
          playsInline
        />

        {/* Content */}
        <div className="relative flex z-20 h-full items-center mt-50 lg:mt-0 lg:px-55 justify-left select-none p-8">
          <div className="text-left text-white">
            <h1 className="text-6xl font-black leading-none">A Life</h1>
            <p className="mt-2  font-bold text-3xl">Without Boundaries</p>
            <i className="mt-2 font-light">the Harrier chronicles</i>
          </div>
        </div>
      </div>
  )
}

export default HeaderVideo
