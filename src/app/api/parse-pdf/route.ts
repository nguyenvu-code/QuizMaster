import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Dynamic import for pdf-parse (only works server-side)
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require('pdf-parse')
    const data = await pdfParse(buffer)
    
    return NextResponse.json({ text: data.text })
  } catch (error) {
    console.error('PDF parse error:', error)
    return NextResponse.json({ error: 'Failed to parse PDF' }, { status: 500 })
  }
}
