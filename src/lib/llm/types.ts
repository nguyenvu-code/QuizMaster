export interface LLMProvider {
  name: string
  generateQuestions(content: string, options: GenerateOptions): Promise<GeneratedExam>
}

export interface GenerateOptions {
  numQuestions: number
  difficulty: 'easy' | 'medium' | 'hard'
  title?: string
  duration?: number
}

export interface GeneratedQuestion {
  content: string
  options: {
    label: 'A' | 'B' | 'C' | 'D'
    content: string
    isCorrect: boolean
  }[]
  explanation?: string
}

export interface GeneratedExam {
  title: string
  description?: string
  durationMinutes: number
  difficulty: 'easy' | 'medium' | 'hard'
  questions: GeneratedQuestion[]
}

export const SYSTEM_PROMPT = `Bạn là một chuyên gia tạo đề thi trắc nghiệm. Nhiệm vụ của bạn là tạo các câu hỏi trắc nghiệm chất lượng cao từ nội dung được cung cấp.

Quy tắc:
1. Mỗi câu hỏi phải có đúng 4 lựa chọn (A, B, C, D)
2. Chỉ có 1 đáp án đúng cho mỗi câu
3. Các lựa chọn sai phải hợp lý, không quá dễ loại trừ
4. Câu hỏi phải rõ ràng, không mơ hồ
5. Giải thích ngắn gọn tại sao đáp án đúng

Trả về JSON theo đúng format sau (KHÔNG thêm markdown code block):
{
  "title": "Tiêu đề đề thi",
  "description": "Mô tả ngắn",
  "durationMinutes": 30,
  "difficulty": "easy|medium|hard",
  "questions": [
    {
      "content": "Nội dung câu hỏi?",
      "options": [
        {"label": "A", "content": "Lựa chọn A", "isCorrect": false},
        {"label": "B", "content": "Lựa chọn B", "isCorrect": true},
        {"label": "C", "content": "Lựa chọn C", "isCorrect": false},
        {"label": "D", "content": "Lựa chọn D", "isCorrect": false}
      ],
      "explanation": "Giải thích tại sao B đúng"
    }
  ]
}`
