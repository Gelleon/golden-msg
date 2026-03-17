"use client"

import { motion } from "framer-motion"
import { MessageSquare, ArrowLeft } from "lucide-react"
import { useTranslation } from "@/lib/language-context"
import { useMobileNav } from "@/lib/mobile-nav-context"

export default function DashboardPage() {
  const { t } = useTranslation()
  const { setOpen } = useMobileNav()

  return (
    <div className="flex h-full items-center justify-center bg-slate-50/50 p-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ 
          duration: 0.5,
          ease: [0.16, 1, 0.3, 1]
        }}
        className="text-center space-y-8 max-w-md relative z-10"
      >
        <div className="relative inline-flex group">
          <div className="p-8 bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-blue-500/10 border border-white/50 relative z-10 transition-transform duration-500 group-hover:scale-105">
            <MessageSquare className="h-16 w-16 text-blue-600 drop-shadow-sm" />
          </div>
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.15, 0.4]
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -inset-6 bg-blue-500/30 rounded-full blur-3xl z-0"
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ 
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -inset-10 bg-secondary/20 rounded-full blur-3xl z-0"
          />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t("dashboard.selectChat")}
          </h2>
          <p className="text-slate-500 text-lg md:text-xl leading-relaxed font-medium">
            {t("dashboard.selectRoomDesc")}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpen(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-3 text-blue-600 font-semibold md:hidden bg-blue-50 py-3 px-6 rounded-2xl w-full border border-blue-100 shadow-sm active:bg-blue-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 animate-pulse" />
          <span>{t("dashboard.openMenu")}</span>
        </motion.button>
      </motion.div>
    </div>
  )
}
