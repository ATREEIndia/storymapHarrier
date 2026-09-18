import React from 'react'
import Magazine_img_tsx from './Magazine_img_txt'
import Title from './Title'

const Predator = () => {
    return (
        <div className='flex flex-col'>
            <Magazine_img_tsx
                is_center={true}
                img_right={true}
                video_src="https://atree-communication.s3.amazonaws.com/storymap-harrier/video/roost.mp4"
                content={
                    <div>

                        <Title
                            topTitle=""
                            mainTitle="As the birds settle/Dusk"
                        />


                        <p className="mt-5">
                            Winter evenings are balmy. The sky is lit and the grassland makes a wonderful scene.

                            Waves of migrating larks and starlings can be exhilarating to watch.
                            The harrier roost is never devoid of other life forms.






                        </p>



                    </div>}
            />


            <Magazine_img_tsx
                is_center={true}
                img_right={false}
                img_src="https://atree-communication.s3.ap-south-1.amazonaws.com/storymap-harrier/photo/predator_species.png"
                content={
                    <div>

                        <Title
                            topTitle=""
                            mainTitle="The predators start lurking."
                        />


                        <ul className="mt-5 list-disc pl-6 space-y-2">
                            <li>A Jungle cat</li>
                            <li>A fox</li>
                            <li>A jackal</li>
                            <li>A Tawny eagle</li>
                            <li>A shepherd dog</li>
                            <li>An Eagle owl</li>
                        </ul>



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

export default Predator
