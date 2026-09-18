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
                            In India, the grasslands are referred to as wastelands and are fast disappearing. Historically, the British valued forests and considered grassland ecosystems as unproductive. This legacy, unfortunately, has lived on. <br/><br/>
 
Most of the wintering sites of Montague’s Harriers, Tal chappar, Desert National Park, the savannah grasslands all feature in the wasteland atlas of India. This means that these precious biomes will be  transformed for development, farming, military, afforestation, renewable energy and other purposes. Less than one percent come under the protected areas network. 








                        </p>


                    </div>}
            />

        </div>
    )
}

export default Grasslands_wasteland
