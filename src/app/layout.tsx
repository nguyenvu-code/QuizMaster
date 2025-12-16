import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Navbar } from '@/components/navbar'
import { Chatbot } from '@/components/chatbot'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin', 'vietnamese'] })

export const metadata: Metadata = {
  title: 'QuizMaster - Tạo và làm bài thi trắc nghiệm',
  description: 'Nền tảng tạo và làm bài thi trắc nghiệm hiện đại với AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-indigo-50/30 dark:from-slate-950 dark:via-violet-950/20 dark:to-indigo-950/20">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
          </div>
          <Chatbot />
          <Toaster 
            position="top-right" 
            richColors 
            toastOptions={{
              className: 'rounded-2xl',
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
