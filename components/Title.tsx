import React from 'react'
import { responsive } from './Constants'
type probs = {
    mainTitle: string,
    topTitle?: string,
    customClass?: string,
}

const Title = ({ mainTitle, topTitle, customClass }: probs) => {
    return (
        <div className={`  flex flex-col justify-start ${customClass} `}>

            <p className="uppercase text-orange-800 text-sm  ">{topTitle}</p>

            <h1 className="text-2xl xl:text-4xl font-bold text-gray-800 font-raleway">{mainTitle}</h1>

        </div>
    )
}

export default Title
