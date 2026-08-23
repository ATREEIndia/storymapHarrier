import Image from "next/image"
import Title from "./Title"
import { responsive } from "./Constants"

const Flashback = () => {

    return (
        <div className={`w-full ${responsive} mt-5`}>
            <Title
                topTitle=""
                mainTitle="Flashback"
            />

            <div className="text-gray-800 text-lg leading-relaxed">
                <Image
                    src="https://atree-communication.s3.ap-south-1.amazonaws.com/storymap-harrier/photo/mother_harrier_with_chicks.png"
                    alt="Gangai in the grassland"
                    width={10}
                    height={10}
                    unoptimized
                    className="float-right h-auto w-[45%] ml-8 mb-4object-cover"
                />

                <p className="mt-5">
                    Gangai was born in  the meadows near lake Balkash in Kazakhstan. For the first few weeks , his parents looked after him. They hunted for  voles and ferried them to the babies in the nest.<br/><br/>

                    It is not just a ferrying flight, but an astonishing pass that might leave the best footballers in awe as one adult passes it to the other in mid air and they share parenting duties.<br/><br/>

                    Soon the adults left and he learnt to feed himself . As the days became shorter by winter, an inherent migratory instinct kicked in and Gangai started on his first migratory flight- A distance of 5000km over 22 days,  from Kazakhstan to India.  He was just over five months old.<br/><br/>

                </p>


            </div>
        </div>
    )
}

export default Flashback;