// Parser đọc file DOCX và phát hiện text màu đỏ (đáp án đúng)
import JSZip from 'jszip'

interface TextRun {
  text: string
  isRed: boolean
}

export interface DocxParseResult {
  text: string
  redTexts: string[] // Các đoạn text màu đỏ
}

export async function parseDocxWithColors(arrayBuffer: ArrayBuffer): Promise<DocxParseResult> {
  const zip = await JSZip.loadAsync(arrayBuffer)
  
  // Đọc document.xml (nội dung chính)
  const documentXml = await zip.file('word/document.xml')?.async('string')
  if (!documentXml) {
    throw new Error('Invalid DOCX file: missing document.xml')
  }
  
  // Đọc styles.xml để lấy thông tin style (nếu có)
  const stylesXml = await zip.file('word/styles.xml')?.async('string')
  
  // Parse XML
  const runs = parseDocumentXml(documentXml, stylesXml)
  
  // Gộp text và tìm các đoạn màu đỏ
  let fullText = ''
  const redTexts: string[] = []
  
  for (const run of runs) {
    fullText += run.text
    if (run.isRed && run.text.trim()) {
      redTexts.push(run.text.trim())
    }
  }
  
  return { text: fullText, redTexts }
}

function parseDocumentXml(xml: string, stylesXml?: string): TextRun[] {
  const runs: TextRun[] = []
  
  // Tìm tất cả các <w:r> (run) elements
  // Mỗi run có thể chứa <w:rPr> (run properties) và <w:t> (text)
  const runRegex = /<w:r[^>]*>([\s\S]*?)<\/w:r>/g
  let match
  
  while ((match = runRegex.exec(xml)) !== null) {
    const runContent = match[1]
    
    // Lấy text từ <w:t>
    const textMatch = runContent.match(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g)
    if (!textMatch) continue
    
    let text = ''
    for (const t of textMatch) {
      const innerText = t.replace(/<w:t[^>]*>/, '').replace(/<\/w:t>/, '')
      text += innerText
    }
    
    if (!text) continue
    
    // Kiểm tra màu đỏ trong <w:rPr>
    const isRed = checkIfRed(runContent, stylesXml)
    
    runs.push({ text, isRed })
  }
  
  return runs
}

function checkIfRed(runContent: string, stylesXml?: string): boolean {
  // Tìm <w:rPr> (run properties)
  const rPrMatch = runContent.match(/<w:rPr>([\s\S]*?)<\/w:rPr>/)
  if (!rPrMatch) return false
  
  const rPr = rPrMatch[1]
  
  // Kiểm tra <w:color w:val="..."/>
  const colorMatch = rPr.match(/<w:color[^>]*w:val="([^"]+)"/)
  if (colorMatch) {
    const color = colorMatch[1].toUpperCase()
    // Các màu đỏ phổ biến
    if (isRedColor(color)) return true
  }
  
  // Kiểm tra highlight màu đỏ
  const highlightMatch = rPr.match(/<w:highlight[^>]*w:val="([^"]+)"/)
  if (highlightMatch) {
    const highlight = highlightMatch[1].toLowerCase()
    if (highlight === 'red' || highlight === 'darkred') return true
  }
  
  // Kiểm tra style reference
  const styleMatch = rPr.match(/<w:rStyle[^>]*w:val="([^"]+)"/)
  if (styleMatch && stylesXml) {
    const styleName = styleMatch[1]
    // Tìm style trong styles.xml và kiểm tra màu
    const styleRegex = new RegExp(`<w:style[^>]*w:styleId="${styleName}"[^>]*>([\\s\\S]*?)</w:style>`)
    const styleContent = stylesXml.match(styleRegex)
    if (styleContent) {
      const styleColorMatch = styleContent[1].match(/<w:color[^>]*w:val="([^"]+)"/)
      if (styleColorMatch && isRedColor(styleColorMatch[1].toUpperCase())) {
        return true
      }
    }
  }
  
  return false
}

function isRedColor(hex: string): boolean {
  // Các mã màu đỏ phổ biến trong Word
  const redColors = [
    'FF0000', // Pure red
    'FF0000', 
    'C00000', // Dark red
    'FF3333',
    'CC0000',
    'E60000',
    'FF6666',
    'DC143C', // Crimson
    'B22222', // Firebrick
    'CD5C5C', // Indian red
    '8B0000', // Dark red
    'FF4500', // Orange red
    'FF6347', // Tomato
    'ED1C24', // Word default red
  ]
  
  // Kiểm tra exact match
  if (redColors.includes(hex)) return true
  
  // Kiểm tra nếu là màu đỏ (R cao, G và B thấp)
  if (hex.length === 6) {
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    
    // Màu đỏ: R > 180, G < 100, B < 100
    if (r > 180 && g < 100 && b < 100) return true
    // Hoặc R chiếm ưu thế lớn
    if (r > 200 && r > g * 2 && r > b * 2) return true
  }
  
  return false
}
