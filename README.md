# QuizMaster - Nền tảng thi trắc nghiệm với AI

Ứng dụng web tạo và làm bài thi trắc nghiệm hiện đại, hỗ trợ tạo đề tự động bằng AI.

## Tính năng

- 📝 **Tạo đề thi**: Upload file (TXT, PDF, DOCX) hoặc nhập văn bản → AI tự động tạo câu hỏi
- ✏️ **Chỉnh sửa đề**: Review, sửa câu hỏi, xáo trộn đáp án, xuất JSON
- 📊 **Làm bài thi**: Timer, điều hướng câu hỏi, đánh dấu xem lại, auto-save
- 📈 **Xem kết quả**: Điểm số, phân tích, xem lại đáp án với giải thích
- 🎛️ **Dashboard**: Quản lý đề thi, thống kê, câu hỏi sai nhiều nhất

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, TailwindCSS
- **UI**: Custom components với glassmorphism, Framer Motion animations
- **Backend**: Next.js Route Handlers
- **Database**: SQLite + Prisma ORM
- **AI**: Adapter pattern hỗ trợ OpenAI/Claude/Gemini (mock provider mặc định)

## Cài đặt

```bash
# Clone và cài dependencies
cd quiz-app
npm install

# Tạo database và seed data
npx prisma migrate dev
npm run db:seed

# Chạy development server
npm run dev
```

Mở http://localhost:3000

## Cấu hình AI (tùy chọn)

Tạo file `.env` và thêm API key:

```env
DATABASE_URL="file:./dev.db"
LLM_PROVIDER="openai"  # mock | openai | claude | gemini
OPENAI_API_KEY="sk-..."
```

## Cấu trúc dự án

```
quiz-app/
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Sample data
├── src/
│   ├── app/
│   │   ├── api/         # API routes
│   │   ├── create/      # Trang tạo đề
│   │   ├── dashboard/   # Trang quản lý
│   │   └── exam/[id]/   # Làm bài, sửa đề, kết quả
│   ├── components/
│   │   ├── ui/          # Base components
│   │   └── *.tsx        # Feature components
│   └── lib/
│       ├── llm/         # AI providers
│       ├── parsers/     # File parsers
│       └── *.ts         # Utils, store, validations
└── README.md
```

## API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/exams` | Danh sách đề thi |
| POST | `/api/exams` | Tạo đề mới |
| GET | `/api/exams/[id]` | Chi tiết đề |
| PUT | `/api/exams/[id]` | Cập nhật đề |
| DELETE | `/api/exams/[id]` | Xóa đề |
| POST | `/api/generate` | Tạo đề bằng AI |
| POST | `/api/attempts` | Nộp bài |
| GET | `/api/attempts/[id]` | Kết quả làm bài |
| GET | `/api/dashboard/stats` | Thống kê |

## Scripts

```bash
npm run dev        # Development server
npm run build      # Production build
npm run db:migrate # Chạy migrations
npm run db:seed    # Seed sample data
npm run db:reset   # Reset database
```
