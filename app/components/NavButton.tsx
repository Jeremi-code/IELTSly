'use client'
import React from 'react'

interface props {
  buttonName: string;
}

const NavButton: React.FC<props> = (props) => {
  return (
    <button className='text-[#4B5563] hover:text-[#2563EB] cursor-pointer'>
      {props.buttonName}
    </button>
  )
}

export default NavButton
