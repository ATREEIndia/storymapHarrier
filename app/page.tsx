import { responsive } from '@/components/Constants';
import Flyways from '@/components/Flyways';
import HeaderVideo from '@/components/HeaderVideo'
import Ptag from '@/components/Ptag'
import ScrollMap from '@/components/ScrollMap'
import Title from '@/components/Title';
import Image from "next/image";

const page = () => {
  return (
    <main className='w-full flex flex-col bg-[#f5f0e8]'>

      <HeaderVideo />

      <Title customClass={`${responsive} my-5`}
        topTitle='The Encounter' mainTitle="The day we found Gangai" />

      <Ptag custom_class={`${responsive} `}
        text={<p>We found Gangai on the day of a fire. He was a young bird, perched on a post, in the grassland, calling out to the other circling harriers. He tripped into our mist net at the time when the fire set by the fireline workers went momentarily out of control.<br /><br />

          We rushed in and retrieved the bird within a few 100 feet of the blazing grassland. The rest of the birds in the roost were flying helter-skelter and ultimately settled down in a patch close by. <br /><br />

          What an experience for a young harrier in the first year of his migration. <br /><br />

        </p>} />

      <div className={` h-150 relative ${responsive}`}>
        <Image
          src='https://cdn.pixabay.com/photo/2026/02/22/05/56/blendertimer-northern-harrier-10137155_1280.jpg'
          alt="Northern Harrier bird"
          fill
          className="object-cover shadow-lg rounded-2xl"
        />
        <p className="absolute bottom-3 right-3 z-10 text-xs text-gray-900 opacity-70 px-2">Pc: pixabay</p>
      </div>




      <Ptag custom_class={`${responsive} `}
        text={<p>


          Gangai was our second harrier of the season and the team was excited. We named him after the village Gangewadi where we found him.<br /><br />

          After measuring wingspan, tail etc,  we slipped a ring on his legs, hoping this ring will help us keep in touch with Gangai as he grows from a scruffy brown juvenile into adulthood.<br /><br />

          Of the 16 harrier species present globally, the Indian subcontinent is an important wintering range for six species travelling from their breeding sites in Central Asia. India has the largest roost for Montagu’s and Pallid Harriers. <br /><br />

          How do we know this? By counting them year after year for over 11 years across the grasslands of Rajasthan, Gujarat, Andhra Pradesh, Tamil Nadu and Maharashtra. <br /><br />



        </p>} />


      <div className={` h-150 relative ${responsive}`}>
        <Image
          src='https://atree-communication.s3.ap-south-1.amazonaws.com/storymap-harrier/photo/tg_team.jpg'
          alt="Northern Harrier bird"
          fill
          className="object-cover shadow-lg rounded-2xl"
        />
        <p className="absolute bottom-3 right-3 z-10 text-xs text-gray-900 opacity-70 px-2">Pc: Illustrations of TG, Arjun( phd student), Prashanth (researcher) and Chian (Field researcher )</p>
      </div>




      <Ptag custom_class={`${responsive} `}
        text={<p>
          T Ganesh's interest in Harriers goes back to the early 90’s when he started counting harrier roosts. He studied one such roost for 7 years on the outskirts of Hyderabad. The study resumed in 2015, when he and a small team of researchers began tracking Montagu's harrier migration by geotagging them at 6 sites.<br /><br />

          But they had never tagged birds before.<br /><br />
          Raymond Klaassen and Ben Koks from the Dutch Montague Harrier foundation came to help.<br /><br />

          The team thus began tracking Gangai over the next … years.<br /><br />

        </p>} />


      <Title customClass={`${responsive} my-5`}
        topTitle='Flashback' mainTitle="The Flashback" />

      <div className={` h-150 relative ${responsive}`}>
        <Image
          src='https://atree-communication.s3.ap-south-1.amazonaws.com/storymap-harrier/photo/forest_fire_bird_flying.jpg'
          alt="Northern Harrier bird"
          fill
          className="object-cover shadow-lg rounded-2xl"
        />
        <p className="absolute bottom-3 bg-black/45  right-3 z-10 text-xs  opacity-70 px-2 text-white">Pc: Illustrations of TG, Arjun( phd student), Prashanth (researcher) and Chian (Field researcher )</p>
      </div>




      <Ptag custom_class={`${responsive} `}
        text={<p>Gangai was born in  the meadows near lake Balkash in Kazakhstan. For the first few weeks , his parents looked after him. They hunted for  voles and ferried them to the babies in the nest.<br /><br />

          It is not just a ferrying flight, but an astonishing pass that might leave the best footballers in awe as one adult passes it to the other in mid air and they share parenting duties.<br /><br />

          Soon the adults left and he learnt to feed himself . As the days became shorter by winter, an inherent migratory instinct kicked in and Gangai started on his first migratory flight- A distance of 5000km over 22 days,  from Kazakhstan to India.  He was just over five months old.
        </p>} />


      <div className={`${responsive} border-2 p-4 border-orange-200 bg-orange-100 shadow-xl rounded-xl px-2 items-start flex       flex-col`}>
        <Title customClass={`px-4 `}
          topTitle='' mainTitle="Why do animals migrate?" />

        <Ptag custom_class={`text-lg px-4 `}
          text={<p>Birds, mammals, insects, fishes and reptiles undertake seasonal movement or migration between breeding and non-breeding grounds in search of food.<br /><br />
          </p>} />



        <Title customClass={` px-4`}
          topTitle='' mainTitle="Globe Trotters" />

        <Ptag custom_class={`text-lg px-4 p-2`}
          text={
            <ul className="list-disc pl-5 sm:pl-6 space-y-2 text-sm sm:text-base md:text-lg mx-0 ">
              <li>
                <em>Can you imagine flying nonstop for 9 days without food? The bar-tailed godwit flies 7,000 miles nonstop, day and night, over the Pacific from Alaska to New Zealand.</em>
              </li>
              <li>
                <em>The bar-headed goose is the highest flier, going over Mount Everest at 24,000 feet.</em>
              </li>
              <li>
                <em>The Arctic tern clocks the longest migration as it moves between the poles, crossing over 44,000 km from the Arctic to the Antarctic.</em>
              </li>
            </ul>
          } />


      </div>


      <Title customClass={`${responsive} my-5`}
        topTitle='' mainTitle="How do birds like Gangai make these epic journeys?" />

      <Ptag custom_class={`${responsive} `}
        text={<p>First they need to put on weight- 30 to 50% of their body weight as they prepare to migrate.The fat reserves will fuel these long flights. Triggered by changes in daylight, birds set off traveling along the migratory corridors or…
        </p>} />

      <Title customClass={`${responsive} my-5`}
        topTitle='' mainTitle="Highways in the sky!" />

           <Ptag custom_class={`${responsive} `}
        text={<p>Invisible to the human eye, a few 1000 feet above the land and oceans of the world lie some of the planet’s busiest highways or flyways.Twice a year, these connecting corridors hum to the endless beats of millions of wings as birds commute between their seasonal homes.
        </p>} />

         <Flyways />

          <Ptag custom_class={`${responsive} mb-10 `}
        text={<p>Gangai will fly along the Central Asian Flyway to reach India. Perhaps since the ice ages,  the harriers have been following the same route and this has got hard wired into their brain. When on such long distance migrations, Gangai has to occasionally stop to refuel for a couple of days. 
        </p>} />
     

      <ScrollMap />

       <div className={`${responsive} border-2 p-4 border-orange-200 bg-orange-100 shadow-xl rounded-xl px-2 items-start flex    mt-10   flex-col`}>
        <Title customClass={`px-4 `}
          topTitle='' mainTitle="History bird migrations?" />

        <Ptag custom_class={`text-lg px-4 `}
          text={<i>The history of modern bird ringing began in the 1890s when a Danish man, Hans Christian Cornelius Mortensen, had the idea of fastening a ring with a number and address to a bird's leg. This was the first step towards understanding bird migrations.<br /><br />
            
             When the birds ringed in one part of the continent were picked up in another, we realised for the first time that birds fly long distances and overturn bizarre theories that swallows sank into the bottom of the lakes during winter. It also helped establish flyways, as paths used by migrating birds to traverse to their wintering grounds
<br /><br />
          </i>} />


      </div>

    </main>
  )
}

export default page