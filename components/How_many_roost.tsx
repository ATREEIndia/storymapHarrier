import React from 'react'
import Magazine_img_tsx from './Magazine_img_txt'
import Title from './Title'

const How_many_roost = () => {
    return (
        <Magazine_img_tsx
            img_right={true}
            video_src="https://atree-communication.s3.amazonaws.com/storymap-harrier/video/roost.mp4"
            content={
                <div>

                    <Title
                        topTitle=""
                        mainTitle="How many in a roost?"
                    />
                    <p className='mt-3'>
                        Most evenings, we spend time scanning wide areas to map harrier movements and find their roosting place where harriers gather. Finding one is a roost would be very important; to find out it tells us which species visit our areas, what would be their maturity? What would be the male-female ratios, and their numbers each day and how would they change over months and seasons?<br /><br />

                        Evenings during winter are balmy; the sky is lit and the grassland makes a wonderful scene, but for the harrier surveyor it is a case of jotting down as much information during a small window. It is a bit like taking attendance at school, checking how many harriers have turned up, each day, across the season. Keeping a count gives us an idea if their numbers are holding steady or slipping.

                    </p>
                 


                </div>}
        />
        //     <div className={`w-full ${responsive} flex flex-col justify-center `}>



        //             <div className="text-gray-800 text-lg leading-relaxed flex items-center justify-center flex-col xl:flex-row">
        //                  <Image
        //                     src="https://atree-communication.s3.ap-south-1.amazonaws.com/storymap-harrier/photo/prey_species.png"
        //                     alt="Gangai in the grassland"
        //                     width={10}
        //                     height={10}
        //                     unoptimized
        //                     className="float-left h-auto w-full xl:w-[45%] ml-8 mb-4object-cover"
        //                 />

        //                 </div>






        //             </div>
        //         </div>
    )
}

export default How_many_roost
