

import Image from 'next/image'

import React from 'react'
import Title from './Title'
import { responsive } from './Constants'

type probs = {
    img_src?: string,
    content: any,
    img_right: boolean,
    custom_class?: string,
    is_center?: boolean
    video_src?: string
}


const Magazine_img_tsx = ({ img_src, video_src, content, img_right, custom_class, is_center }: probs) => {
    return (
        <div className={`${custom_class}  w-full ${responsive} mt-5`}>


            <div className={`text-gray-800 text-lg leading-relaxed ${img_right ? "xl:flex-row-reverse" : ""} ${is_center ? "xl:flex xl:flex-row xl:gap-5 xl:items-center" : ""} `}>
                <Image
                    src={img_src ?? "https://atree-communication.s3.amazonaws.com/storymap-harrier/photo/forest_fire.jpg"}
                    alt="Gangai in the grassland"
                    width={1200} height={800}
                    unoptimized
                    className={`${img_src ? "flex" : "hidden"}  w-full h-auto mb-4  object-cover xl:w-[45%] ${img_right ? 'xl:float-right xl:ml-8' : 'xl:float-left xl:mr-8'}`} />

                <video
                    autoPlay
                    muted
                    playsInline
                    loop
                    src={video_src}
                    width={1200}
                    height={800}
                    className={`${video_src ? "flex" : "hidden"
                        } w-full h-auto mb-4 object-cover xl:w-[45%] ${img_right ? "xl:float-right xl:ml-8" : "xl:float-left xl:mr-8"
                        }`}
                />

                <div>{content}</div>
            </div>
        </div>
    )
}

export default Magazine_img_tsx
