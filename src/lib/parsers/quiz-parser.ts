// Parser để nhận diện câu hỏi trắc nghiệm có sẵn trong văn bản

export interface ParsedQuestion {
  content: string
  options: {
    label: 'A' | 'B' | 'C' | 'D'
    content: string
    isCorrect: boolean
  }[]
  explanation?: string
}

export interface ParsedExam {
  questions: ParsedQuestion[]
  rawText: string
}

export function parseQuizFromText(text: string, redTexts?: string[]): ParsedExam {
  const questions: ParsedQuestion[] = []

  // Chuẩn hóa text - gộp tất cả thành 1 dòng
  const normalizedText = text
    .replace(/\r\n/g, ' ')
    .replace(/\r/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\t/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  // Tách câu hỏi theo pattern "Câu X." hoặc "Câu X:"
  const questionPattern = /Câu\s*(\d+)\s*[.:]/gi
  const matches: { index: number; num: number }[] = []

  let match
  while ((match = questionPattern.exec(normalizedText)) !== null) {
    matches.push({ index: match.index, num: parseInt(match[1]) })
  }

  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index
    const end = matches[i + 1]?.index || normalizedText.length
    const questionBlock = normalizedText.substring(start, end).trim()

    const parsed = parseOneQuestion(questionBlock, redTexts)
    if (parsed) {
      questions.push(parsed)
    }
  }

  return { questions, rawText: normalizedText }
}

function parseOneQuestion(block: string, redTexts?: string[]): ParsedQuestion | null {
  let content = block.replace(/^Câu\s*\d+\s*[.:]\s*/i, '').trim()
  if (!content || content.length < 10) return null

  // Tìm vị trí A. hoặc A (đứng sau ký tự không phải chữ cái)
  const aIndex = findOptionA(content)
  if (aIndex < 5) return null

  const questionContent = content.substring(0, aIndex).trim()
  const optionsPart = content.substring(aIndex)

  const options = parseOptions(optionsPart)
  if (!questionContent || options.length < 2) return null

  const labels: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D']
  const finalOptions: ParsedQuestion['options'] = labels.map((label) => {
    const opt = options.find((o) => o.label === label)
    const optContent = opt?.content || ''
    
    // Kiểm tra xem đáp án này có trong danh sách text màu đỏ không
    let isCorrect = false
    if (redTexts && redTexts.length > 0 && optContent) {
      isCorrect = isOptionInRedTexts(optContent, redTexts, label)
    }
    
    return { label, content: optContent, isCorrect }
  })

  return { content: questionContent, options: finalOptions }
}

// Kiểm tra xem đáp án có trong danh sách text màu đỏ không
function isOptionInRedTexts(optContent: string, redTexts: string[], label: string): boolean {
  const normalizedOpt = optContent.toLowerCase().trim()
  
  for (const redText of redTexts) {
    const normalizedRed = redText.toLowerCase().trim()
    
    // Kiểm tra exact match hoặc contains
    if (normalizedRed === normalizedOpt) return true
    if (normalizedOpt.includes(normalizedRed) && normalizedRed.length > 3) return true
    if (normalizedRed.includes(normalizedOpt) && normalizedOpt.length > 3) return true
    
    // Kiểm tra nếu red text bắt đầu bằng label (A., B., C., D.)
    const labelPattern = new RegExp(`^${label}\\.?\\s*`, 'i')
    const redWithoutLabel = normalizedRed.replace(labelPattern, '')
    if (redWithoutLabel === normalizedOpt) return true
    if (normalizedOpt.includes(redWithoutLabel) && redWithoutLabel.length > 3) return true
  }
  
  return false
}

function findOptionA(text: string): number {
  for (let i = 0; i < text.length - 1; i++) {
    if (text[i] === 'A' && (text[i + 1] === '.' || text[i + 1] === ' ')) {
      if (i === 0) return 0
      const prevChar = text[i - 1]
      if (!/[A-Za-zÀ-ỹ]/.test(prevChar)) return i
    }
  }
  return -1
}

function parseOptions(text: string): { label: string; content: string }[] {
  const options: { label: string; content: string }[] = []
  
  // Tìm tất cả vị trí có thể là đáp án
  // Pattern 1: X. (có dấu chấm) - ưu tiên cao
  // Pattern 2: X đứng sau chữ thường và trước chữ hoa/ký tự đặc biệt (như AlgorithmB. -> B là đáp án)
  
  const positions: { label: string; index: number; priority: number }[] = []
  
  for (let i = 0; i < text.length; i++) {
    const curr = text[i]
    
    if (!['A', 'B', 'C', 'D'].includes(curr)) continue
    
    const prev = i > 0 ? text[i - 1] : ''
    const next = i < text.length - 1 ? text[i + 1] : ''
    
    // Pattern 1: X. (có dấu chấm sau) - ưu tiên cao nhất
    if (next === '.') {
      // Ký tự trước không phải chữ cái HOẶC là chữ thường (như "mB." trong "AlgorithmB.")
      if (!prev || !/[A-Za-zÀ-ỹ]/.test(prev) || /[a-zà-ỹ]/.test(prev)) {
        positions.push({ label: curr, index: i, priority: 1 })
      }
    }
    // Pattern 2: X không có dấu chấm nhưng đứng sau chữ thường
    else if (/[a-zà-ỹ]/.test(prev)) {
      // Và ký tự sau là chữ hoa hoặc ký tự đặc biệt (bắt đầu đáp án mới)
      if (/[A-ZÀ-Ỹ]/.test(next) || /[^A-Za-zÀ-ỹ0-9]/.test(next)) {
        positions.push({ label: curr, index: i, priority: 2 })
      }
    }
  }
  
  // Sắp xếp theo vị trí
  positions.sort((a, b) => a.index - b.index)
  
  // Tìm chuỗi A -> B -> C -> D
  const sequence: typeof positions = []
  let expected = 'A'
  
  for (const pos of positions) {
    if (pos.label === expected) {
      sequence.push(pos)
      if (expected === 'A') expected = 'B'
      else if (expected === 'B') expected = 'C'
      else if (expected === 'C') expected = 'D'
      else break
    }
  }
  
  // Extract nội dung
  for (let i = 0; i < sequence.length; i++) {
    const current = sequence[i]
    const next = sequence[i + 1]
    
    // Bỏ "X." hoặc "X"
    const hasNextDot = text[current.index + 1] === '.'
    let startIdx = current.index + (hasNextDot ? 2 : 1)
    while (startIdx < text.length && text[startIdx] === ' ') startIdx++
    
    const endIdx = next ? next.index : text.length
    let optContent = text.substring(startIdx, endIdx).trim()
    
    // Loại bỏ "Câu X." ở cuối
    optContent = optContent.replace(/Câu\s*\d+\s*[.:].*$/i, '').trim()
    
    options.push({ label: current.label, content: optContent })
  }
  
  return options
}

export function hasExistingQuestions(text: string): boolean {
  return parseQuizFromText(text).questions.length >= 1
}
