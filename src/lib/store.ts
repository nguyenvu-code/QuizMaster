import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ExamAttemptState {
  currentExamId: string | null
  answers: Record<string, string | null> // questionId -> optionId
  markedForReview: Set<string>
  startTime: number | null
  setCurrentExam: (examId: string) => void
  setAnswer: (questionId: string, optionId: string | null) => void
  toggleMarkedForReview: (questionId: string) => void
  clearAttempt: () => void
  startExam: () => void
}

export const useExamAttemptStore = create<ExamAttemptState>()(
  persist(
    (set) => ({
      currentExamId: null,
      answers: {},
      markedForReview: new Set(),
      startTime: null,

      setCurrentExam: (examId) => set({ 
        currentExamId: examId, 
        answers: {}, 
        markedForReview: new Set(),
        startTime: null 
      }),

      setAnswer: (questionId, optionId) => set((state) => ({
        answers: { ...state.answers, [questionId]: optionId }
      })),

      toggleMarkedForReview: (questionId) => set((state) => {
        const newSet = new Set(state.markedForReview)
        if (newSet.has(questionId)) {
          newSet.delete(questionId)
        } else {
          newSet.add(questionId)
        }
        return { markedForReview: newSet }
      }),

      clearAttempt: () => set({ 
        currentExamId: null, 
        answers: {}, 
        markedForReview: new Set(),
        startTime: null 
      }),

      startExam: () => set({ startTime: Date.now() })
    }),
    {
      name: 'exam-attempt-storage',
      partialize: (state) => ({
        currentExamId: state.currentExamId,
        answers: state.answers,
        markedForReview: Array.from(state.markedForReview),
        startTime: state.startTime
      }),
      merge: (persisted, current) => ({
        ...current,
        ...(persisted as object),
        markedForReview: new Set((persisted as { markedForReview?: string[] })?.markedForReview || [])
      })
    }
  )
)

interface ThemeState {
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme })
    }),
    { name: 'theme-storage' }
  )
)
