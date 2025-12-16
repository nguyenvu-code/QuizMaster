'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Flag } from 'lucide-react'

interface Option {
  id: string
  label: string
  content: string
  isCorrect?: boolean
}

interface QuestionCardProps {
  questionNumber: number
  content: string
  options: Option[]
  selectedOptionId?: string | null
  onSelectOption?: (optionId: string) => void
  showResult?: boolean
  isMarkedForReview?: boolean
  onToggleReview?: () => void
  explanation?: string
  disabled?: boolean
}

export function QuestionCard({
  questionNumber,
  content,
  options,
  selectedOptionId,
  onSelectOption,
  showResult = false,
  isMarkedForReview = false,
  onToggleReview,
  explanation,
  disabled = false
}: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl p-6"
    >
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg">
            {questionNumber}
          </span>
          <p className="text-lg text-slate-800 dark:text-slate-200 leading-relaxed pt-1">
            {content}
          </p>
        </div>
        {onToggleReview && !showResult && (
          <button
            onClick={onToggleReview}
            className={cn(
              'p-2 rounded-xl transition-all duration-200',
              isMarkedForReview
                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-amber-500'
            )}
          >
            <Flag className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="space-y-3">
        {options.map((option) => {
          const isSelected = selectedOptionId === option.id
          const isCorrect = option.isCorrect
          
          let optionStyle = 'border-slate-200 dark:border-slate-700 hover:border-violet-400 dark:hover:border-violet-500 hover:bg-violet-50/50 dark:hover:bg-violet-900/20'
          
          if (isSelected && !showResult) {
            optionStyle = 'border-violet-500 bg-violet-50 dark:bg-violet-900/30 ring-2 ring-violet-500/30'
          }
          
          if (showResult) {
            if (isCorrect) {
              optionStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30'
            } else if (isSelected && !isCorrect) {
              optionStyle = 'border-red-500 bg-red-50 dark:bg-red-900/30'
            }
          }

          return (
            <motion.button
              key={option.id}
              whileHover={!disabled && !showResult ? { scale: 1.01 } : {}}
              whileTap={!disabled && !showResult ? { scale: 0.99 } : {}}
              onClick={() => !disabled && !showResult && onSelectOption?.(option.id)}
              disabled={disabled || showResult}
              className={cn(
                'w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left',
                optionStyle,
                (disabled || showResult) && 'cursor-default'
              )}
            >
              <span className={cn(
                'flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center font-semibold text-sm',
                isSelected && !showResult && 'bg-violet-600 text-white',
                showResult && isCorrect && 'bg-emerald-600 text-white',
                showResult && isSelected && !isCorrect && 'bg-red-600 text-white',
                !isSelected && !showResult && 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              )}>
                {option.label}
              </span>
              <span className="flex-1 text-slate-700 dark:text-slate-300">
                {option.content}
              </span>
              {showResult && isCorrect && (
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              )}
              {showResult && isSelected && !isCorrect && (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
            </motion.button>
          )
        })}
      </div>

      {showResult && explanation && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
        >
          <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Giải thích:</p>
          <p className="text-sm text-blue-600 dark:text-blue-400">{explanation}</p>
        </motion.div>
      )}
    </motion.div>
  )
}
