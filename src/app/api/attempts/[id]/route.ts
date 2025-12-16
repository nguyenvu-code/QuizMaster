import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET single attempt with full details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const attempt = await prisma.attempt.findUnique({
      where: { id },
      include: {
        answers: {
          include: {
            question: {
              include: { options: true }
            },
            selectedOption: true
          }
        },
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

    if (!attempt) {
      return NextResponse.json({ error: 'Attempt not found' }, { status: 404 })
    }

    return NextResponse.json(attempt)
  } catch (error) {
    console.error('Get attempt error:', error)
    return NextResponse.json({ error: 'Failed to fetch attempt' }, { status: 500 })
  }
}
