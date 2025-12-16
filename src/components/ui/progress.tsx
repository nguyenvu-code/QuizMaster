'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface ProgressProps {
  value: number
  max?: number
  className?: string
  indicatorClassName?: string
}

function Progress({ value, max = 100, className, indicatorClassName }: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div
      className={cn(
        'relative h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700',
        className
      )}
    >
      <div
        className={cn(
          'h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 transition-all duration-500 ease-out',
          indicatorClassName
        )}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}

export { Progress }
