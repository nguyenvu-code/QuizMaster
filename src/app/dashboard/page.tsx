'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Search, Plus, BookOpen, Users, TrendingUp, AlertTriangle,
  Play, Edit, Trash2, MoreVertical, Clock
} from 'lucide-react'
import { formatDate, formatDuration } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface Exam {
  id: string
  title: string
  description: string | null
  duration: number
  difficulty: string
  createdAt: string
  _count: { questions: number; attempts: number }
}

interface Stats {
  totalExams: number
  totalAttempts: number
  averageScore: number
  recentExams: Exam[]
  topMissedQuestions: {
    questionId: string
    content: string
    examTitle: string
    wrongCount: number
  }[]
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/dashboard/stats').then(r => r.json()),
      fetch('/api/exams?limit=50').then(r => r.json())
    ])
      .then(([statsData, examsData]) => {
        setStats(statsData)
        setExams(examsData.exams || [])
        setLoading(false)
      })
      .catch(() => {
        toast.error('Không thể tải dữ liệu')
        setLoading(false)
      })
  }, [])

  const handleDelete = async (examId: string) => {
    if (!confirm('Bạn có chắc muốn xóa đề thi này?')) return
    
    setDeleting(examId)
    try {
      const response = await fetch(`/api/exams/${examId}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Delete failed')
      
      setExams(exams.filter(e => e.id !== examId))
      toast.success('Đã xóa đề thi')
    } catch {
      toast.error('Không thể xóa đề thi')
    } finally {
      setDeleting(null)
    }
  }

  const filteredExams = exams.filter(exam =>
    exam.title.toLowerCase().includes(search.toLowerCase()) ||
    exam.description?.toLowerCase().includes(search.toLowerCase())
  )

  const difficultyColors = {
    easy: 'success',
    medium: 'warning',
    hard: 'destructive'
  } as const

  const difficultyLabels = {
    easy: 'Dễ',
    medium: 'TB',
    hard: 'Khó'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Quản lý đề thi và xem thống kê
            </p>
          </div>
          <Link href="/create">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Tạo đề mới
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-violet-100 dark:bg-violet-900/30">
                  <BookOpen className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    {stats?.totalExams || 0}
                  </p>
                  <p className="text-sm text-slate-500">Tổng đề thi</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30">
                  <Users className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    {stats?.totalAttempts || 0}
                  </p>
                  <p className="text-sm text-slate-500">Lượt làm bài</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-900/30">
                  <TrendingUp className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    {stats?.averageScore ? `${Math.round(stats.averageScore * 10)}%` : 'N/A'}
                  </p>
                  <p className="text-sm text-slate-500">Điểm trung bình</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Missed Questions */}
        {stats?.topMissedQuestions && stats.topMissedQuestions.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Câu hỏi sai nhiều nhất
              </CardTitle>
              <CardDescription>
                Những câu hỏi mà người làm bài thường trả lời sai
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.topMissedQuestions.map((q, index) => (
                  <div
                    key={q.questionId}
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50"
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">
                        {q.content}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {q.examTitle} • {q.wrongCount} lần sai
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Exams List */}
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <CardTitle>Danh sách đề thi</CardTitle>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Tìm kiếm..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredExams.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  {search ? 'Không tìm thấy đề thi phù hợp' : 'Chưa có đề thi nào'}
                </p>
                {!search && (
                  <Link href="/create">
                    <Button>Tạo đề đầu tiên</Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredExams.map((exam, index) => (
                  <motion.div
                    key={exam.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      'flex flex-wrap items-center gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-700 transition-all duration-200',
                      deleting === exam.id && 'opacity-50'
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {exam.title}
                        </h3>
                        <Badge variant={difficultyColors[exam.difficulty as keyof typeof difficultyColors]}>
                          {difficultyLabels[exam.difficulty as keyof typeof difficultyLabels]}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" />
                          {exam._count.questions} câu
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDuration(exam.duration)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {exam._count.attempts} lượt
                        </span>
                        <span>{formatDate(exam.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link href={`/exam/${exam.id}`}>
                        <Button size="sm" variant="outline" className="gap-1">
                          <Play className="w-3.5 h-3.5" />
                          Làm
                        </Button>
                      </Link>
                      <Link href={`/exam/${exam.id}/edit`}>
                        <Button size="sm" variant="outline" className="gap-1">
                          <Edit className="w-3.5 h-3.5" />
                          Sửa
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={() => handleDelete(exam.id)}
                        disabled={deleting === exam.id}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
