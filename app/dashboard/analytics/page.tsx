"use client"

import DashboardNav from '@/app/components/DashboardNav'
import React from 'react'
import { cn } from '@/lib/utils'

const AnalyticsPage = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <div className="w-full flex min-h-screen bg-linear-to-br from-[#E4EEFF] via-[#FFFFFF] to-[#E4EEFF] dark:from-zinc-950 dark:to-zinc-900 text-foreground transition-colors duration-500">
      <DashboardNav collapsed={isCollapsed} onToggle={setIsCollapsed} />
      <main className={cn(
        "w-8/10 mx-auto transition-all duration-300 p-10",
        isCollapsed ? "pl-20" : "pl-64"
      )}>
        <h1 className="text-3xl font-bold mb-6">Analytics Overview</h1>
        <div className="">
           <div className="p-8 border rounded-2xl bg-card/50 backdrop-blur-sm text-center text-muted-foreground">
             Detailed Error Analytics coming soon...
           </div>
        </div>
      </main>
    </div>
  )
}

export default AnalyticsPage
