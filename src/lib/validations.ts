import { z } from 'zod'

export const optionSchema = z.object({
  label: z.enum(['A', 'B', 'C', 'D']),
  content: z.string().min(1, 'Nội dung không được để trống'),
  isCorrect: z.boolean()
})

export const questionSchema = z.object({
  content: z.string().min(1, 'Câu hỏi không được để trống'),
  options: z.array(optionSchema).length(4, 'Phải có đúng 4 lựa chọn'),
  explanation: z.string().optional()
})

export const examGenerateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  durationMinutes: z.number().min(1).max(180).default(30),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  questions: z.array(questionSchema).min(1, 'Phải có ít nhất 1 câu hỏi')
})

export const createExamSchema = z.object({
  title: z.string().min(1, 'Tiêu đề không được để trống'),
  description: z.string().optional(),
  duration: z.number().min(1).max(180).default(30),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  questions: z.array(questionSchema).min(1)
})

export const generateRequestSchema = z.object({
  content: z.string().min(10, 'Nội dung phải có ít nhất 10 ký tự'),
  numQuestions: z.number().min(1).max(50).default(10),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  duration: z.number().min(1).max(180).default(30),
  title: z.string().optional()
})

export const submitAttemptSchema = z.object({
  examId: z.string(),
  answers: z.array(z.object({
    questionId: z.string(),
    selectedOptionId: z.string().nullable()
  }))
})

export type ExamGenerate = z.infer<typeof examGenerateSchema>
export type CreateExam = z.infer<typeof createExamSchema>
export type GenerateRequest = z.infer<typeof generateRequestSchema>
export type SubmitAttempt = z.infer<typeof submitAttemptSchema>
