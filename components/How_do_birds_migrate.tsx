import Image from 'next/image'
import React from 'react'
import Title from './Title'
import { responsive } from './Constants'

const How_do_birds_migrate = () => {
  return (
    <div className={`w-full ${responsive} flex flex-col justify-center `}>
        <div>

        </div>
           

            <div className="text-gray-800 text-lg leading-relaxed flex items-center justify-center">
                 <Image
                    src="https://atree-communication.s3.ap-south-1.amazonaws.com/storymap-harrier/photo/mother_harrier_with_chicks.png"
                    alt="Gangai in the grassland"
                    width={10}
                    height={10}
                    unoptimized
                    className="float-right h-auto w-[45%] ml-8 mb-4object-cover"
                />
                <div className='flex flex-col gap-3'>
                     <Title
                topTitle=""
                mainTitle="How do birds like Gangai make these epic journeys?"
            />
                     <p>
                    First they need to put on weight- 30 to 50% of their body weight as they prepare to migrate.The fat reserves will fuel these long flights. Triggered by changes in daylight, birds set off traveling along the migratory corridors or…

                </p>
                </div>
               

               
                


            </div>
        </div>
  )
}

export default How_do_birds_migrate
