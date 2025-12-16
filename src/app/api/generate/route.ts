import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createLLMProvider } from '@/lib/llm'
import { generateRequestSchema } from '@/lib/validations'

// POST - Tạo câu hỏi bằng AI
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = generateRequestSchema.parse(body)

    console.log('Generating questions with AI...')

    // Lấy LLM provider
    const providerType = process.env.LLM_PROVIDER as 'openai' | 'claude' | 'gemini' | 'mock' || 'mock'
    const provider = createLLMProvider(providerType)

    console.log(`Using ${provider.name} provider`)

    // Gọi AI tạo câu hỏi
    const generatedExam = await provider.generateQuestions(validated.content, {
      numQuestions: validated.numQuestions,
      difficulty: validated.difficulty,
      title: validated.title,
      duration: validated.duration
    })

    console.log(`AI generated ${generatedExam.questions.length} questions`)

    // Lưu vào database
    const exam = await prisma.exam.create({
      data: {
        title: generatedExam.title,
        description: generatedExam.description,
        duration: generatedExam.durationMinutes,
        difficulty: generatedExam.difficulty,
        questions: {
          create: generatedExam.questions.map((q, index) => ({
            content: q.content,
            explanation: q.explanation,
            order: index,
            options: {
              create: q.options.map(opt => ({
                label: opt.label,
                content: opt.content,
                isCorrect: opt.isCorrect
              }))
            }
          }))
        }
      },
      include: {
        questions: {
          include: { options: true },
          orderBy: { order: 'asc' }
        }
      }
    })

    return NextResponse.json(exam, { status: 201 })
  } catch (error) {
    console.error('Generate exam error:', error)
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid request data', details: error }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to generate exam' }, { status: 500 })
  }
}
