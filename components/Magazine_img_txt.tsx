

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
    caption?:string
}


const Magazine_img_tsx = ({ img_src, video_src, content, img_right, custom_class, is_center, caption }: probs) => {
    return (
        <div className={`${custom_class}  w-full ${responsive} mt-5`}>
            <div className={`w-full h-full flex items-center justify-center gap-5 flex-col md:flex-row ${img_right?"":"md:flex-row-reverse"}`}>
                <div className={`w-9/10 `}>{content}</div>

                <div className='w-full aspect-video flex flex-col gap-2 items-center'>
                    <div className='w-full h-full relative flex flex-col'>
                        {img_src && (
                            <Image
                                unoptimized
                                src={img_src}
                                alt="Gangai in the grassland"
                                fill
                                className='object-contain'
                            />
                        )}

                        {video_src && (
                            <video
                                autoPlay
                                muted
                                playsInline
                                loop
                                src={video_src}
                                className='absolute inset-0 w-full h-full object-cover'
                            />
                        )}

                        
                    </div>
                    <span className='text-center text-xs md:w-1/2  '><i className='md:px-0 '>{caption}</i></span>
                </div>
            </div>

            {/* <div className={`text-gray-800 text-lg leading-relaxed ${img_right ? "xl:flex-row-reverse" : ""} ${is_center ? "xl:flex xl:flex-row xl:gap-5 xl:items-center" : ""} `}>
              
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
            </div> */}

            {/* <div className={`text-gray-800 hidden text-lg leading-relaxed ${img_right ? "xl:flex-row-reverse" : ""} ${is_center ? "xl:flex xl:flex-row xl:gap-5 xl:items-center" : ""} `}>

                <figure
                    className={`${img_src || video_src ? "block" : "hidden"} w-full xl:w-[75%] mb-4 ${img_right ? 'xl:float-right xl:ml-8' : 'xl:float-left xl:mr-8'}`}
                >
                    <Image
                        src={img_src ?? "https://atree-communication.s3.amazonaws.com/storymap-harrier/photo/forest_fire.jpg"}
                        alt="Gangai in the grassland"
                        width={1200} height={800}
                        unoptimized
                        className={`${img_src ? "block" : "hidden"} w-full h-auto object-cover`}
                    />

                    <video
                        autoPlay
                        muted
                        playsInline
                        loop
                        src={video_src}
                        width={1200}
                        height={800}
                        className={`${video_src ? "block" : "hidden"} w-full h-auto object-cover`}
                    />


                    <figcaption className="text-sm text-gray-500 mt-2 text-center">
                        caption
                    </figcaption>

                </figure>

                <div>{content}</div>
            </div> */}

        </div>
    )
}

export default Magazine_img_tsx
