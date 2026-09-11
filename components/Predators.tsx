import React from 'react'
import Magazine_img_tsx from './Magazine_img_txt'
import Title from './Title'

const Predator = () => {
    return (
        <Magazine_img_tsx
        is_center={true}
            img_right={false}
            img_src="https://atree-communication.s3.ap-south-1.amazonaws.com/storymap-harrier/photo/predator_species.png"
            content={
                <div>

                    <Title
                        topTitle=""
                        mainTitle="Dusk, harriers, birds and predators"
                    />
                  
                    
                   <p className="mt-5">
                        The harrier roost is never devoid of other life forms.

                        Waves of migrating larks and starlings can be exhilarating to watch.
                        The partridges and francolins start calling, the egrets, storks, curlews, bee-eaters, swallows and rollers arrive in hordes.

                        The predators start lurking.
                        A Jungle cat,
                        a fox,
                        a jackal, an eagle (Tawny)
                        a shepherd dog,
                        an Eagle owl
                        can send the entire roost into a tizzy.



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

export default Predator
