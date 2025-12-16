'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dropzone } from '@/components/dropzone'
import { Progress } from '@/components/ui/progress'
import { Upload, FileText, Sparkles, Loader2, FileCheck, CheckCircle } from 'lucide-react'
import { parseFileWithColors, parseQuizFromText } from '@/lib/parsers'
import { countWords } from '@/lib/utils'

export default function CreatePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('upload')
  
  // Upload tab state
  const [uploadedContent, setUploadedContent] = useState('')
  const [uploadedRedTexts, setUploadedRedTexts] = useState<string[]>([])
  const [uploadedFileName, setUploadedFileName] = useState('')
  const [detectedQuestions, setDetectedQuestions] = useState(0)
  const [detectedCorrectAnswers, setDetectedCorrectAnswers] = useState(0)
  const [fileReady, setFileReady] = useState(false)
  
  // AI tab state
  const [aiPrompt, setAiPrompt] = useState('')
  const [title, setTitle] = useState('')
  const [numQuestions, setNumQuestions] = useState(10)
  const [difficulty, setDifficulty] = useState('medium')
  const [duration, setDuration] = useState(30)
  
  // Common state
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState('')
  const [progress, setProgress] = useState(0)

  // Upload file và parse câu hỏi
  const handleFileSelect = async (file: File) => {
    setIsProcessing(true)
    setProcessingStep('Đang đọc file...')
    setProgress(20)
    setUploadedFileName(file.name)
    setFileReady(false)

    try {
      const result = await parseFileWithColors(file)
      setProgress(60)
      setProcessingStep('Đang phân tích câu hỏi...')
      setUploadedContent(result.text)
      setUploadedRedTexts(result.redTexts || [])
      
      const parsed = parseQuizFromText(result.text, result.redTexts)
      setDetectedQuestions(parsed.questions.length)
      
      // Đếm số đáp án đúng được phát hiện
      const correctCount = parsed.questions.filter(q => 
        q.options.some(opt => opt.isCorrect)
      ).length
      setDetectedCorrectAnswers(correctCount)
      
      setProgress(100)
      setFileReady(true)
      
      if (parsed.questions.length >= 1) {
        let message = `Phát hiện ${parsed.questions.length} câu hỏi`
        if (correctCount > 0) {
          message += ` (${correctCount} câu có đáp án đúng màu đỏ)`
        }
        toast.success(message)
        setProcessingStep(`Sẵn sàng import ${parsed.questions.length} câu hỏi`)
      } else {
        toast.error('Không tìm thấy câu hỏi trong file. Vui lòng kiểm tra format.')
        setProcessingStep('Không tìm thấy câu hỏi')
      }
      
      setTimeout(() => {
        setIsProcessing(false)
        setProgress(0)
      }, 500)
    } catch (error) {
      toast.error('Không thể đọc file. Vui lòng thử lại.')
      setIsProcessing(false)
      setProgress(0)
      setFileReady(false)
    }
  }

  // Import câu hỏi từ file (KHÔNG dùng AI)
  const handleImportFromFile = async () => {
    if (detectedQuestions < 1) {
      toast.error('Không có câu hỏi để import')
      return
    }

    setIsProcessing(true)
    setProcessingStep('Đang import câu hỏi...')
    setProgress(30)

    try {
      const response = await fetch('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: uploadedContent,
          title: title || uploadedFileName.replace(/\.[^/.]+$/, ''),
          duration: duration,
          redTexts: uploadedRedTexts
        })
      })

      setProgress(80)

      if (!response.ok) {
        throw new Error('Import failed')
      }

      const exam = await response.json()
      setProgress(100)
      toast.success(`Đã import ${exam.questions?.length || detectedQuestions} câu hỏi!`)
      
      setTimeout(() => {
        router.push(`/exam/${exam.id}/edit`)
      }, 500)
    } catch (error) {
      toast.error('Không thể import. Vui lòng thử lại.')
      setIsProcessing(false)
      setProgress(0)
    }
  }

  // Tạo câu hỏi bằng AI
  const handleGenerateWithAI = async () => {
    if (aiPrompt.length < 10) {
      toast.error('Vui lòng nhập yêu cầu chi tiết hơn (ít nhất 10 ký tự)')
      return
    }

    setIsProcessing(true)
    setProcessingStep('Đang gửi yêu cầu đến AI...')
    setProgress(20)

    try {
      setProcessingStep('AI đang tạo câu hỏi...')
      setProgress(50)

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: aiPrompt,
          numQuestions,
          difficulty,
          duration,
          title: title || undefined,
          useAI: true
        })
      })

      setProgress(80)

      if (!response.ok) {
        throw new Error('Generate failed')
      }

      const exam = await response.json()
      setProgress(100)
      setProcessingStep('Hoàn thành!')
      
      toast.success(`AI đã tạo ${exam.questions?.length || numQuestions} câu hỏi!`)
      
      setTimeout(() => {
        router.push(`/exam/${exam.id}/edit`)
      }, 500)
    } catch (error) {
      toast.error('Không thể tạo đề. Vui lòng thử lại.')
      setIsProcessing(false)
      setProgress(0)
    }
  }

  const wordCount = countWords(aiPrompt)

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Tạo đề thi mới
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Upload file Word có sẵn câu hỏi hoặc nhờ AI tạo câu hỏi mới.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Chọn cách tạo đề</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6 w-full grid grid-cols-2">
                <TabsTrigger value="upload" className="gap-2">
                  <Upload className="w-4 h-4" />
                  Import từ file
                </TabsTrigger>
                <TabsTrigger value="ai" className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  Tạo bằng AI
                </TabsTrigger>
              </TabsList>

              {/* TAB 1: Import từ file */}
              <TabsContent value="upload">
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-sm text-blue-700 dark:text-blue-300">
                    📄 Upload file Word (.docx) hoặc Text (.txt) có sẵn câu hỏi trắc nghiệm. 
                    Hệ thống sẽ tự động nhận diện và import.
                    <br />
                    💡 <strong>Tip:</strong> Tô màu đỏ cho đáp án đúng trong file Word, hệ thống sẽ tự động nhận diện!
                  </div>
                  
                  <Dropzone 
                    onFileSelect={handleFileSelect}
                    className="min-h-[180px]"
                  />
                  
                  {/* Kết quả sau khi upload */}
                  {fileReady && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-2xl border ${
                        detectedQuestions >= 1 
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                          : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <CheckCircle className={`w-5 h-5 mt-0.5 ${
                          detectedQuestions >= 1 ? 'text-emerald-600' : 'text-red-600'
                        }`} />
                        <div className="flex-1">
                          <p className={`font-medium ${
                            detectedQuestions >= 1 
                              ? 'text-emerald-700 dark:text-emerald-300'
                              : 'text-red-700 dark:text-red-300'
                          }`}>
                            {detectedQuestions >= 1 
                              ? `Phát hiện ${detectedQuestions} câu hỏi`
                              : 'Không tìm thấy câu hỏi'
                            }
                            {detectedCorrectAnswers > 0 && (
                              <span className="ml-2 text-sm font-normal text-violet-600 dark:text-violet-400">
                                ({detectedCorrectAnswers} câu có đáp án đúng màu đỏ)
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            File: {uploadedFileName}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Tiêu đề và thời gian cho import */}
                  {fileReady && detectedQuestions >= 1 && (
                    <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t">
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Tiêu đề đề thi</label>
                        <Input
                          placeholder={uploadedFileName.replace(/\.[^/.]+$/, '')}
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Thời gian (phút)</label>
                        <Input
                          type="number"
                          min={1}
                          max={180}
                          value={duration}
                          onChange={(e) => setDuration(parseInt(e.target.value) || 30)}
                        />
                      </div>
                    </div>
                  )}

                  {/* Nút Import */}
                  {fileReady && detectedQuestions >= 1 && (
                    <div className="flex justify-end pt-4">
                      <Button
                        size="lg"
                        onClick={handleImportFromFile}
                        disabled={isProcessing}
                        isLoading={isProcessing}
                        className="gap-2"
                      >
                        <FileCheck className="w-5 h-5" />
                        Import {detectedQuestions} câu hỏi
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* TAB 2: Tạo bằng AI */}
              <TabsContent value="ai">
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-violet-50 dark:bg-violet-900/20 text-sm text-violet-700 dark:text-violet-300">
                    🤖 Nhập chủ đề hoặc nội dung, AI (Gemini) sẽ tự động tạo câu hỏi trắc nghiệm cho bạn.
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Nhập yêu cầu / chủ đề / nội dung
                    </label>
                    <Textarea
                      placeholder="Ví dụ:&#10;- Tạo 10 câu hỏi về lịch sử Việt Nam thời kỳ Bắc thuộc&#10;- Tạo câu hỏi về JavaScript cơ bản cho người mới học&#10;- Hoặc dán nội dung bài học vào đây..."
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      className="min-h-[150px]"
                    />
                    <p className="text-sm text-slate-500 text-right mt-1">{wordCount} từ</p>
                  </div>

                  {/* Cài đặt AI */}
                  <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Tiêu đề (tùy chọn)</label>
                      <Input
                        placeholder="Nhập tiêu đề đề thi..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Số câu hỏi</label>
                      <Input
                        type="number"
                        min={1}
                        max={50}
                        value={numQuestions}
                        onChange={(e) => setNumQuestions(parseInt(e.target.value) || 10)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Độ khó</label>
                      <Select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        options={[
                          { value: 'easy', label: 'Dễ' },
                          { value: 'medium', label: 'Trung bình' },
                          { value: 'hard', label: 'Khó' }
                        ]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Thời gian (phút)</label>
                      <Input
                        type="number"
                        min={1}
                        max={180}
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value) || 30)}
                      />
                    </div>
                  </div>

                  {/* Nút tạo AI */}
                  <div className="flex justify-end pt-4">
                    <Button
                      size="lg"
                      onClick={handleGenerateWithAI}
                      disabled={isProcessing || aiPrompt.length < 10}
                      isLoading={isProcessing}
                      className="gap-2"
                    >
                      <Sparkles className="w-5 h-5" />
                      Tạo đề với AI
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Progress */}
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6 p-4 rounded-2xl bg-violet-50 dark:bg-violet-900/20"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Loader2 className="w-5 h-5 text-violet-600 animate-spin" />
                  <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
                    {processingStep}
                  </span>
                </div>
                <Progress value={progress} />
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
