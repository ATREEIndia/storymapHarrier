import Image from 'next/image'
import React from 'react'
import Title from './Title'
import { responsive } from './Constants'
import Magazine_img_tsx from './Magazine_img_txt'

const How_do_birds_migrate = () => {
  return (
    <Magazine_img_tsx
        img_right={false}
        img_src="https://atree-communication.s3.ap-south-1.amazonaws.com/storymap-harrier/photo/mother_harrier_with_chicks.png"
         content={
          <div>
            <Title
                topTitle=""
                mainTitle="How do birds like Gangai make these epic journeys?"
            />
             <p className="mt-5">
                   First they need to put on weight- 30 to 50% of their body weight as they prepare to migrate. <br/><br/>The fat reserves will fuel these long flights. Triggered by changes in daylight, birds set off traveling along the migratory corridors or…

                    

                </p>

          </div>}


        // content={
        //   <div>
        //    <div className='flex flex-col gap-3'>
        //              <Title
        //         topTitle=""
        //         mainTitle="How do birds like Gangai make these epic journeys?"
        //     />
        //              <p>
        //             First they need to put on weight- 30 to 50% of their body weight as they prepare to migrate. <br/><br/>The fat reserves will fuel these long flights. Triggered by changes in daylight, birds set off traveling along the migratory corridors or…

        //         </p>
        //         </div>

        //   </div>}
      />
  )
}

export default How_do_birds_migrate
