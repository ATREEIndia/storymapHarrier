

'use client'
import Magazine_img_tsx from './Magazine_img_txt'
import Title from './Title'

const What_happens_home_not_exist = () => {
    return (
        <div>
            <Magazine_img_tsx
                is_center={true}
                img_right={true}
                img_src="https://atree-communication.s3.amazonaws.com/storymap-harrier/photo/grassland.JPG"
                content={
                    <div>

                        <Title
                            topTitle=""
                            mainTitle="What happens when their homes no longer exist?"
                        />


                        <p className="mt-5">
                            Our study reveals that the harrier numbers have been declining over the recent years. As a grassland gives way to industry, agriculture or other forms of development, the familiar sites that harriers depend on can completely disappear or become less suitable. For birds like Gangai, Dewani, Hira, Mothiya, Nellai, Paruthi, Poorni, Deo and Rupeli, who cross mountains and deserts retracing a memory of thousands of years, trusting the same grass patch will be waiting for them when they arrive, finding a new site may not be as straightforward.

                         








                        </p>


                    </div>}
            />
            <Magazine_img_tsx
                is_center={true}
                img_right={false}
                img_src="https://atree-communication.s3.amazonaws.com/storymap-harrier/photo/grassland.JPG"
                content={
                    <div>



                        <p className="mt-5">
                               If they do not find adequate food and sheltering homes in their wintering grounds, could it impact them when they return to Kazakhstan to breed and raise their chicks? Questions like this make it imperative to keep our research going. And to extend our focus beyond the wintering homes, to cover the migratory paths and the breeding grounds.

                         








                        </p>


                    </div>}
            />

        </div>
    )
}

export default What_happens_home_not_exist
