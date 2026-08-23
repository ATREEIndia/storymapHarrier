

import Image from 'next/image'
import React from 'react'
import Title from './Title'
import { responsive } from './Constants'

type probs = {
    img_src: string,
    content: any,
    img_right:boolean
}


const Magazine_img_tsx = ({ img_src, content, img_right }: probs) => {
    return (
       <div className={`w-full ${responsive} mt-5`}>
           

            <div className="text-gray-800 text-lg leading-relaxed">
                <Image
                    src={img_src}
                    alt="Gangai in the grassland"
                    width={10}
                    height={10}
                    unoptimized
                    className={`${img_right?"xl:float-right":"xl:float-left"} h-auto w-full xl:w-[45%] ml-8 mb-4 object-cover`}
                />
                <div>
                    {content}
                </div>

               


            </div>
        </div>
    )
}

export default Magazine_img_tsx
