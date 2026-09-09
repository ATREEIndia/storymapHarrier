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
'use client'
import React, { useState } from 'react'
import { responsive } from './Constants'


type probs = {
    content: any,
    title:string
}

const AddionalInfo = ({ content, title }: probs) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className={`h-full ${responsive} `}>
            <div className={`${isOpen?"w-full":"xl:w-1/4 "} xl:float-right`}>

                {/* Toggle Header */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between cursor-pointer
                               bg-orange-800 text-white
                               px-5 py-3 rounded-t-md"
                >
                    <span>{title}</span>

                    <span
                        className={`transition-transform duration-300 ${
                            isOpen ? 'rotate-180' : ''
                        }`}
                    >
                        ▼
                    </span>
                </button>

                {/* Content */}
                <div
                    className={`overflow-hidden transition-all duration-300 ${
                        isOpen
                            ? 'max-h-[500px] opacity-100'
                            : 'max-h-0 opacity-0'
                    }`}
                >
                    <div
                        className="
                            border-l-5
                            bg-orange-50
                            p-2 py-4
                            border-orange-800
                            text-gray-600
                            px-5
                            italic
                            flex flex-col
                            text-sm
                        "
                    >
                        {content}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default AddionalInfo
