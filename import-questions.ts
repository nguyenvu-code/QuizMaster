import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const rawText = `Câu 1. Phát biểu nào sau đây không phải là ứng dụng của giải thuật tìm kiếm theo chiều rộng (BFS) trong lý thuyết đồ thị?A. Tìm đường đi ngắn nhất giữa 2 đỉnh u và v.B. Tìm các thành phần liên thông.C. Tìm tất cả các đỉnh trong một thành phần liên thông.D. Tìm kiếm có giới hạn.Câu 2. Đáp án nào đúng với giải thuật tìm kiếm theo chiều rộng (BFS)?A. Duyệt tất cả các đỉnh.B. Duyệt một nửa số đỉnh.C. Chỉ duyệt đỉnh đầu của đồ thị.D. Chỉ duyệt đỉnh cuối của đồ thị.Câu 3. Đáp án nào đúng với giải thuật tìm kiếm theo chiều rộng (BFS)?A. Sử dụng hàng đợi.B. Sử dụng ngăn xếp.C. Sử dụng mảng nhiều chiều.D. Sử dụng ma trận.Câu 4. Đâu là đáp án đúng của giải thuật tìm kiếm theo chiều sâu (DFS)?A. Sử dụng hàng đợi.B. Sử dụng ngăn xếp.C. Sử dụng mảng nhiều chiều.D. Sử dụng ma trận.Câu 5. Giải thuật tìm kiếm sâu dần (Iterative Deepening / IDDFS) thường áp dụng cho bài toán nào?A. Bài toán có không gian trạng thái lớn và độ sâu của nghiệm không biết trước.B. Bài toán có không gian trạng thái lớn và độ sâu của nghiệm biết trước.C. Bài toán có không gian trạng thái nhỏ và độ sâu của nghiệm không biết trước.D. Bài toán có không gian trạng thái nhỏ và độ sâu của nghiệm biết trước.Câu 6. Hạn chế chính của giải thuật tìm kiếm sâu dần là gì?A. Không lặp lại tất cả các công việc của giai đoạn trước.B. Lặp lại một nửa công việc của giai đoạn trước.C. Lặp lại tất cả các công việc của giai đoạn trước.D. Lặp lại tất cả các công việc của giai đoạn sau.Câu 7. Điều khiển học là gì?A. Nghiên cứu giao tiếp giữa hai máy.B. Nghiên cứu giao tiếp giữa người và máy.C. Nghiên cứu về giao tiếp giữa hai người.D. Nghiên cứu các giá trị Boolean.Câu 8. Mục tiêu của trí tuệ nhân tạo là gì?A. Để giải quyết các vấn đề trong thế giới thực.B. Để giải quyết vấn đề nhân tạo.C. Để giải thích các loại trí thông minh.D. Trích xuất nguyên nhân khoa học.Câu 9. Trong giải thuật tìm kiếm leo dốc:A. Khi phát triển một đỉnh u thì bước tiếp theo ta không chọn trong số các đỉnh con của u, đỉnh có hứa hẹn nhiều nhất để phát triển, đỉnh này được xác định bởi hàm đánh giá.B. Khi phát triển một đỉnh u thì bước tiếp theo ta chọn trong số các đỉnh con của u, đỉnh có hứa hẹn nhiều nhất để phát triển, đỉnh này được xác định bởi hàm đánh giá.C. Khi phát triển một đỉnh u thì bước tiếp theo ta chọn trong số các đỉnh con của u, đỉnh có hứa hẹn nhiều nhất để phát triển, đỉnh này không được xác định bởi hàm đánh giá.D. Khi phát triển một đỉnh u thì bước tiếp theo ta không chọn trong số các đỉnh con của u, đỉnh có hứa hẹn nhiều nhất để phát triển, đỉnh này không được xác định bởi hàm đánh giá.Câu 10. Đâu là ưu điểm của giải thuật tìm kiếm nhánh cận (Branch and Bound)?A. Quét qua toàn bộ nghiệm có thể có của bài toán.B. Chỉ quét qua một nửa nghiệm có thể có của bài toán.C. Không quét qua toàn bộ nghiệm có thể có của bài toán.D. Quét qua toàn bộ nghiệm có thể không có của bài toán.Câu 11. Trong giải thuật tìm kiếm Beam:A. Không phát triển một đỉnh K tốt nhất.B. Phát triển nhiều đỉnh K tốt nhất.C. Chỉ phát triển một đỉnh K tốt nhất.D. Phát triển nhiều đỉnh K nhưng không tốt nhất.Câu 12. Đáp án nào đúng với giải thuật tìm kiếm theo chiều rộng (BFS)?A. Duyệt tất cả các đỉnh.B. Duyệt một nửa số đỉnh.C. Chỉ duyệt đỉnh đầu của đồ thị.D. Chỉ duyệt đỉnh cuối của đồ thị.Câu 13. Đâu là ưu điểm của giải thuật tìm kiếm beam?A. Khả năng làm tăng tính toán.B. Khả năng làm giảm tính toán.C. Khả năng tiêu thụ nhiều bộ nhớ.D. Khả năng làm tăng tính toán và tiêu thụ nhiều bộ nhớ.Câu 14. Giải thuật tìm kiếm theo chiều rộng (BFS) bắt đầu duyệt từ?A. Nút kề.B. Nút gốc.C. Nút con.D. Nút cha.Câu 15. Giải thuật Minimax có tính chất gì?A. Vét cạn.B. Rà soát.C. Cả A và B đều đúng.D. Cả A và B đều sai.Câu 16. Mục tiêu của trí tuệ nhân tạo là gì?A. Để giải quyết các vấn đề trong thế giới thực.B. Để giải quyết vấn đề nhân tạo.C. Để giải thích các loại trí thông minh.D. Trích xuất nguyên nhân khoa học.Câu 17. Chức năng heuristic là gì?A. Một hàm để giải các bài toán.B. Hàm lấy tham số của chuỗi kiểu và trả về giá trị nguyên.C. Một hàm có kiểu trả về là không có gì.D. Một chức năng ánh xạ từ không gian trạng thái bài toán đến các giải thuật xử lý như mong muốn.Câu 18. Nhận định nào sau đây đúng với thuật giải BFS (Breadth First Search)?A. BFS sẽ bị mắc kẹt trong khi tìm đường đi.B. Toàn bộ cây được tạo ra trong quá trình đã duyệt phải được lưu trữ trong BFS.C. BFS không được bảo đảm tìm lời giải nếu tồn tại lời giải.D. BFS không khác gì thuật toán Tìm kiếm nhị phân.Câu 19. Giải thuật tìm kiếm nhánh cận là một dạng cải tiến của giải thuật nào?A. Giải thuật quay lui.B. Giải thuật leo dốc.C. Giải thuật tham lam.D. Tất cả các ý trên.Câu 20. Giải thuật Minimax là gì?A. Là một giải thuật đệ quy.B. Là một giải thuật không đệ quy.C. Là một giải thuật đệ quy và không đệ quy.D. Tất cả các đáp án đều sai.Câu 21. K-NN có thể được sử dụng cho loại bài toán nào?A. Chỉ hồi quy.B. Phân cụm.C. Phân loại và hồi quy.D. Chỉ phân loại.Câu 22. Thuật toán AKT có thể áp dụng trong những lĩnh vực nào?A. Giáo dục, đào tạo nhân lực, phát triển kỹ năng mềm.B. Quản lý dự án, phát triển phần mềm, thiết kế đồ họa.C. Nghiên cứu thị trường, phân tích dữ liệu, quảng cáo trực tuyến.D. Bảo mật thông tin, truyền thông an toàn, xác thực danh tính, blockchain, tiền điện tử.Câu 23. Học máy giám sát là gì?A. Học máy giám sát là phương pháp học máy sử dụng dữ liệu có nhãn để huấn luyện mô hình.B. Học máy giám sát là một loại học máy không cần huấn luyện.C. Học máy giám sát chỉ áp dụng cho dữ liệu không có cấu trúc.D. Học máy giám sát là phương pháp học không sử dụng dữ liệu có nhãn.Câu 24. Làm thế nào để đánh giá hiệu suất của mô hình học máy giám sát?A. Sử dụng số lượng mẫu huấn luyện để đánh giá.B. So sánh với các mô hình không giám sát.C. Chỉ dựa vào thời gian huấn luyện của mô hình.D. Sử dụng các chỉ số như độ chính xác, độ nhạy, độ đặc hiệu, F1-score và ma trận nhầm lẫn.Câu 25. Giải thuật A* được sử dụng chủ yếu trong lĩnh vực nào?A. Tính toán số nguyên tố.B. Phân tích cú pháp ngữ nghĩa.C. Tìm kiếm đường đi tối ưu trong đồ thị.D. Lập trình hướng đối tượng.Câu 26. K-NN là viết tắt của thuật ngữ nào?A. K-Nearest Neighbors AlgorithmB. K-Node NeighborsC. K-Nearest NeighborsD. K-Nearest NetworkCâu 27. Nguyên lý chính của thuật toán K-NN là gì?A. Sử dụng hồi quy tuyến tính.B. Tìm kiếm dữ liệu theo thứ tự thời gian.C. Phân tích hồi quy đa biến.D. Tìm k điểm gần nhất để phân loại hoặc hồi quy.Câu 28. Các kỹ thuật nào được sử dụng để giảm thiểu overfitting trong học máy giám sát?A. Tăng số lượng tham số.B. Giảm kích thước tập dữ liệu.C. Sử dụng hàm kích hoạt phức tạp.D. Regularization, Dropout, tăng kích thước tập dữ liệu, Cross-validation, Pruning, Early stopping.Câu 29. Điểm mạnh lớn nhất của giải thuật A* so với các giải thuật tìm kiếm khác là gì?A. A* chỉ tìm kiếm theo chiều rộng.B. A* luôn tìm kiếm đường đi dài nhất.C. A* không sử dụng ước lượng trong quá trình tìm kiếm.D. A* tìm kiếm đường đi ngắn nhất hiệu quả hơn nhờ kết hợp chi phí thực tế và ước lượng.Câu 30. Luật DeMorgan đúng?A. ¬(p ∨ q) ≡ ¬p ∨ ¬qB. ¬(p ∧ q) ≡ ¬p ∨ ¬qC. ¬(p ∧ q) ≡ p ∨ qD. ¬(p ∨ q) ≡ p ∧ qCâu 31. Một trong các mục tiêu nghiên cứu của AI theo góc độ kỹ thuật là gì?A. Nghiên cứu cảm xúc con người.B. Xây dựng hệ thống thông minh giải quyết vấn đề thực tế.C. Chỉ tạo ra mô hình lý thuyết.D. Thay thế sự sáng tạo của con người.Câu 32. Giải thuật học lan truyền ngược (Back-propagation) được dùng cho loại mô hình nào?A. Cây quyết định.B. Thuật toán K-means.C. Mạng nơ-ron nhân tạo.D. SVM.Câu 34. Trong DFS, cấu trúc dữ liệu được dùng cho MO là gì?A. QueueB. StackC. HeapD. Danh sách kềCâu 35. Trong logic mệnh đề, biểu thức nào dưới đây là đồng nhất đúng?A. p ∧ q → p ∨ qB. p → qC. p ∧ ¬pD. p ∨ q → pCâu 36. Trong quá trình học máy, tập validation dùng để làm gì?A. Kiểm tra mô hình sau khi huấn luyện xong.B. Tối ưu hoá các tham số mô hình.C. Đo hiệu suất cuối cùng.D. Tăng kích thước tập huấn luyện.Câu 37. Trong không gian trạng thái, ký hiệu K = (T, S, G, F). Trong đó T là gì?A. Tập tất cả các trạng thái.B. Tập tất cả các thông tin liên quan đến bài toán.C. Tập các trạng thái đích.D. Tập toán tử.Câu 38. Ngành nào có liên quan chặt chẽ đến AI?A. Chiêm tinh học.B. Lịch sử.C. Khoa học nhận thức.D. Thần thoại.Câu 39. Bước nào KHÔNG thuộc Vương Hạo?A. Đưa về dạng chuẩn.B. Tách ∨ ở GT.C. Tách ∧ ở KL.D. Giả sử KL sai → mâu thuẫn.Câu 40. Thuật toán k-Láng giềng gần nhất (k-NN) thuộc loại học nào?A. Học không giám sát.B. Học có giám sát.C. Học tăng cường.D. Học bán giám sát.Câu 41. Mục tiêu của việc đánh giá mô hình là gì?A. Tăng số lượng tham số.B. Xác định mô hình nào hoạt động tốt nhất trên dữ liệu chưa thấy.C. Tăng kích thước tập huấn luyện.D. Giảm số chiều dữ liệu.Câu 42. Biểu thức nào sau đây là dạng chuẩn?A. p → (q ∨ r)B. p ∧ (¬q ∨ r)C. p ↔ qD. p → q ∨ r`

