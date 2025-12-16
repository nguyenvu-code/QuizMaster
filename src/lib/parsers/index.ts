import mammoth from 'mammoth'
import { parseDocxWithColors } from './docx-parser'
export { parseQuizFromText, hasExistingQuestions } from './quiz-parser'
export type { ParsedQuestion, ParsedExam } from './quiz-parser'

export interface FileParseResult {
  text: string
  redTexts?: string[] // Các đoạn text màu đỏ (đáp án đúng)
}

export async function parseFile(file: File): Promise<string> {
  const result = await parseFileWithColors(file)
  return result.text
}

export async function parseFileWithColors(file: File): Promise<FileParseResult> {
  const extension = file.name.split('.').pop()?.toLowerCase()

  switch (extension) {
    case 'txt':
      return { text: await parseTxt(file) }
    case 'docx':
      return parseDocxAdvanced(file)
    case 'pdf':
      return { text: await parsePdf(file) }
    default:
      throw new Error(`Unsupported file type: ${extension}`)
  }
}

async function parseTxt(file: File): Promise<string> {
  return await file.text()
}

async function parseDocxAdvanced(file: File): Promise<FileParseResult> {
  const arrayBuffer = await file.arrayBuffer()
  
  try {
    // Thử parse với màu sắc trước
    const result = await parseDocxWithColors(arrayBuffer)
    console.log('DOCX parsed with colors')
    console.log('Red texts found:', result.redTexts.length)
    if (result.redTexts.length > 0) {
      console.log('Red texts:', result.redTexts.slice(0, 5))
    }
    return {
      text: cleanText(result.text),
      redTexts: result.redTexts
    }
  } catch (error) {
    console.warn('Failed to parse DOCX with colors, falling back to mammoth:', error)
    // Fallback to mammoth
    const result = await mammoth.extractRawText({ arrayBuffer })
    return { text: cleanText(result.value) }
  }
}

async function parsePdf(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await fetch('/api/parse-pdf', {
    method: 'POST',
    body: formData
  })
  
  if (!response.ok) {
    throw new Error('Failed to parse PDF')
  }
  
  const data = await response.json()
  return data.text
}

export function cleanText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^\s+|\s+$/gm, '')
    .trim()
}

export function chunkText(text: string, maxChunkSize = 4000): string[] {
  const paragraphs = text.split(/\n\n+/)
  const chunks: string[] = []
  let currentChunk = ''

  for (const paragraph of paragraphs) {
    if ((currentChunk + paragraph).length > maxChunkSize) {
      if (currentChunk) chunks.push(currentChunk.trim())
      currentChunk = paragraph
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + paragraph
    }
  }

  if (currentChunk) chunks.push(currentChunk.trim())
  return chunks
}
