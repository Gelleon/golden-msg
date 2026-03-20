"use client"

import React, { useEffect, useRef } from "react"
import { AudioVisualizer } from "./audio-visualizer"
import "./audio-visualizer.css"

interface AudioVisualizerComponentProps {
  src: string
  className?: string
  style?: React.CSSProperties
}

export function AudioVisualizerComponent({ src, className = "", style }: AudioVisualizerComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const visualizerRef = useRef<AudioVisualizer | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Clean up previous instance if src changes
    if (visualizerRef.current) {
      visualizerRef.current.destroy()
    }

    // Initialize new instance
    visualizerRef.current = new AudioVisualizer(containerRef.current, src)

    return () => {
      if (visualizerRef.current) {
        visualizerRef.current.destroy()
        visualizerRef.current = null
      }
    }
  }, [src])

  return (
    <div 
      ref={containerRef} 
      className={className} 
      style={style} 
    />
  )
}