function parseQuestions(text: string) {
  const normalized = text
    .replace(/\r\n/g, ' ')
    .replace(/\r/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  const questions: { content: string; options: { label: string; content: string }[] }[] = []

  const pattern = /Câu\s*(\d+)\s*[.:]/gi
  const matches: { index: number }[] = []
  let match
  while ((match = pattern.exec(normalized)) !== null) {
    matches.push({ index: match.index })
  }

  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index
    const end = matches[i + 1]?.index || normalized.length
    const block = normalized.substring(start, end).trim()

    let content = block.replace(/^Câu\s*\d+\s*[.:]\s*/i, '')

    // Tìm A. hoặc A đứng sau ký tự không phải chữ cái
    let aIdx = -1
    for (let j = 0; j < content.length - 1; j++) {
      if (content[j] === 'A' && (content[j + 1] === '.' || content[j + 1] === ' ')) {
        if (j === 0) { aIdx = 0; break }
        const prev = content[j - 1]
        if (!/[A-Za-zÀ-ỹ]/.test(prev)) { aIdx = j; break }
      }
    }

    if (aIdx < 5) continue

    const questionContent = content.substring(0, aIdx).trim()
    const optPart = content.substring(aIdx)

    // Parse options với logic mới
    const positions: { label: string; index: number }[] = []
    for (let j = 0; j < optPart.length; j++) {
      const curr = optPart[j]
      if (!['A', 'B', 'C', 'D'].includes(curr)) continue
      
      const prev = j > 0 ? optPart[j - 1] : ''
      const next = j < optPart.length - 1 ? optPart[j + 1] : ''
      
      // Pattern 1: X. (có dấu chấm sau)
      if (next === '.') {
        if (!prev || !/[A-Za-zÀ-ỹ]/.test(prev) || /[a-zà-ỹ]/.test(prev)) {
          positions.push({ label: curr, index: j })
        }
      }
      // Pattern 2: X không có dấu chấm nhưng đứng sau chữ thường
      else if (/[a-zà-ỹ]/.test(prev)) {
        if (/[A-ZÀ-Ỹ]/.test(next) || /[^A-Za-zÀ-ỹ0-9]/.test(next)) {
          positions.push({ label: curr, index: j })
        }
      }
    }

    positions.sort((a, b) => a.index - b.index)

    // Lọc A->B->C->D
    const seq: typeof positions = []
    let exp = 'A'
    for (const pos of positions) {
      if (pos.label === exp) {
        seq.push(pos)
        exp = exp === 'A' ? 'B' : exp === 'B' ? 'C' : exp === 'C' ? 'D' : ''
      }
    }

    const options: { label: string; content: string }[] = []
    for (let j = 0; j < seq.length; j++) {
      const current = seq[j]
      const next = seq[j + 1]
      const hasNextDot = optPart[current.index + 1] === '.'
      let s = current.index + (hasNextDot ? 2 : 1)
      while (s < optPart.length && optPart[s] === ' ') s++
      const e = next ? next.index : optPart.length
      let optContent = optPart.substring(s, e).trim()
      optContent = optContent.replace(/Câu\s*\d+\s*[.:].*$/i, '').trim()
      options.push({ label: current.label, content: optContent })
    }

    if (questionContent && options.length >= 2) {
      questions.push({ content: questionContent, options })
    }
  }

  return questions
}

async function main() {
  const questions = parseQuestions(rawText)
  console.log(`Parsed ${questions.length} questions`)
  
  // Create exam
  const exam = await prisma.exam.create({
    data: {
      title: 'Đề thi Trí tuệ nhân tạo',
      description: `Đề thi gồm ${questions.length} câu hỏi về AI, giải thuật tìm kiếm, học máy`,
      duration: 60,
      difficulty: 'medium',
      questions: {
        create: questions.map((q, idx) => ({
          content: q.content,
          order: idx,
          options: {
            create: ['A', 'B', 'C', 'D'].map(label => {
              const opt = q.options.find(o => o.label === label)
              return {
                label,
                content: opt?.content || '',
                isCorrect: false
              }
            })
          }
        }))
      }
    },
    include: {
      questions: { include: { options: true } }
    }
  })
  
  console.log(`Created exam with ID: ${exam.id}`)
  console.log(`Total questions: ${exam.questions.length}`)
  
  await prisma.$disconnect()
}

main().catch(console.error)
