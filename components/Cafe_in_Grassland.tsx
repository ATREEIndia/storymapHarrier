import React from 'react'
import Magazine_img_tsx from './Magazine_img_txt'
import Title from './Title'
import Image from 'next/image'

const Cafe_in_Grassland = () => {
   return (
    <div>
 <Magazine_img_tsx
        is_center={true}
            img_right={false}
            img_src="https://atree-communication.s3.ap-south-1.amazonaws.com/storymap-harrier/photo/pre-roost.jpg"
            content={
                <div>
                   
                        <Title
                            topTitle=""
                            mainTitle="A cafe in the midst of a grassland"
                        />
                         
                        <p className='mt-3'>
                            After a day of flying and foraging, birds head to their roost, a chosen place to spend their night. For harriers, that place is the grasslands. Before settling down in their roost, we observed that harriers habitually congregated near bare patches close by. This is akin to a cafe for men and women who gather for a quiet time before they retreat to their homes. 
 



                        </p>
                       
                        



                       


                  

                </div>}
        />


         <Magazine_img_tsx
        is_center={true}
            img_right={true}
            img_src="https://atree-communication.s3.amazonaws.com/storymap-harrier/photo/pellects_collected.JPG"
            content={
                <div>
                   
                        
                         
                        <p className='mt-3'>
                            These ‘cafes’ are the best locations to collect evidence of what harriers eat. Evidence that comes straight from their mouth. 



                        </p>
                       
                        



                       


                  

                </div>}
        />
    </div>
       
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
