// import Image from "next/image"
// import Title from "./Title"
// import { responsive } from "./Constants"

// const Whats_on_menu = () => {

//     return (
//         <div className={`w-full ${responsive}`}>
//             <Title
//                 topTitle=""
//                 mainTitle="What’s on the menu?"
//             />

//             <div className="text-gray-800 text-lg leading-relaxed">
//                 <Image
//                     src="https://atree-communication.s3.ap-south-1.amazonaws.com/storymap-harrier/photo/mother_harrier_with_chicks.png"
//                     alt="Gangai in the grassland"
//                     width={10}
//                     height={10}
//                     unoptimized
//                     className="float-right h-auto w-[45%] ml-8 mb-4object-cover"
//                 />

//                 <p className="mt-5">
//                     The harriers enjoy a high-keto diet ! Their keen sight and auditory abilities help them spot a grasshopper, a basking lizard (calotes), a skink, dragonflies, praying mantis, antlion, or a Sitana (fan-throated lizard). By evening they might grab a gerbil, a field mouse or an occasional bird (short-toed lark).<br/><br/>

//                     As we were spending the whole day in the grassland, we were indebted to Bharath and Pappu, who ferried food to us from the city 20 kms away .


                    

//                 </p>


//             </div>
//         </div>
//     )
// }

// export default Whats_on_menu;

import Image from 'next/image'
import React from 'react'
import Title from './Title'
import { responsive } from './Constants'

const Whats_on_menu = () => {
  return (
    <div className={`w-full ${responsive} flex flex-col justify-center `}>
        <div>

        </div>
           

            <div className="text-gray-800 text-lg leading-relaxed flex items-center justify-center">
                 <Image
                    src="https://atree-communication.s3.ap-south-1.amazonaws.com/storymap-harrier/photo/prey_species.png"
                    alt="Gangai in the grassland"
                    width={10}
                    height={10}
                    unoptimized
                    className="float-left h-auto w-[45%] ml-8 mb-4object-cover"
                />
                <div className='flex flex-col gap-3'>
                     <Title
                topTitle=""
                mainTitle="What’s on the menu?"
            />
                     <p>
                   The harriers enjoy a high-keto diet ! Their keen sight and auditory abilities help them spot a grasshopper, a basking lizard (calotes), a skink, dragonflies, praying mantis, antlion, or a Sitana (fan-throated lizard). By evening they might grab a gerbil, a field mouse or an occasional bird (short-toed lark).<br/><br/>

As we were spending the whole day in the grassland, we were indebted to Bharath and Pappu, who ferried food to us from the city 20 kms away .

                </p>
                </div>
               

               
                


            </div>
        </div>
  )
}

export default Whats_on_menu
