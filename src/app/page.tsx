'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { PlusCircle, Play, Clock, BookOpen, Sparkles } from 'lucide-react'
import { formatDuration, formatDate } from '@/lib/utils'

interface Exam {
  id: string
  title: string
  description: string | null
  duration: number
  difficulty: string
  createdAt: string
  _count: { questions: number; attempts: number }
}

export default function HomePage() {
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/exams?limit=6')
      .then(res => res.json())
      .then(data => {
        setExams(data.exams || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const difficultyColors = {
    easy: 'success',
    medium: 'warning',
    hard: 'destructive'
  } as const

  const difficultyLabels = {
    easy: 'Dễ',
    medium: 'Trung bình',
    hard: 'Khó'
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          Tạo đề thi với AI
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="gradient-text">QuizMaster</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
          Nền tảng tạo và làm bài thi trắc nghiệm hiện đại. Upload tài liệu hoặc nhập văn bản, 
          AI sẽ tự động tạo câu hỏi chất lượng cao cho bạn.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/create">
            <Button size="lg" className="gap-2">
              <PlusCircle className="w-5 h-5" />
              Tạo đề mới
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg" className="gap-2">
              <BookOpen className="w-5 h-5" />
              Xem tất cả đề
            </Button>
          </Link>
        </div>
      </motion.section>

      {/* Recent Exams */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Đề thi gần đây
          </h2>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">Xem tất cả →</Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : exams.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="w-12 h-12 mx-auto text-slate-400 mb-4" />
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Chưa có đề thi nào. Hãy tạo đề đầu tiên!
              </p>
              <Link href="/create">
                <Button>Tạo đề ngay</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam, index) => (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="line-clamp-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                        {exam.title}
                      </CardTitle>
                      <Badge variant={difficultyColors[exam.difficulty as keyof typeof difficultyColors]}>
                        {difficultyLabels[exam.difficulty as keyof typeof difficultyLabels]}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {exam.description || 'Không có mô tả'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {exam._count.questions} câu
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDuration(exam.duration)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        {formatDate(exam.createdAt)}
                      </span>
                      <Link href={`/exam/${exam.id}`}>
                        <Button size="sm" className="gap-1">
                          <Play className="w-4 h-4" />
                          Làm bài
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
