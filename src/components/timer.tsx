'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Clock, AlertTriangle } from 'lucide-react'

interface TimerProps {
  duration: number // in minutes
  startTime: number // timestamp
  onTimeUp?: () => void
  className?: string
}

export function Timer({ duration, startTime, onTimeUp, className }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(duration * 60)

  useEffect(() => {
    const endTime = startTime + duration * 60 * 1000
    
    const updateTimer = () => {
      const now = Date.now()
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000))
      setTimeLeft(remaining)
      
      if (remaining === 0 && onTimeUp) {
        onTimeUp()
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [duration, startTime, onTimeUp])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const isLow = timeLeft < 300 // less than 5 minutes
  const isCritical = timeLeft < 60 // less than 1 minute

  return (
    <div className={cn(
      'flex items-center gap-2 px-4 py-2 rounded-2xl font-mono text-lg font-semibold transition-all duration-300',
      isCritical 
        ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 animate-pulse' 
        : isLow 
          ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
      className
    )}>
      {isCritical ? (
        <AlertTriangle className="w-5 h-5" />
      ) : (
        <Clock className="w-5 h-5" />
      )}
      <span>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  )
}
