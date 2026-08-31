import React from 'react'
import Magazine_img_tsx from './Magazine_img_txt'
import Title from './Title'
import Image from 'next/image'

const Cafe_in_Grassland = () => {
   return (
        <Magazine_img_tsx
        is_center={true}
            img_right={true}
            img_src="https://atree-communication.s3.ap-south-1.amazonaws.com/storymap-harrier/photo/pre-roost.jpg"
            content={
                <div>
                   
                        <Title
                            topTitle=""
                            mainTitle="A cafe in the midst of a grassland"
                        />
                         
                        <p className='mt-3'>
                            Before settling down in their roost, we have observed harriers are found to congregate near bare patches nearby. This is akin to a cafe for men and women who gather for a quiet time before they retreat to their homes.<br /><br />



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

export default Cafe_in_Grassland
