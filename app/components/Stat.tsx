"use client";

import React from 'react'

const Stat = () => {
  return (
    <div className='w-full py-10 flex items-center justify-evenly'>
      <div className='text-center'>
        <h3 className='text-5xl font-bold text-[#2563eb]'>10000+</h3>
        <p className='text-[#6B7280] text-lg font-bold'>Essays Evaluated</p>
      </div>
      <div className='text-center'>
        <h3 className='text-5xl font-bold text-[#2563eb]'>95%</h3>
        <p className='text-[#6B7280] text-lg font-bold'>Accuracy Rate</p>
      </div>
      <div className='text-center'>
        <h3 className='text-5xl font-bold text-[#2563eb]'>2500+</h3>
        <p className='text-[#6B7280] text-lg font-bold'>Active Users</p>
      </div>
      <div className='text-center'>
        <h3 className='text-5xl font-bold text-[#2563eb]'>24/7</h3>
        <p className='text-[#6B7280] text-lg font-bold'>Practice Available</p>
      </div>
    </div>
  )
}

export default Stat
