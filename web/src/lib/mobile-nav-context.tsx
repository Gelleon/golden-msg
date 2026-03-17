"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface MobileNavContextType {
  open: boolean
  setOpen: (open: boolean) => void
}

const MobileNavContext = createContext<MobileNavContextType | undefined>(undefined)

export function MobileNavProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <MobileNavContext.Provider value={{ open, setOpen }}>
      {children}
    </MobileNavContext.Provider>
  )
}

export function useMobileNav() {
  const context = useContext(MobileNavContext)
  if (context === undefined) {
    throw new Error("useMobileNav must be used within a MobileNavProvider")
  }
  return context
}
