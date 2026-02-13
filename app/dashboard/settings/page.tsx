import DashboardNav from '@/app/components/DashboardNav'
import React from 'react'

const page = () => {
  return (
    <div className='w-full h-screen grid grid-cols-[16%_84%] gap-0'>
      <DashboardNav />
      <div>This is the settings page</div>
    </div>
  )
}

export default page
