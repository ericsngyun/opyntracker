import type { ReactNode } from "react"
import NavHeader from "./NavHeader"
import NavSide from "./NavSide"

interface NavBarProps {
  children: ReactNode
}

export default function NavBar({children}: NavBarProps) {

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <NavSide/>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
      <NavHeader/>
        {children}
      </div>
    </div>
  )
}