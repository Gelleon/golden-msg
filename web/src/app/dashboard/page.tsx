"use client"

import { motion } from "framer-motion"
import { MessageSquare, ArrowLeft } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="flex h-full items-center justify-center bg-slate-50/50 p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ 
          duration: 0.5,
          ease: [0.16, 1, 0.3, 1]
        }}
        className="text-center space-y-6 max-w-md"
      >
        <div className="relative inline-flex">
          <div className="p-6 bg-white rounded-3xl shadow-xl shadow-blue-500/10 border border-slate-100 relative z-10">
            <MessageSquare className="h-12 w-12 text-blue-600" />
          </div>
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.1, 0.3]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -inset-4 bg-blue-500 rounded-full blur-2xl z-0"
          />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Выберите чат</h2>
          <p className="text-slate-500 text-lg leading-relaxed">
            Выберите комнату в меню слева, чтобы начать общение с вашими партнерами.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-2 text-blue-600 font-medium md:hidden"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Откройте меню</span>
        </motion.div>
      </motion.div>
    </div>
  )
}
