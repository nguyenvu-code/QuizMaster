import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET single exam
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const exam = await prisma.exam.findUnique({
      where: { id },
      include: {
        questions: {
          include: { options: true },
          orderBy: { order: 'asc' }
        },
        _count: { select: { attempts: true } }
      }
    })

    if (!exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 })
    }

    return NextResponse.json(exam)
  } catch (error) {
    console.error('Get exam error:', error)
    return NextResponse.json({ error: 'Failed to fetch exam' }, { status: 500 })
  }
}

// PUT update exam
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Delete existing questions and recreate
    await prisma.question.deleteMany({ where: { examId: id } })

    const exam = await prisma.exam.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        duration: body.duration,
        difficulty: body.difficulty,
        isPublished: body.isPublished,
        questions: {
          create: body.questions?.map((q: { content: string; explanation?: string; options: { label: string; content: string; isCorrect: boolean }[] }, index: number) => ({
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

    return NextResponse.json(exam)
  } catch (error) {
    console.error('Update exam error:', error)
    return NextResponse.json({ error: 'Failed to update exam' }, { status: 500 })
  }
}

// DELETE exam
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.exam.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete exam error:', error)
    return NextResponse.json({ error: 'Failed to delete exam' }, { status: 500 })
  }
}
