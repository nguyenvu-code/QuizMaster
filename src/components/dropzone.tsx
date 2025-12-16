'use client'

import { useCallback, useState } from 'react'
import { cn } from '@/lib/utils'
import { Upload, File, X, CheckCircle } from 'lucide-react'
import { Button } from './ui/button'

interface DropzoneProps {
  onFileSelect: (file: File) => void
  accept?: string
  maxSize?: number // in MB
  className?: string
}

export function Dropzone({ onFileSelect, accept = '.txt,.pdf,.docx', maxSize = 10, className }: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const validateFile = useCallback((file: File): boolean => {
    setError(null)
    const extension = '.' + file.name.split('.').pop()?.toLowerCase()
    const acceptedTypes = accept.split(',').map(t => t.trim().toLowerCase())
    
    if (!acceptedTypes.includes(extension)) {
      setError(`Định dạng không hỗ trợ. Chấp nhận: ${accept}`)
      return false
    }
    
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File quá lớn. Tối đa ${maxSize}MB`)
      return false
    }
    
    return true
  }, [accept, maxSize])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file && validateFile(file)) {
      setSelectedFile(file)
      onFileSelect(file)
    }
  }, [onFileSelect, validateFile])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && validateFile(file)) {
      setSelectedFile(file)
      onFileSelect(file)
    }
  }, [onFileSelect, validateFile])

  const clearFile = () => {
    setSelectedFile(null)
    setError(null)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div
      className={cn(
        'relative rounded-3xl border-2 border-dashed transition-all duration-300',
        isDragging
          ? 'border-violet-500 bg-violet-50/50 dark:bg-violet-900/20'
          : 'border-slate-300 dark:border-slate-600 hover:border-violet-400 dark:hover:border-violet-500',
        selectedFile && 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20',
        error && 'border-red-500 bg-red-50/50 dark:bg-red-900/20',
        className
      )}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      
      <div className="flex flex-col items-center justify-center p-8 text-center">
        {selectedFile ? (
          <>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30">
                <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-left">
                <p className="font-medium text-slate-900 dark:text-slate-100">{selectedFile.name}</p>
                <p className="text-sm text-slate-500">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={clearFile} className="gap-1">
              <X className="w-4 h-4" /> Xóa file
            </Button>
          </>
        ) : (
          <>
            <div className={cn(
              'p-4 rounded-2xl mb-4 transition-colors duration-200',
              isDragging ? 'bg-violet-100 dark:bg-violet-900/30' : 'bg-slate-100 dark:bg-slate-800'
            )}>
              {isDragging ? (
                <File className="w-8 h-8 text-violet-600 dark:text-violet-400" />
              ) : (
                <Upload className="w-8 h-8 text-slate-400" />
              )}
            </div>
            <p className="text-slate-700 dark:text-slate-300 font-medium mb-1">
              {isDragging ? 'Thả file vào đây' : 'Kéo thả file hoặc click để chọn'}
            </p>
            <p className="text-sm text-slate-500">
              Hỗ trợ: TXT, PDF, DOCX (tối đa {maxSize}MB)
            </p>
          </>
        )}
        
        {error && (
          <p className="mt-3 text-sm text-red-500 font-medium">{error}</p>
        )}
      </div>
    </div>
  )
}
