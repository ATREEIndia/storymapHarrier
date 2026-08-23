import React from 'react'
import { responsive } from './Constants'

type probs={
 content:any
}

const AddionalInfo = ({content}:probs) => {
    return (
        <div className={` h-full   ${responsive}`}>
            <div className='border-l-5 w-full bg-orange-50 p-2 py-8 border-orange-800 text-gray-600 px-5 italic flex flex-col '>
               {content}
                








            </div>



        </div>
    )
}

export default AddionalInfo
