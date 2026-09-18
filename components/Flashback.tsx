import Image from "next/image"
import Title from "./Title"
import { responsive } from "./Constants"
import Magazine_img_tsx from "./Magazine_img_txt"

const Flashback = () => {

    return ( <div className="flex flex-col">
         <Magazine_img_tsx
            img_right={true}
            is_center={true}
            caption="Montagu’s harriers are ground-nesting birds, building their nests in open areas, amid tall grassy vegetation"
            img_src="https://atree-communication.s3.ap-south-1.amazonaws.com/storymap-harrier/photo/mother_harrier_with_chicks.png"
            content={
                <div>
                    <Title
                        topTitle=""
                        mainTitle="Flashback"
                    />
                    <p className="mt-5">
                        Gangai was born in  the meadows near lake Balkash in Kazakhstan. For his first few weeks of life, his parents looked after him. They hunted for  voles and ferried them to the babies in the nest. <br /><br />

                        





                    </p>

                </div>}
        />




         <Magazine_img_tsx
            img_right={false}
            is_center={true}
            img_src="https://atree-communication.s3.amazonaws.com/storymap-harrier/photo/food_pass.jpeg"
            content={
                <div>
                  
                    <p className="mt-5">
                       

                        It is not just a ferrying flight, but an astonishing pass from one adult to another in mid air that might leave the best footballers in awe. Between them, the parents share the duties of raising him. <br /><br />

                       





                    </p>

                </div>}
        />
         <Magazine_img_tsx
            img_right={true}
            is_center={true}
            img_src="https://atree-communication.s3.amazonaws.com/storymap-harrier/photo/bird_kazakisthan.jpg"
            content={
                <div>
                  
                    <p className="mt-5">
                       

                       

                        Soon the adults left on their migration and Gangai learnt to feed himself . By winter, as the days became shorter, an inherent migratory instinct kicked in and Gangai started on his first migratory flight. A distance of 5000 km over 22 days,  from Kazakhstan to India.  He was just over five months old.




                    </p>

                </div>}
        />

    </div>
       
    )
}

export default Flashback;