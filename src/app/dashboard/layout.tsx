import { getServerSession } from "next-auth"
import type React from "react"
import NavBar from "~/components/NavBar"
import { TooltipProvider } from "~/components/ui/tooltip"

interface DashboardLayoutProps {
  children?: React.ReactNode
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  

  return(
    <TooltipProvider>
      <NavBar>
        {children}
      </NavBar>
    </TooltipProvider>
  )
}