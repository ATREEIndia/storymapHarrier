// import React from 'react'
// import { responsive } from './Constants'

// type probs={
//  content:any
// }

// const AddionalInfo = ({content}:probs) => {
//     return (
//         <div className={` h-full   ${responsive}`}>
//             <div className='border-l-5 w-2/3 float-right bg-orange-50 p-2 py-8 border-orange-800 text-gray-600 px-5 italic flex flex-col text-sm '>
//                {content}
//             </div>



//         </div>
//     )
// }

// export default AddionalInfo


// 'use client'
// import React, { useState } from 'react'
// import { responsive } from './Constants'


// type probs = {
//     content: any,
//     title:string
// }

// const AddionalInfo2 = ({ content, title }: probs) => {
//     const [isOpen, setIsOpen] = useState(false)

//     return (
//         <div className={`h-full ${responsive} `}>
//             <div className={`${isOpen?"w-full":"xl:w-1/4 "} xl:float-right`}>

//                 {/* Toggle Header */}
//                 <button
//                     onClick={() => setIsOpen(!isOpen)}
//                     className="w-full flex items-center justify-between cursor-pointer
//                                bg-orange-800 text-white
//                                px-5 py-3 rounded-t-md"
//                 >
//                     <span>{title}</span>

//                     <span
//                         className={`transition-transform duration-300 ${
//                             isOpen ? 'rotate-180' : ''
//                         }`}
//                     >
//                         ▼
//                     </span>
//                 </button>

//                 {/* Content */}
//                 <div
//                     className={`overflow-hidden transition-all duration-300 ${
//                         isOpen
//                             ? 'max-h-[500px] opacity-100'
//                             : 'max-h-0 opacity-0'
//                     }`}
//                 >
//                     <div
//                         className="
//                             border-l-5
//                             bg-orange-50
//                             p-2 py-4
//                             border-orange-800
//                             text-gray-600
//                             px-5
//                             italic
//                             flex flex-col
//                             text-sm
//                         "
//                     >
//                         {content}
//                     </div>
//                 </div>

//             </div>
//         </div>
//     )
// }

// export default AddionalInfo2





'use client'

import React, { useState } from 'react'
import { responsive } from './Constants'

type Props = {
    content: React.ReactNode
    title: string
}

const AdditionalInfo = ({ content, title }: Props) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className={`relative ${responsive} pointer-events-auto flex justify-end xl:px-20`}>
            
            {/* Small unobtrusive trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    ${isOpen?"":"animate-bounce"}
                    inline-flex items-center gap-2
                    text-xs text-orange-800
                    hover:text-orange-950
                    transition-colors
                    cursor-pointer
                `}
            >
                <span
                    className="
                        flex items-center justify-center
                        w-5 h-5
                        rounded-full
                        border border-orange-700
                        text-xs
                    "
                >
                    {isOpen ? '−' : '+'}
                </span>

                <span className="underline underline-offset-4">
                    {title}
                </span>
            </button>

            {/* Floating information */}
            {isOpen && (
                <div
                    className="
                        absolute
                        right-0
                        top-full
                        mt-3
                        z-50
                        w-[min(90vw,420px)]
                        bg-orange-50
                        border-l-4
                        border-orange-800
                        shadow-xl
                        rounded-r-md
                    "
                >
                    <div className="p-5 text-sm leading-6 text-gray-600 italic">
                        {content}
                    </div>
                </div>
            )}

        </div>
    )
}

export default AdditionalInfo
