import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

const SYSTEM_PROMPT = `Bạn là trợ lý học tập thông minh của QuizMaster. Nhiệm vụ của bạn:
- Giải đáp thắc mắc về các câu hỏi trắc nghiệm
- Giải thích kiến thức, khái niệm
- Hỗ trợ ôn tập và học tập
- Đưa ra gợi ý và mẹo làm bài thi
- Trả lời ngắn gọn, dễ hiểu
- Sử dụng tiếng Việt

Hãy trả lời thân thiện và hữu ích.`

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      )
    }

    const ai = new GoogleGenAI({ apiKey })

    // Build conversation context
    let conversationContext = SYSTEM_PROMPT + '\n\n'
    
    if (history && Array.isArray(history)) {
      for (const msg of history.slice(-10)) { // Keep last 10 messages for context
        conversationContext += `${msg.role === 'user' ? 'Người dùng' : 'Trợ lý'}: ${msg.content}\n`
      }
    }
    
    conversationContext += `Người dùng: ${message}\nTrợ lý:`

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: conversationContext,
    })

    const reply = response.text || 'Xin lỗi, tôi không thể trả lời lúc này.'

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}
