import React from 'react'
import Magazine_img_tsx from './Magazine_img_txt'
import Title from './Title'

const Its_time_to_go_back = () => {
    return (
        <div>
            <Magazine_img_tsx
                is_center={false}
                img_right={true}
                img_src="https://atree-communication.s3.amazonaws.com/storymap-harrier/photo/harrier.png"
                content={
                    <div>

                        <Title
                            topTitle=""
                            mainTitle="It’s time to go back. But where is Gangai?"
                        />


                        <p className="mt-5">
                            By the end of March, harriers make their way back to their breeding home. April arrived, and Gangai was still in Gangewadi, the transmitter revealed. We waited, hoping he would leave soon.<br/><br/>
 
It was his first flight back and we were worried. <br/><br/>

By the third week of April, ridden with anxiety, hopped on to the first train taking us from Bangalore to Solapur, travelling last minute in general class. Nothing mattered except one question: What could have happened to him?<br/><br/>
 
Just as we reached…  Gangai had started his journey on 27 April.<br/><br/>

 To our relief, in 20 days, he reached Balakash Lake in Kazakhastan.<br/><br/>

Gangai is not the first harrier to trace this journey. He and his cousins have been travelling this route for thousands of years. As he travels from the grasslands of Marathwada to the undulating plains in Kazakhstan each year and back, he has been keeping up his tryst with the same fence posts and grass patches in Gangewadi.<br/><br/>

How valuable are these grasslands for birds that seek such places while coming from a faraway land? 







                        </p>


                    </div>}
            />

        </div>
    )
}

export default Its_time_to_go_back
