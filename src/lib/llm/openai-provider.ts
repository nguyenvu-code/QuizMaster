import { LLMProvider, GenerateOptions, GeneratedExam, SYSTEM_PROMPT } from './types'
import { examGenerateSchema } from '../validations'

export class OpenAIProvider implements LLMProvider {
  name = 'openai'
  private apiKey: string
  private model: string

  constructor(apiKey: string, model = 'gpt-4o-mini') {
    this.apiKey = apiKey
    this.model = model
  }

  async generateQuestions(content: string, options: GenerateOptions): Promise<GeneratedExam> {
    const userPrompt = `Tạo ${options.numQuestions} câu hỏi trắc nghiệm từ nội dung sau.
Độ khó: ${options.difficulty}
Thời gian làm bài: ${options.duration || 30} phút
${options.title ? `Tiêu đề đề thi: ${options.title}` : ''}

NỘI DUNG:
${content}

Trả về JSON theo format đã hướng dẫn.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const jsonContent = data.choices[0].message.content

    try {
      const parsed = JSON.parse(jsonContent)
      return examGenerateSchema.parse(parsed)
    } catch {
      throw new Error('Failed to parse LLM response as valid exam JSON')
    }
  }
}
