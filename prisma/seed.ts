import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create sample exam
  const exam = await prisma.exam.create({
    data: {
      title: 'Kiến thức cơ bản về JavaScript',
      description: 'Đề thi trắc nghiệm kiểm tra kiến thức JavaScript cơ bản',
      duration: 15,
      difficulty: 'easy',
      isPublished: true,
      questions: {
        create: [
          {
            content: 'JavaScript là ngôn ngữ lập trình thuộc loại nào?',
            explanation: 'JavaScript là ngôn ngữ thông dịch (interpreted), được thực thi trực tiếp bởi trình duyệt hoặc runtime như Node.js.',
            order: 0,
            options: {
              create: [
                { label: 'A', content: 'Ngôn ngữ biên dịch (Compiled)', isCorrect: false },
                { label: 'B', content: 'Ngôn ngữ thông dịch (Interpreted)', isCorrect: true },
                { label: 'C', content: 'Ngôn ngữ máy (Machine language)', isCorrect: false },
                { label: 'D', content: 'Ngôn ngữ assembly', isCorrect: false },
              ]
            }
          },
          {
            content: 'Cách khai báo biến nào sau đây cho phép thay đổi giá trị?',
            explanation: 'let và var cho phép thay đổi giá trị, nhưng let được khuyến khích sử dụng hơn vì có block scope.',
            order: 1,
            options: {
              create: [
                { label: 'A', content: 'const', isCorrect: false },
                { label: 'B', content: 'let', isCorrect: true },
                { label: 'C', content: 'final', isCorrect: false },
                { label: 'D', content: 'static', isCorrect: false },
              ]
            }
          },
          {
            content: 'Kết quả của typeof null trong JavaScript là gì?',
            explanation: 'Đây là một bug lịch sử của JavaScript. typeof null trả về "object" thay vì "null".',
            order: 2,
            options: {
              create: [
                { label: 'A', content: '"null"', isCorrect: false },
                { label: 'B', content: '"undefined"', isCorrect: false },
                { label: 'C', content: '"object"', isCorrect: true },
                { label: 'D', content: '"number"', isCorrect: false },
              ]
            }
          },
          {
            content: 'Phương thức nào dùng để thêm phần tử vào cuối mảng?',
            explanation: 'push() thêm phần tử vào cuối mảng và trả về độ dài mới của mảng.',
            order: 3,
            options: {
              create: [
                { label: 'A', content: 'unshift()', isCorrect: false },
                { label: 'B', content: 'push()', isCorrect: true },
                { label: 'C', content: 'pop()', isCorrect: false },
                { label: 'D', content: 'shift()', isCorrect: false },
              ]
            }
          },
          {
            content: 'Arrow function trong ES6 được viết như thế nào?',
            explanation: 'Arrow function sử dụng cú pháp => và không có this binding riêng.',
            order: 4,
            options: {
              create: [
                { label: 'A', content: 'function => {}', isCorrect: false },
                { label: 'B', content: '() -> {}', isCorrect: false },
                { label: 'C', content: '() => {}', isCorrect: true },
                { label: 'D', content: 'func() {}', isCorrect: false },
              ]
            }
          }
        ]
      }
    }
  })

  console.log('Created sample exam:', exam.title)

  // Create another exam
  const exam2 = await prisma.exam.create({
    data: {
      title: 'Lịch sử Việt Nam',
      description: 'Kiểm tra kiến thức về lịch sử Việt Nam',
      duration: 20,
      difficulty: 'medium',
      isPublished: true,
      questions: {
        create: [
          {
            content: 'Chiến thắng Điện Biên Phủ diễn ra vào năm nào?',
            explanation: 'Chiến thắng Điện Biên Phủ ngày 7/5/1954 đánh dấu sự kết thúc của cuộc kháng chiến chống Pháp.',
            order: 0,
            options: {
              create: [
                { label: 'A', content: '1953', isCorrect: false },
                { label: 'B', content: '1954', isCorrect: true },
                { label: 'C', content: '1955', isCorrect: false },
                { label: 'D', content: '1956', isCorrect: false },
              ]
            }
          },
          {
            content: 'Ai là người đọc Tuyên ngôn Độc lập ngày 2/9/1945?',
            explanation: 'Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình, khai sinh nước Việt Nam Dân chủ Cộng hòa.',
            order: 1,
            options: {
              create: [
                { label: 'A', content: 'Võ Nguyên Giáp', isCorrect: false },
                { label: 'B', content: 'Phạm Văn Đồng', isCorrect: false },
                { label: 'C', content: 'Hồ Chí Minh', isCorrect: true },
                { label: 'D', content: 'Trường Chinh', isCorrect: false },
              ]
            }
          },
          {
            content: 'Triều đại phong kiến cuối cùng của Việt Nam là triều đại nào?',
            explanation: 'Nhà Nguyễn (1802-1945) là triều đại phong kiến cuối cùng của Việt Nam.',
            order: 2,
            options: {
              create: [
                { label: 'A', content: 'Nhà Lê', isCorrect: false },
                { label: 'B', content: 'Nhà Trần', isCorrect: false },
                { label: 'C', content: 'Nhà Nguyễn', isCorrect: true },
                { label: 'D', content: 'Nhà Lý', isCorrect: false },
              ]
            }
          }
        ]
      }
    }
  })

  console.log('Created sample exam:', exam2.title)
  console.log('Seed completed!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
