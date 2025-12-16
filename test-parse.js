// Test parser mới

function parseOptions(text) {
  const positions = []
  
  for (let i = 0; i < text.length; i++) {
    const curr = text[i]
    if (!['A', 'B', 'C', 'D'].includes(curr)) continue
    
    const prev = i > 0 ? text[i - 1] : ''
    const next = i < text.length - 1 ? text[i + 1] : ''
    
    // Pattern 1: X. (có dấu chấm sau)
    if (next === '.') {
      if (!prev || !/[A-Za-zÀ-ỹ]/.test(prev) || /[a-zà-ỹ]/.test(prev)) {
        positions.push({ label: curr, index: i, priority: 1 })
      }
    }
    // Pattern 2: X không có dấu chấm nhưng đứng sau chữ thường
    else if (/[a-zà-ỹ]/.test(prev)) {
      if (/[A-ZÀ-Ỹ]/.test(next) || /[^A-Za-zÀ-ỹ0-9]/.test(next)) {
        positions.push({ label: curr, index: i, priority: 2 })
      }
    }
  }
  
  positions.sort((a, b) => a.index - b.index)
  
  // Tìm A -> B -> C -> D
  const sequence = []
  let expected = 'A'
  for (const pos of positions) {
    if (pos.label === expected) {
      sequence.push(pos)
      expected = expected === 'A' ? 'B' : expected === 'B' ? 'C' : expected === 'C' ? 'D' : ''
    }
  }
  
  // Extract content
  const options = []
  for (let i = 0; i < sequence.length; i++) {
    const current = sequence[i]
    const next = sequence[i + 1]
    const hasNextDot = text[current.index + 1] === '.'
    let startIdx = current.index + (hasNextDot ? 2 : 1)
    while (startIdx < text.length && text[startIdx] === ' ') startIdx++
    const endIdx = next ? next.index : text.length
    let optContent = text.substring(startIdx, endIdx).trim()
    options.push({ label: current.label, content: optContent })
  }
  
  return options
}

// Test cases
console.log('=== Câu 26 ===')
const cau26 = `A. K-Nearest Neighbors AlgorithmB. K-Node NeighborsC. K-Nearest NeighborsD. K-Nearest Network`
console.log(parseOptions(cau26))

console.log('\n=== Câu 30 ===')
const cau30 = `A. ¬(p ∨ q) ≡ ¬p ∨ ¬qB. ¬(p ∧ q) ≡ ¬p ∨ ¬qC. ¬(p ∧ q) ≡ p ∨ qD. ¬(p ∨ q) ≡ p ∧ q`
console.log(parseOptions(cau30))

console.log('\n=== Câu 34 ===')
const cau34 = `A. QueueB. StackC. HeapD. Danh sách kề`
console.log(parseOptions(cau34))

console.log('\n=== Câu 35 ===')
const cau35 = `A. p ∧ q → p ∨ qB. p → qC. p ∧ ¬pD. p ∨ q → p`
console.log(parseOptions(cau35))
