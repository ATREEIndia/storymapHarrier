import React from 'react'
import { responsive } from './Constants'

type probs = {
  text: any,
  custom_class?:string
}

const Ptag = ({ text, custom_class }: probs) => {
  return (
    <span className={`text-base text-gray-800  ${responsive} ${custom_class}`}>
      {text}
    </span>
  )
}

export default Ptag