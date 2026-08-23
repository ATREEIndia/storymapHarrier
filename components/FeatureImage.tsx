import React from 'react'
import { responsive } from './Constants'
import Image from 'next/image'

type probs={
    src:string;
    caption?:string;
    customClass?:string

}

const FeatureImage = ({src,caption,customClass}:probs) => {
  return (
    <div className={` h-150 relative ${responsive}`}>
            <Image
             unoptimized
             loading="eager"
              src={src}
              alt="Northern Harrier bird"
              fill
              className="object-cover shadow-lg rounded-2xl"
            />
            <p className={`absolute bottom-3 bg-black/45  right-3 z-10 text-xs  opacity-70 px-2 text-white ${caption?"flex":"hidden"}`}>{caption??""}</p>
          </div>
  )
}

export default FeatureImage
