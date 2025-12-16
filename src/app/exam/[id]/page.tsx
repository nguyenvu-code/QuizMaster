'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { QuestionCard } from '@/components/question-card'
import { QuestionNavigator } from '@/components/question-navigator'
import { Timer } from '@/components/timer'
import { useExamAttemptStore } from '@/lib/store'
import { formatDuration } from '@/lib/utils'
import { Play, Clock, BookOpen, ChevronLeft, ChevronRight, Send, AlertTriangle } from 'lucide-react'

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

interface Exam {
  id: string
  title: string
  description: string | null
  duration: number
  difficulty: string
  questions: Question[]
}

export default function ExamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [exam, setExam] = useState<Exam | null>(null)
  const [loading, setLoading] = useState(true)
  const [started, setStarted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const { 
    answers, 
    markedForReview, 
    startTime,
    setCurrentExam, 
    setAnswer, 
    toggleMarkedForReview,
    startExam,
    clearAttempt 
  } = useExamAttemptStore()

  useEffect(() => {
    fetch(`/api/exams/${id}`)
      .then(res => res.json())
      .then(data => {
        setExam(data)
        setLoading(false)
      })
      .catch(() => {
        toast.error('Không thể tải đề thi')
        setLoading(false)
      })
  }, [id])

  const handleStart = () => {
    setCurrentExam(id)
    startExam()
    setStarted(true)
  }

  const handleSubmit = async () => {
    if (!exam) return
    
    setSubmitting(true)
    try {
      const response = await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examId: id,
          answers: exam.questions.map(q => ({
            questionId: q.id,
            selectedOptionId: answers[q.id] || null
          }))
        })
      })

      if (!response.ok) throw new Error('Submit failed')

      const attempt = await response.json()
      clearAttempt()
      toast.success('Đã nộp bài thành công!')
      router.push(`/exam/${id}/result/${attempt.id}`)
    } catch {
      toast.error('Không thể nộp bài. Vui lòng thử lại.')
      setSubmitting(false)
    }
  }

  const handleTimeUp = () => {
    toast.warning('Hết giờ! Đang nộp bài...')
    handleSubmit()
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!exam) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Không tìm thấy đề thi
        </h1>
        <Button onClick={() => router.push('/')}>Về trang chủ</Button>
      </div>
    )
  }

  const currentQuestion = exam.questions[currentIndex]
  const answeredSet = new Set(Object.keys(answers).filter(k => answers[k]))
  const questionIds = exam.questions.map(q => q.id)

  // Start screen
  if (!started) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{exam.title}</CardTitle>
              <CardDescription>{exam.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800">
                  <BookOpen className="w-6 h-6 mx-auto mb-2 text-violet-600" />
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {exam.questions.length}
                  </p>
                  <p className="text-sm text-slate-500">Câu hỏi</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-violet-600" />
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {formatDuration(exam.duration)}
                  </p>
                  <p className="text-sm text-slate-500">Thời gian</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800">
                  <Badge variant={exam.difficulty === 'easy' ? 'success' : exam.difficulty === 'hard' ? 'destructive' : 'warning'} className="mb-2">
                    {exam.difficulty === 'easy' ? 'Dễ' : exam.difficulty === 'hard' ? 'Khó' : 'TB'}
                  </Badge>
                  <p className="text-sm text-slate-500">Độ khó</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  <strong>Lưu ý:</strong> Sau khi bắt đầu, đồng hồ sẽ đếm ngược. 
                  Tiến độ làm bài sẽ được lưu tự động.
                </p>
              </div>

              <Button size="lg" className="w-full gap-2" onClick={handleStart}>
                <Play className="w-5 h-5" />
                Bắt đầu làm bài
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  // Exam screen
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
          {exam.title}
        </h1>
        {startTime && (
          <Timer 
            duration={exam.duration} 
            startTime={startTime} 
            onTimeUp={handleTimeUp}
          />
        )}
      </div>

      <div className="grid lg:grid-cols-[1fr_280px] gap-6">
        {/* Question */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            <QuestionCard
              key={currentQuestion.id}
              questionNumber={currentIndex + 1}
              content={currentQuestion.content}
              options={currentQuestion.options}
              selectedOptionId={answers[currentQuestion.id]}
              onSelectOption={(optionId) => setAnswer(currentQuestion.id, optionId)}
              isMarkedForReview={markedForReview.has(currentQuestion.id)}
              onToggleReview={() => toggleMarkedForReview(currentQuestion.id)}
            />
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
              className="gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Câu trước
            </Button>

            <span className="text-sm text-slate-500">
              {currentIndex + 1} / {exam.questions.length}
            </span>

            {currentIndex === exam.questions.length - 1 ? (
              <Button onClick={() => setShowConfirm(true)} className="gap-1">
                <Send className="w-4 h-4" />
                Nộp bài
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => setCurrentIndex(i => Math.min(exam.questions.length - 1, i + 1))}
                className="gap-1"
              >
                Câu sau
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <QuestionNavigator
            totalQuestions={exam.questions.length}
            currentQuestion={currentIndex}
            answeredQuestions={answeredSet}
            markedForReview={markedForReview}
            questionIds={questionIds}
            onNavigate={setCurrentIndex}
          />

          <Button 
            variant="outline" 
            className="w-full gap-2"
            onClick={() => setShowConfirm(true)}
          >
            <Send className="w-4 h-4" />
            Nộp bài ({answeredSet.size}/{exam.questions.length})
          </Button>
        </div>
      </div>

      {/* Confirm Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-900/30">
                      <AlertTriangle className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <CardTitle>Xác nhận nộp bài</CardTitle>
                      <CardDescription>
                        Bạn đã trả lời {answeredSet.size}/{exam.questions.length} câu
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {answeredSet.size < exam.questions.length && (
                    <p className="text-sm text-amber-600 dark:text-amber-400">
                      Còn {exam.questions.length - answeredSet.size} câu chưa trả lời!
                    </p>
                  )}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowConfirm(false)}
                    >
                      Tiếp tục làm
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleSubmit}
                      isLoading={submitting}
                    >
                      Nộp bài
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
