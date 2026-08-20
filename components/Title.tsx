import React from 'react'
type probs = {
    mainTitle: string,
    topTitle?: string,
    customClass?: string,
}

const Title = ({ mainTitle, topTitle, customClass }: probs) => {
    return (
        <div className={` flex flex-col justify-start ${customClass}`}>

            <p className="uppercase text-orange-400 text-sm ">{topTitle}</p>

            <h1 className="text-2xl font-bold text-gray-800">{mainTitle}</h1>

        </div>
    )
}

export default Title
