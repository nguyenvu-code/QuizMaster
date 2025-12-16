import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const [totalExams, totalAttempts, recentExams, topMissedQuestions] = await Promise.all([
      prisma.exam.count(),
      prisma.attempt.count(),
      prisma.exam.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { questions: true, attempts: true } }
        }
      }),
      prisma.answer.groupBy({
        by: ['questionId'],
        where: { isCorrect: false },
        _count: { questionId: true },
        orderBy: { _count: { questionId: 'desc' } },
        take: 5
      })
    ])

    // Get average score
    const avgScoreResult = await prisma.attempt.aggregate({
      _avg: { score: true },
      where: { score: { not: null } }
    })

    // Get question details for top missed
    const missedQuestionIds = topMissedQuestions.map(q => q.questionId)
    const missedQuestions = await prisma.question.findMany({
      where: { id: { in: missedQuestionIds } },
      include: { exam: { select: { title: true } } }
    })

    const topMissed = topMissedQuestions.map(tq => {
      const question = missedQuestions.find(q => q.id === tq.questionId)
      return {
        questionId: tq.questionId,
        content: question?.content || '',
        examTitle: question?.exam.title || '',
        wrongCount: tq._count.questionId
      }
    })

    return NextResponse.json({
      totalExams,
      totalAttempts,
      averageScore: avgScoreResult._avg.score || 0,
      recentExams,
      topMissedQuestions: topMissed
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
