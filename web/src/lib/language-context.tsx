"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import ru from '@/locales/ru.json'
import cn from '@/locales/cn.json'

type Translations = typeof ru
type Language = 'ru' | 'cn'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations: Record<Language, Translations> = { ru, cn }

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ 
  children, 
  initialLanguage = 'ru' 
}: { 
  children: React.ReactNode
  initialLanguage?: Language 
}) {
  const [language, setLanguageState] = useState<Language>(initialLanguage)

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred_language', lang)
    }
  }

  const t = (path: string): string => {
    const keys = path.split('.')
    let result: unknown = translations[language]
    
    for (const key of keys) {
      if (result && typeof result === 'object' && key in (result as object)) {
        result = (result as Record<string, unknown>)[key]
      } else {
        return path
      }
    }
    
    return typeof result === 'string' ? result : path
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider')
  }
  return context
}
