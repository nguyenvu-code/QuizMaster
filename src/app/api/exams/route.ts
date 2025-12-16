import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createExamSchema } from '@/lib/validations'

// GET all exams
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where = search ? {
      OR: [
        { title: { contains: search } },
        { description: { contains: search } }
      ]
    } : {}

    const [exams, total] = await Promise.all([
      prisma.exam.findMany({
        where,
        include: {
          _count: { select: { questions: true, attempts: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.exam.count({ where })
    ])

    return NextResponse.json({
      exams,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get exams error:', error)
    return NextResponse.json({ error: 'Failed to fetch exams' }, { status: 500 })
  }
}

// POST create new exam
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = createExamSchema.parse(body)

    const exam = await prisma.exam.create({
      data: {
        title: validated.title,
        description: validated.description,
        duration: validated.duration,
        difficulty: validated.difficulty,
        questions: {
          create: validated.questions.map((q, index) => ({
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
    console.error('Create exam error:', error)
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid data', details: error }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create exam' }, { status: 500 })
  }
}
