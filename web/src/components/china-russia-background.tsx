"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

export function ChinaRussiaBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200])
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 45])
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -300])

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
      {/* Base Gradient Background */}
      <div className="absolute inset-0 bg-[#0d1117]" />
      
      {/* Background Glows with adjusted opacity for better content contrast */}
      <motion.div 
        style={{ y: y1 }}
        animate={{ 
          opacity: [0.15, 0.25, 0.15],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[20%] -left-[10%] w-[80%] h-[80%] bg-gradient-to-br from-blue-600/30 via-white/10 to-red-600/20 rounded-full blur-[120px]" 
      />

      <motion.div 
        style={{ y: y2 }}
        animate={{ 
          opacity: [0.15, 0.3, 0.15],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-[20%] -right-[10%] w-[80%] h-[80%] bg-gradient-to-tl from-red-600/30 via-amber-500/20 to-red-900/20 rounded-full blur-[120px]" 
      />

      {/* Decorative SVG Elements: Russian Pattern (Gzhel-inspired) */}
      <motion.div 
        style={{ rotate: rotate1, y: y1 }}
        className="absolute top-[10%] left-[5%] opacity-25 w-64 h-64 md:w-96 md:h-96 text-blue-400"
      >
        <svg viewBox="0 0 200 200" fill="currentColor">
          <path d="M100,20 C120,20 140,40 140,60 C140,80 120,100 100,100 C80,100 60,80 60,60 C60,40 80,20 100,20 M100,110 C130,110 160,140 160,170 L40,170 C40,140 70,110 100,110" />
          <circle cx="100" cy="60" r="10" fill="white" opacity="0.5" />
          <path d="M30,100 Q10,100 10,80 T30,60 T50,80 T30,100" opacity="0.3" />
          <path d="M170,100 Q190,100 190,80 T170,60 T150,80 T170,100" opacity="0.3" />
        </svg>
      </motion.div>

      {/* Decorative SVG Elements: Chinese Pattern (Cloud/Auspicious Pattern) */}
      <motion.div 
        style={{ rotate: rotate2, y: y2 }}
        className="absolute bottom-[10%] right-[5%] opacity-25 w-64 h-64 md:w-96 md:h-96 text-amber-500"
      >
        <svg viewBox="0 0 200 200" fill="currentColor">
          <path d="M40,100 Q40,70 70,70 T100,100 T130,130 T160,100 Q160,130 130,130 T100,100 T70,70 T40,100" />
          <path d="M20,120 Q20,100 40,100 T60,120 T80,100 T100,120" opacity="0.6" />
          <path d="M100,80 Q100,60 120,60 T140,80 T160,60 T180,80" opacity="0.6" />
        </svg>
      </motion.div>

      {/* Central Symbolic Element: Cooperation/Bridge Motif */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <svg width="80%" height="80%" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="400" cy="400" r="350" stroke="white" strokeWidth="1" strokeDasharray="10 10" />
          <path d="M100 400C100 234.315 234.315 100 400 100C565.685 100 700 234.315 700 400C700 565.685 565.685 700 400 700C234.315 700 100 565.685 100 400Z" stroke="white" strokeWidth="0.5" />
          {/* Stylized Great Wall and Kremlin wall elements */}
          <path d="M200 450V400H220V450H240V400H260V450H280V400H300V450" stroke="white" strokeWidth="2" />
          <path d="M500 450V400L520 380L540 400V450M560 450V400L580 380L600 400V450" stroke="white" strokeWidth="2" />
        </svg>
      </div>

      {/* Texture Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-[0.05] mix-blend-overlay" />
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-[#0d1117] opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d1117] via-transparent to-[#0d1117] opacity-40" />
    </div>
  )
}
