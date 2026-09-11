import React from 'react'
import Magazine_img_tsx from './Magazine_img_txt'
import Title from './Title'

const Grasslands_wasteland = () => {
    return (
        <div>
            <Magazine_img_tsx
                is_center={true}
                img_right={false}
                img_src="https://atree-communication.s3.amazonaws.com/storymap-harrier/photo/grassland.JPG"
                content={
                    <div>

                        <Title
                            topTitle=""
                            mainTitle="Grasslands are not wastelands"
                        />


                        <p className="mt-5">
                            Unfortunately, the grasslands, which are its roosting sites, are referred to as wastelands in India and are fast disappearing. Most of the wintering sites, Tal chappar, Desert National Park, the savannah grasslands all feature in the wasteland atlas of India. This means that these precious biomes will be  transformed for development, farming, military, afforestation, renewable energy and other purposes. Less than one percent come under the protected areas network.<br></br><br></br>

                            Our study reveals that the harrier numbers have been declining over the recent years. Every winter, birds like Gangai, Dewani, Hira, Mothiya, Nellai, Paruthi, Poorni, Deo and Rupeli cross mountains and deserts retracing a memory of thousands of years, trusting the same grass patch will be waiting for them when they arrive. But the question is, will they still be?







                        </p>


                    </div>}
            />

        </div>
    )
}

export default Grasslands_wasteland
