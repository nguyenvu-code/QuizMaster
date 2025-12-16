import { GoogleGenAI } from '@google/genai'
import { LLMProvider, GenerateOptions, GeneratedExam, SYSTEM_PROMPT } from './types'
import { examGenerateSchema } from '../validations'

export class GeminiProvider implements LLMProvider {
  name = 'gemini'
  private ai: GoogleGenAI

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey })
  }

  async generateQuestions(content: string, options: GenerateOptions): Promise<GeneratedExam> {
    const userPrompt = `${SYSTEM_PROMPT}

Tạo ${options.numQuestions} câu hỏi trắc nghiệm từ nội dung sau.
Độ khó: ${options.difficulty}
Thời gian làm bài: ${options.duration || 30} phút
${options.title ? `Tiêu đề đề thi: ${options.title}` : ''}

NỘI DUNG:
${content}

CHỈ trả về JSON theo format đã hướng dẫn, không có markdown code block hay text khác.`

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
    })

    const textContent = response.text

    if (!textContent) {
      throw new Error('No content in Gemini response')
    }

    // Clean up response - remove markdown code blocks if present
    let jsonContent = textContent
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .trim()

    try {
      const parsed = JSON.parse(jsonContent)
      return examGenerateSchema.parse(parsed)
    } catch (e) {
      console.error('Failed to parse Gemini response:', jsonContent)
      throw new Error('Failed to parse LLM response as valid exam JSON')
    }
  }
}
