"use client"

import { useEffect, useState } from "react"
import { Menu } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Sidebar } from "@/components/dashboard/sidebar"
import { useMobileNav } from "@/lib/mobile-nav-context"

interface MobileNavProps {
  user: any
  profile: any
}

export function MobileNav({ user, profile }: MobileNavProps) {
  const { open, setOpen } = useMobileNav()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-slate-900 border-slate-800 text-white min-h-[65px]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg tracking-tight">Golden Russia</span>
        </div>
        <div className="h-10 w-10" />
      </div>
    )
  }

  return (
    <div className="md:hidden flex items-center justify-between p-4 border-b bg-slate-900 border-slate-800 text-white">
      <div className="flex items-center gap-2">
        <span className="font-bold text-lg tracking-tight">Golden Russia</span>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </motion.div>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-80 bg-slate-900 border-r border-slate-800 text-white">
          <Sidebar 
            user={user} 
            profile={profile} 
            className="w-full h-full border-none" 
            onClose={() => setOpen(false)} 
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}
