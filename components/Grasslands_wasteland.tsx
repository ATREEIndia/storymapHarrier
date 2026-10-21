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
                            In India, the grasslands are referred to as wastelands and are fast disappearing. Historically, the British valued forests and considered grassland ecosystems as unproductive. This legacy, unfortunately, has lived on.  <br/><br/>
 
Grasslands change as per seasons, shifting from lush green to dry grey. This further encourages efforts to classify them as unproductive and repurpose them for various human uses.  Many grasslands in the Deccan, western and south India, where Montagu’s harriers spend their winter, are listed as wastelands in India’s Wasteland Atlas. <br/><br/>
Less than 1% of these grasslands come under the protected areas network, and most are managed by pastoralists and local farmers.  They regularly burn the dry grass in a controlled way,  which helps both their livestock and the visiting harriers. However, these precious biomes are increasingly being converted for development, farming, tree planting, renewable energy projects and other human activities.








                        </p>


                    </div>}
            />

        </div>
    )
}

export default Grasslands_wasteland
