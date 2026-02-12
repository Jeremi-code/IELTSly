import DashboardNav from '@/app/components/DashboardNav'
import React from 'react'

const page = () => {
  return (
    <div className='w-full h-screen overflow-y-scroll flex items-center justify-center relative'>
      <DashboardNav />
      <div>This is the settings page</div>
    </div>
  )
}

export default page
