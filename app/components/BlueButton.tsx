'use client'
import React from 'react'

interface props {
  buttonName: string;
}

const BlueButton: React.FC<props> = (props) => {
  return (
    <button className='py-2 px-6   bg-[#2563EB] text-white rounded-md hover:bg-[#1D4ED8] cursor-pointer'>
      {props.buttonName}
    </button>
  )
}

export default BlueButton
