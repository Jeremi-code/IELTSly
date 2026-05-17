"use client"

import React from 'react'
import DashboardShell from '../../components/DashboardShell'

const AnalyticsPage = () => {
  return (
    <DashboardShell className="w-8/10 mx-auto transition-all duration-300 p-10">
        <h1 className="text-3xl font-bold mb-6">Analytics Overview</h1>
        <div className="">
           <div className="p-8 border rounded-2xl bg-card/50 backdrop-blur-sm text-center text-muted-foreground">
             Detailed Error Analytics coming soon...
           </div>
        </div>
    </DashboardShell>
  )
}

export default AnalyticsPage
