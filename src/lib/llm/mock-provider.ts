import { LLMProvider, GenerateOptions, GeneratedExam } from './types'

// Mock provider for demo - generates sample questions
export class MockLLMProvider implements LLMProvider {
  name = 'mock'

  async generateQuestions(content: string, options: GenerateOptions): Promise<GeneratedExam> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    const questions = []
    const numQuestions = Math.min(options.numQuestions, 10)

    for (let i = 0; i < numQuestions; i++) {
      const correctIndex = Math.floor(Math.random() * 4)
      const labels: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D']
      
      questions.push({
        content: `Câu hỏi ${i + 1}: Dựa trên nội dung "${content.slice(0, 50)}...", hãy chọn đáp án đúng nhất?`,
        options: labels.map((label, idx) => ({
          label,
          content: `Đáp án ${label} - ${idx === correctIndex ? 'Đây là đáp án đúng' : 'Đây là đáp án nhiễu'}`,
          isCorrect: idx === correctIndex
        })),
        explanation: `Đáp án đúng là ${labels[correctIndex]} vì đây là lựa chọn phù hợp nhất với nội dung.`
      })
    }

    return {
      title: options.title || `Đề thi từ nội dung: ${content.slice(0, 30)}...`,
      description: `Đề thi được tạo tự động với ${numQuestions} câu hỏi, độ khó: ${options.difficulty}`,
      durationMinutes: options.duration || 30,
      difficulty: options.difficulty,
      questions
    }
  }
}
