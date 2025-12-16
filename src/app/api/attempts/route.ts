import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { submitAttemptSchema } from '@/lib/validations'

// POST submit attempt
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = submitAttemptSchema.parse(body)

    // Get exam with correct answers
    const exam = await prisma.exam.findUnique({
      where: { id: validated.examId },
      include: {
        questions: {
          include: { options: true }
        }
      }
    })

    if (!exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 })
    }

    // Calculate score
    let correctCount = 0
    const answersWithCorrectness = validated.answers.map(answer => {
      const question = exam.questions.find(q => q.id === answer.questionId)
      const correctOption = question?.options.find(o => o.isCorrect)
      const isCorrect = answer.selectedOptionId === correctOption?.id
      if (isCorrect) correctCount++
      return { ...answer, isCorrect }
    })

    // Create attempt
    const attempt = await prisma.attempt.create({
      data: {
        examId: validated.examId,
        score: correctCount,
        totalScore: exam.questions.length,
        submittedAt: new Date(),
        answers: {
          create: answersWithCorrectness.map(a => ({
            questionId: a.questionId,
            selectedOptionId: a.selectedOptionId,
            isCorrect: a.isCorrect
          }))
        }
      },
      include: {
        answers: true,
        exam: {
          include: {
            questions: {
              include: { options: true },
              orderBy: { order: 'asc' }
            }
          }
        }
      }
    })

    return NextResponse.json(attempt, { status: 201 })
  } catch (error) {
    console.error('Submit attempt error:', error)
    return NextResponse.json({ error: 'Failed to submit attempt' }, { status: 500 })
  }
}

// GET attempts for an exam
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const examId = searchParams.get('examId')

    const where = examId ? { examId } : {}

    const attempts = await prisma.attempt.findMany({
      where,
      include: {
        exam: { select: { title: true } },
        _count: { select: { answers: true } }
      },
      orderBy: { submittedAt: 'desc' }
    })

    return NextResponse.json(attempts)
  } catch (error) {
    console.error('Get attempts error:', error)
    return NextResponse.json({ error: 'Failed to fetch attempts' }, { status: 500 })
  }
}
