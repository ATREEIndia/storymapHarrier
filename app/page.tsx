'use client'
import AddionalInfo from '@/components/AddionalInfo';
import AnimatedStages from '@/components/AnimatedStages';
import { responsive, scroll_day_researcher, scroll_encounter } from '@/components/Constants';
import FeatureImage from '@/components/FeatureImage';
import Flashback from '@/components/Flashback';
import Flyways from '@/components/Flyways';
import HeaderVideo from '@/components/HeaderVideo'
import Highways_in_sky from '@/components/Highways_in_sky';
import How_do_birds_migrate from '@/components/How_do_birds_migrate';
import Magazine_img_tsx from '@/components/Magazine_img_txt';
import Ptag from '@/components/Ptag'
import ScrollMap from '@/components/ScrollMap'
import ScrollSection from '@/components/ScrollSection';
import Title from '@/components/Title';
import Whats_on_menu from '@/components/Whats_on_menu';
import Image from "next/image";
import { useEffect, useRef, useState } from 'react';

const page = () => {

  const containerRef = useRef(null)

  useEffect(() => {




  }, [])

  return (
    <main className='w-full flex flex-col bg-[#f5f0e8]'>

      <HeaderVideo />

      <ScrollSection scroll_items={scroll_encounter} side='right' />
      <Flashback />


      <AddionalInfo
        content={<div className='flex flex-col gap-5'>
          <div>
            <b>Why do animals migrate?</b><br></br>
            Birds, mammals, insects, fishes and reptiles undertake seasonal movement or migration between breeding and non-breeding grounds in search of food.
          </div>
          <div>
            <b>Globe trotters</b>
            <ul className="list-disc pl-6">
              <li>
                Can you imagine flying nonstop for 9 days without food? The
                bar-tailed godwit flies 7,000 miles nonstop, day and night, over
                the Pacific from Alaska to New Zealand.
              </li>

              <li>
                The bar-headed goose is the highest flier, going over Mount Everest
                at 24,000 feet.
              </li>

              <li>
                The Arctic tern clocks the longest migration as it moves between
                the poles, crossing over 44,000 km from the Arctic to the Antarctic.
              </li>
            </ul>



          </div>

        </div>} />

      <How_do_birds_migrate />





      <div className={`${responsive} `}>
        <Title customClass='mt-10' mainTitle="Highways in the sky!" />


        <p className='mt-10'>
          Invisible to the human eye, a few 1000 feet above the land and oceans of the world lie some of the planet’s busiest highways or flyways. Twice a year, these connecting corridors hum to the endless beats of millions of wings as birds commute between their seasonal homes.<br /><br />
        </p>


      </div>
      <Flyways />
      <ScrollMap />

      <div className='py-20'>
        <AddionalInfo
          content={<div className='flex flex-col gap-5'>
            <div>
              <b>A short history of bird migrations</b><br></br>
              The history of modern bird ringing began in the 1890s when a Danish man, Hans Christian Cornelius Mortensen, had the idea of fastening a ring with a number and address to a bird's leg. This was the first step towards understanding bird migrations. When the birds ringed in one part of the continent were picked up in another, we realised for the first time that birds fly long distances and overturn bizarre theories that swallows sank into the bottom of the lakes during winter. It also helped establish flyways, as paths used by migrating birds to traverse to their wintering grounds

            </div>


          </div>} />

      </div>
      <ScrollSection scroll_items={scroll_day_researcher} img_fill={true} />

      <div className='mt-10'>
        <Whats_on_menu />
      </div>
















      {/* 
      <Title customClass={`${responsive} px-4 mt-10`}
        topTitle='' mainTitle="Stages" />
      <AnimatedStages /> */}

    </main>
  )
}

export default page