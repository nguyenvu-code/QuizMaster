'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Save, Trash2, Plus, Shuffle, RefreshCw, Download, 
  ChevronLeft, ChevronRight, GripVertical, Check, X 
} from 'lucide-react'
import { cn, shuffleArray } from '@/lib/utils'

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
  isPublished: boolean
  questions: Question[]
}

export default function EditExamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [exam, setExam] = useState<Exam | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

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

  const handleSave = async () => {
    if (!exam) return
    setSaving(true)

    try {
      const response = await fetch(`/api/exams/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: exam.title,
          description: exam.description,
          duration: exam.duration,
          difficulty: exam.difficulty,
          isPublished: exam.isPublished,
          questions: exam.questions.map(q => ({
            content: q.content,
            explanation: q.explanation,
            options: q.options.map(o => ({
              label: o.label,
              content: o.content,
              isCorrect: o.isCorrect
            }))
          }))
        })
      })

      if (!response.ok) throw new Error('Save failed')
      toast.success('Đã lưu thành công!')
    } catch {
      toast.error('Không thể lưu. Vui lòng thử lại.')
    } finally {
      setSaving(false)
    }
  }

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    if (!exam) return
    const newQuestions = [...exam.questions]
    newQuestions[index] = { ...newQuestions[index], ...updates }
    setExam({ ...exam, questions: newQuestions })
  }

  const updateOption = (qIndex: number, oIndex: number, updates: Partial<Option>) => {
    if (!exam) return
    const newQuestions = [...exam.questions]
    const newOptions = [...newQuestions[qIndex].options]
    newOptions[oIndex] = { ...newOptions[oIndex], ...updates }
    newQuestions[qIndex] = { ...newQuestions[qIndex], options: newOptions }
    setExam({ ...exam, questions: newQuestions })
  }

  const setCorrectAnswer = (qIndex: number, oIndex: number) => {
    if (!exam) return
    const newQuestions = [...exam.questions]
    newQuestions[qIndex].options = newQuestions[qIndex].options.map((o, i) => ({
      ...o,
      isCorrect: i === oIndex
    }))
    setExam({ ...exam, questions: newQuestions })
  }

  const shuffleOptions = (qIndex: number) => {
    if (!exam) return
    const newQuestions = [...exam.questions]
    const shuffled = shuffleArray(newQuestions[qIndex].options)
    const labels: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D']
    newQuestions[qIndex].options = shuffled.map((o, i) => ({ ...o, label: labels[i] }))
    setExam({ ...exam, questions: newQuestions })
    toast.success('Đã xáo trộn đáp án')
  }

  const addQuestion = () => {
    if (!exam) return
    const newQuestion: Question = {
      id: `new-${Date.now()}`,
      content: 'Câu hỏi mới',
      explanation: null,
      options: [
        { id: `opt-${Date.now()}-1`, label: 'A', content: 'Đáp án A', isCorrect: true },
        { id: `opt-${Date.now()}-2`, label: 'B', content: 'Đáp án B', isCorrect: false },
        { id: `opt-${Date.now()}-3`, label: 'C', content: 'Đáp án C', isCorrect: false },
        { id: `opt-${Date.now()}-4`, label: 'D', content: 'Đáp án D', isCorrect: false },
      ]
    }
    setExam({ ...exam, questions: [...exam.questions, newQuestion] })
    setSelectedIndex(exam.questions.length)
    toast.success('Đã thêm câu hỏi mới')
  }

  const deleteQuestion = (index: number) => {
    if (!exam || exam.questions.length <= 1) {
      toast.error('Phải có ít nhất 1 câu hỏi')
      return
    }
    const newQuestions = exam.questions.filter((_, i) => i !== index)
    setExam({ ...exam, questions: newQuestions })
    setSelectedIndex(Math.min(selectedIndex, newQuestions.length - 1))
    toast.success('Đã xóa câu hỏi')
  }

  const exportJSON = () => {
    if (!exam) return
    const data = {
      title: exam.title,
      description: exam.description,
      duration: exam.duration,
      difficulty: exam.difficulty,
      questions: exam.questions.map(q => ({
        content: q.content,
        explanation: q.explanation,
        options: q.options.map(o => ({
          label: o.label,
          content: o.content,
          isCorrect: o.isCorrect
        }))
      }))
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${exam.title.replace(/\s+/g, '_')}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Đã xuất file JSON')
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <Skeleton className="h-10 w-1/2 mb-6" />
        <div className="grid lg:grid-cols-[300px_1fr] gap-6">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    )
  }

  if (!exam) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Không tìm thấy đề thi</h1>
        <Button onClick={() => router.push('/dashboard')}>Về Dashboard</Button>
      </div>
    )
  }

  const currentQuestion = exam.questions[selectedIndex]

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Chỉnh sửa đề thi
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={exportJSON} className="gap-2">
              <Download className="w-4 h-4" />
              Xuất JSON
            </Button>
            <Button onClick={handleSave} isLoading={saving} className="gap-2">
              <Save className="w-4 h-4" />
              Lưu
            </Button>
          </div>
        </div>

        {/* Exam Info */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Thông tin đề thi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Tiêu đề</label>
                <Input
                  value={exam.title}
                  onChange={e => setExam({ ...exam, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Thời gian (phút)</label>
                <Input
                  type="number"
                  value={exam.duration}
                  onChange={e => setExam({ ...exam, duration: parseInt(e.target.value) || 30 })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Độ khó</label>
                <Select
                  value={exam.difficulty}
                  onChange={e => setExam({ ...exam, difficulty: e.target.value })}
                  options={[
                    { value: 'easy', label: 'Dễ' },
                    { value: 'medium', label: 'Trung bình' },
                    { value: 'hard', label: 'Khó' }
                  ]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Mô tả</label>
                <Input
                  value={exam.description || ''}
                  onChange={e => setExam({ ...exam, description: e.target.value })}
                  placeholder="Mô tả ngắn..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-[300px_1fr] gap-6">
          {/* Question List */}
          <Card className="h-fit">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Danh sách câu hỏi</CardTitle>
                <Button size="sm" variant="ghost" onClick={addQuestion}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="max-h-[500px] overflow-y-auto space-y-2">
              {exam.questions.map((q, index) => (
                <button
                  key={q.id}
                  onClick={() => setSelectedIndex(index)}
                  className={cn(
                    'w-full flex items-center gap-2 p-3 rounded-xl text-left transition-all duration-200',
                    selectedIndex === index
                      ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                  )}
                >
                  <GripVertical className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="font-medium text-sm">{index + 1}.</span>
                  <span className="text-sm truncate flex-1">{q.content}</span>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Question Editor */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Câu {selectedIndex + 1}</CardTitle>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={() => shuffleOptions(selectedIndex)}>
                    <Shuffle className="w-4 h-4 mr-1" />
                    Xáo trộn
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => deleteQuestion(selectedIndex)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Question Content */}
              <div>
                <label className="block text-sm font-medium mb-1.5">Nội dung câu hỏi</label>
                <Textarea
                  value={currentQuestion.content}
                  onChange={e => updateQuestion(selectedIndex, { content: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>

              {/* Options */}
              <div>
                <label className="block text-sm font-medium mb-3">Các lựa chọn</label>
                <div className="space-y-3">
                  {currentQuestion.options.map((option, oIndex) => (
                    <div key={option.id} className="flex items-start gap-3">
                      <button
                        onClick={() => setCorrectAnswer(selectedIndex, oIndex)}
                        className={cn(
                          'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-semibold transition-all duration-200',
                          option.isCorrect
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
                        )}
                      >
                        {option.isCorrect ? <Check className="w-5 h-5" /> : option.label}
                      </button>
                      <Input
                        value={option.content}
                        onChange={e => updateOption(selectedIndex, oIndex, { content: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Click vào chữ cái để chọn đáp án đúng
                </p>
              </div>

              {/* Explanation */}
              <div>
                <label className="block text-sm font-medium mb-1.5">Giải thích (tùy chọn)</label>
                <Textarea
                  value={currentQuestion.explanation || ''}
                  onChange={e => updateQuestion(selectedIndex, { explanation: e.target.value || null })}
                  placeholder="Giải thích tại sao đáp án đúng..."
                  className="min-h-[80px]"
                />
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  disabled={selectedIndex === 0}
                  onClick={() => setSelectedIndex(i => i - 1)}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Câu trước
                </Button>
                <span className="text-sm text-slate-500">
                  {selectedIndex + 1} / {exam.questions.length}
                </span>
                <Button
                  variant="outline"
                  disabled={selectedIndex === exam.questions.length - 1}
                  onClick={() => setSelectedIndex(i => i + 1)}
                >
                  Câu sau
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}
