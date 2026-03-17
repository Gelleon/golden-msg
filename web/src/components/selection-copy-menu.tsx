"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Copy, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { useTranslation } from "@/lib/language-context"

/**
 * Component for custom text selection copy menu.
 * Triggers on desktop right-click or mobile long-press on selected text.
 */
export function SelectionCopyMenu() {
  const [position, setPosition] = React.useState<{ x: number; y: number } | null>(null)
  const [selectedText, setSelectedText] = React.useState("")
  const [isVisible, setIsVisible] = React.useState(false)
  const [isCopied, setIsCopied] = React.useState(false)
  const { toast } = useToast()
  const { t } = useTranslation()

  React.useEffect(() => {
    const handleContextMenu = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement
      // Don't show if clicking inside a message bubble or sidebar item that has its own context menu
      if (target.closest('[data-radix-collection-item]') || 
          target.closest('.message-bubble-trigger') || 
          target.closest('.sidebar-item-trigger')) {
        return
      }

      const selection = window.getSelection()
      const text = selection?.toString().trim()

      if (text) {
        // Only prevent default if we have selection
        e.preventDefault()
        setSelectedText(text)
        
        let x = 0
        let y = 0
        
        if (e instanceof MouseEvent) {
          x = e.clientX
          y = e.clientY
        } else if (e instanceof TouchEvent && e.touches.length > 0) {
          x = e.touches[0].clientX
          y = e.touches[0].clientY
        }
        
        // Adjust position to keep menu within viewport
        const menuWidth = 140
        const menuHeight = 50
        const padding = 10
        
        if (x + menuWidth > window.innerWidth) x = window.innerWidth - menuWidth - padding
        if (y + menuHeight > window.innerHeight) y = window.innerHeight - menuHeight - padding
        if (x < padding) x = padding
        if (y < padding) y = padding

        setPosition({ x, y })
        setIsVisible(true)
        setIsCopied(false)
      } else {
        setIsVisible(false)
      }
    }

    const handleSelectionChange = () => {
      const selection = window.getSelection()
      if (!selection || selection.toString().trim() === "") {
        if (isVisible) setIsVisible(false)
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.selection-copy-menu')) {
        setIsVisible(false)
      }
    }

    document.addEventListener("contextmenu", handleContextMenu as any)
    document.addEventListener("selectionchange", handleSelectionChange)
    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu as any)
      document.removeEventListener("selectionchange", handleSelectionChange)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isVisible])

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      await navigator.clipboard.writeText(selectedText)
      setIsCopied(true)
      
      // Try to show toast if available
      try {
        toast({
          title: t('common.copied'),
          description: t('common.textCopiedToClipboard'),
        })
      } catch (e) {
        // Fallback if toast system fails
        console.log("Copied to clipboard")
      }

      // Hide after a short delay
      setTimeout(() => {
        setIsVisible(false)
        setIsCopied(false)
      }, 800)
    } catch (err) {
      console.error("Failed to copy:", err)
      setIsVisible(false)
    }
  }

  return (
    <AnimatePresence>
      {isVisible && position && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 5 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          style={{
            position: "fixed",
            top: position.y,
            left: position.x,
            zIndex: 10000,
          }}
          className="selection-copy-menu"
        >
          <div className="bg-white/95 backdrop-blur-sm border border-slate-200/60 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] overflow-hidden min-w-[160px] p-1">
            <button
              onClick={handleCopy}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-all group rounded-lg"
            >
              <div className={cn(
                "transition-colors",
                isCopied ? "text-emerald-500" : "text-slate-400 group-hover:text-blue-500"
              )}>
                {isCopied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </div>
              <span className="tracking-tight">
                {isCopied ? t('common.copied') : t('common.copy')}
              </span>
            </button>
          </div>
          
          {/* Pointer tail */}
          <div 
            className="absolute left-4 -bottom-1 w-2.5 h-2.5 bg-white/95 border-r border-b border-slate-200/60 rotate-45"
            style={{ left: '50%', transform: 'translateX(-50%) rotate(45deg)' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
