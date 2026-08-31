import React from 'react'
import Magazine_img_tsx from './Magazine_img_txt'
import Title from './Title'
import Image from 'next/image'

const What_does_it_tells = () => {
   return (
        <Magazine_img_tsx
        is_center={true}
            img_right={false}
            img_src="https://atree-communication.s3.ap-south-1.amazonaws.com/storymap-harrier/photo/microscope.png"
            content={
                <div>                 
                       
                        



                        <h1 className='font-semibold'>What does the cafe tell us about the harrier diet ? </h1>

                         <p className='mt-3'>
                            The harriers, in the process of digesting their food, would regurgitate and throw away the bones, hairs and feathers in the form of pellets. The pellet contents open up a whole new world. Under a microscope, it is astonishing  to see the discarded remains, to see what species they belong to.<br/><br/> The guts of small birds which the harrier must have eaten reveal undigested grains. Some of the grains can be sown in pots to understand what the smaller birds have been eating.<br /><br />



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

export default What_does_it_tells
