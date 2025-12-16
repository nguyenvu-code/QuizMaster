'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
    )
  }

  const themes = [
    { value: 'light', icon: Sun, label: 'Sáng' },
    { value: 'dark', icon: Moon, label: 'Tối' },
    { value: 'system', icon: Monitor, label: 'Hệ thống' },
  ]

  const currentIndex = themes.findIndex(t => t.value === theme)
  const nextTheme = themes[(currentIndex + 1) % themes.length]
  const CurrentIcon = themes[currentIndex]?.icon || Sun

  return (
    <button
      onClick={() => setTheme(nextTheme.value)}
      className={cn(
        'p-2.5 rounded-xl transition-all duration-200',
        'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700',
        'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
      )}
      title={`Chuyển sang chế độ ${nextTheme.label}`}
    >
      <CurrentIcon className="w-5 h-5" />
    </button>
  )
}
