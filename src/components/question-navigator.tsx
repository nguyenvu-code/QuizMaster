'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface QuestionNavigatorProps {
  totalQuestions: number
  currentQuestion: number
  answeredQuestions: Set<string>
  markedForReview: Set<string>
  questionIds: string[]
  onNavigate: (index: number) => void
}

export function QuestionNavigator({
  totalQuestions,
  currentQuestion,
  answeredQuestions,
  markedForReview,
  questionIds,
  onNavigate
}: QuestionNavigatorProps) {
  return (
    <div className="rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl p-4">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
        Điều hướng câu hỏi
      </h3>
      
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: totalQuestions }, (_, i) => {
          const questionId = questionIds[i]
          const isAnswered = answeredQuestions.has(questionId)
          const isMarked = markedForReview.has(questionId)
          const isCurrent = currentQuestion === i

          return (
            <motion.button
              key={i}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate(i)}
              className={cn(
                'relative w-10 h-10 rounded-xl font-medium text-sm transition-all duration-200',
                isCurrent && 'ring-2 ring-violet-500 ring-offset-2 dark:ring-offset-slate-900',
                isAnswered && !isCurrent && 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
                !isAnswered && !isCurrent && 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700',
                isCurrent && 'bg-violet-600 text-white'
              )}
            >
              {i + 1}
              {isMarked && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-500" />
              )}
            </motion.button>
          )
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-emerald-500" />
          <span className="text-slate-600 dark:text-slate-400">Đã trả lời</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-slate-300 dark:bg-slate-600" />
          <span className="text-slate-600 dark:text-slate-400">Chưa trả lời</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-slate-600 dark:text-slate-400">Đánh dấu</span>
        </div>
      </div>
    </div>
  )
}
