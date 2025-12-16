import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { parseQuizFromText } from '@/lib/parsers'

// POST - Import câu hỏi từ file (KHÔNG dùng AI)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, title, duration = 30, redTexts } = body

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    // Parse câu hỏi từ content (với redTexts để đánh dấu đáp án đúng)
    const parsed = parseQuizFromText(content, redTexts)

    if (parsed.questions.length === 0) {
      return NextResponse.json({ 
        error: 'Không tìm thấy câu hỏi trong nội dung. Vui lòng kiểm tra format.' 
      }, { status: 400 })
    }

    console.log(`Importing ${parsed.questions.length} questions from file`)

    // Lưu vào database
    const exam = await prisma.exam.create({
      data: {
        title: title || `Đề thi import (${parsed.questions.length} câu)`,
        description: `Import từ file với ${parsed.questions.length} câu hỏi`,
        duration: duration,
        difficulty: 'medium',
        questions: {
          create: parsed.questions.map((q, index) => ({
            content: q.content,
            explanation: q.explanation || null,
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
    console.error('Import error:', error)
    return NextResponse.json({ error: 'Failed to import questions' }, { status: 500 })
  }
}
