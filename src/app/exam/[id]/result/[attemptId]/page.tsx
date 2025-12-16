'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { QuestionCard } from '@/components/question-card'
import { 
  Trophy, Target, Clock, CheckCircle, XCircle, 
  RotateCcw, Home, ChevronDown, ChevronUp 
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Option {
  id: string
  label: string
  content: string
  isCorrect: boolean
}

interface Question {
  id: string
  content: string
  explanation: string | null
  options: Option[]
}

interface Answer {
  id: string
  questionId: string
  selectedOptionId: string | null
  isCorrect: boolean | null
  question: Question
}

interface Attempt {
  id: string
  score: number
  totalScore: number
  startedAt: string
  submittedAt: string
  answers: Answer[]
  exam: {
    id: string
    title: string
    questions: Question[]
  }
}

export default function ResultPage({ 
  params 
}: { 
  params: Promise<{ id: string; attemptId: string }> 
}) {
  const { id, attemptId } = use(params)
  const router = useRouter()
  const [attempt, setAttempt] = useState<Attempt | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAllQuestions, setShowAllQuestions] = useState(false)

  useEffect(() => {
    fetch(`/api/attempts/${attemptId}`)
      .then(res => res.json())
      .then(data => {
        setAttempt(data)
        setLoading(false)
      })
      .catch(() => {
        toast.error('Không thể tải kết quả')
        setLoading(false)
      })
  }, [attemptId])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/2 mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!attempt) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Không tìm thấy kết quả</h1>
        <Button onClick={() => router.push('/')}>Về trang chủ</Button>
      </div>
    )
  }

  const percentage = Math.round((attempt.score / attempt.totalScore) * 100)
  const correctCount = attempt.answers.filter(a => a.isCorrect).length
  const wrongCount = attempt.answers.filter(a => !a.isCorrect && a.selectedOptionId).length
  const skippedCount = attempt.answers.filter(a => !a.selectedOptionId).length

  const getGrade = () => {
    if (percentage >= 90) return { label: 'Xuất sắc', color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30' }
    if (percentage >= 70) return { label: 'Tốt', color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' }
    if (percentage >= 50) return { label: 'Đạt', color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30' }
    return { label: 'Cần cải thiện', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30' }
  }

  const grade = getGrade()
  const duration = attempt.submittedAt && attempt.startedAt
    ? Math.round((new Date(attempt.submittedAt).getTime() - new Date(attempt.startedAt).getTime()) / 60000)
    : 0

  const questionsToShow = showAllQuestions 
    ? attempt.exam.questions 
    : attempt.exam.questions.slice(0, 3)

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Result Summary */}
        <Card className="overflow-hidden">
          <div className={`p-6 ${grade.bg}`}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy className={`w-8 h-8 ${grade.color}`} />
              <h1 className={`text-3xl font-bold ${grade.color}`}>{grade.label}</h1>
            </div>
            <div className="text-center">
              <p className="text-6xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                {percentage}%
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                {attempt.score} / {attempt.totalScore} câu đúng
              </p>
            </div>
          </div>

          <CardContent className="pt-6">
            <h2 className="font-semibold text-lg mb-2">{attempt.exam.title}</h2>
            <p className="text-sm text-slate-500 mb-6">
              Hoàn thành lúc {formatDate(attempt.submittedAt)}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-center">
                <CheckCircle className="w-6 h-6 mx-auto mb-2 text-emerald-600" />
                <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{correctCount}</p>
                <p className="text-sm text-emerald-600 dark:text-emerald-400">Đúng</p>
              </div>
              <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 text-center">
                <XCircle className="w-6 h-6 mx-auto mb-2 text-red-600" />
                <p className="text-2xl font-bold text-red-700 dark:text-red-300">{wrongCount}</p>
                <p className="text-sm text-red-600 dark:text-red-400">Sai</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-center">
                <Target className="w-6 h-6 mx-auto mb-2 text-slate-600" />
                <p className="text-2xl font-bold text-slate-700 dark:text-slate-300">{skippedCount}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Bỏ qua</p>
              </div>
              <div className="p-4 rounded-2xl bg-violet-50 dark:bg-violet-900/20 text-center">
                <Clock className="w-6 h-6 mx-auto mb-2 text-violet-600" />
                <p className="text-2xl font-bold text-violet-700 dark:text-violet-300">{duration}</p>
                <p className="text-sm text-violet-600 dark:text-violet-400">Phút</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Tiến độ</span>
                <span className="font-medium">{percentage}%</span>
              </div>
              <Progress value={percentage} />
            </div>

            {/* Wrong Answers Summary */}
            {wrongCount > 0 && (
              <div className="mt-6 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <h3 className="font-semibold text-red-700 dark:text-red-300 mb-3 flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  Các câu trả lời sai ({wrongCount} câu)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {attempt.answers
                    .map((answer, idx) => ({ answer, idx: idx + 1 }))
                    .filter(({ answer }) => !answer.isCorrect && answer.selectedOptionId)
                    .map(({ answer, idx }) => {
                      const correctOption = answer.question.options.find(o => o.isCorrect)
                      const selectedOption = answer.question.options.find(o => o.id === answer.selectedOptionId)
                      return (
                        <button
                          key={answer.id}
                          onClick={() => {
                            setShowAllQuestions(true)
                            setTimeout(() => {
                              document.getElementById(`question-${answer.questionId}`)?.scrollIntoView({ 
                                behavior: 'smooth', 
                                block: 'center' 
                              })
                            }, 100)
                          }}
                          className="group relative px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors"
                        >
                          Câu {idx}
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none max-w-xs">
                            <span className="block text-red-400">Bạn chọn: {selectedOption?.label}</span>
                            <span className="block text-emerald-400">Đáp án đúng: {correctOption?.label}</span>
                          </span>
                        </button>
                      )
                    })}
                </div>
              </div>
            )}

            {/* Skipped Questions Summary */}
            {skippedCount > 0 && (
              <div className="mt-4 p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Các câu bỏ qua ({skippedCount} câu)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {attempt.answers
                    .map((answer, idx) => ({ answer, idx: idx + 1 }))
                    .filter(({ answer }) => !answer.selectedOptionId)
                    .map(({ answer, idx }) => {
                      const correctOption = answer.question.options.find(o => o.isCorrect)
                      return (
                        <button
                          key={answer.id}
                          onClick={() => {
                            setShowAllQuestions(true)
                            setTimeout(() => {
                              document.getElementById(`question-${answer.questionId}`)?.scrollIntoView({ 
                                behavior: 'smooth', 
                                block: 'center' 
                              })
                            }, 100)
                          }}
                          className="group relative px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                        >
                          Câu {idx}
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                            <span className="block text-emerald-400">Đáp án đúng: {correctOption?.label}</span>
                          </span>
                        </button>
                      )
                    })}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mt-6">
              <Link href={`/exam/${id}`}>
                <Button className="gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Làm lại
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="gap-2">
                  <Home className="w-4 h-4" />
                  Trang chủ
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Review Questions */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Xem lại đáp án
          </h2>

          <div className="space-y-4">
            {questionsToShow.map((question, index) => {
              const answer = attempt.answers.find(a => a.questionId === question.id)
              const isWrong = !answer?.isCorrect && answer?.selectedOptionId
              const isSkipped = !answer?.selectedOptionId
              return (
                <div 
                  key={question.id} 
                  id={`question-${question.id}`}
                  className={`rounded-2xl ${isWrong ? 'ring-2 ring-red-300 dark:ring-red-700' : isSkipped ? 'ring-2 ring-slate-300 dark:ring-slate-600' : ''}`}
                >
                  <QuestionCard
                    questionNumber={index + 1}
                    content={question.content}
                    options={question.options}
                    selectedOptionId={answer?.selectedOptionId}
                    showResult={true}
                    explanation={question.explanation || undefined}
                    disabled
                  />
                </div>
              )
            })}
          </div>

          {attempt.exam.questions.length > 3 && (
            <Button
              variant="outline"
              className="w-full mt-4 gap-2"
              onClick={() => setShowAllQuestions(!showAllQuestions)}
            >
              {showAllQuestions ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Thu gọn
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Xem tất cả {attempt.exam.questions.length} câu
                </>
              )}
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
