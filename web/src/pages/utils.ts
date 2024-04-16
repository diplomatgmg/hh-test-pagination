const getPaginationNumbers = (currentPage: number, totalPages: number): number[] => {
  const halfWindow = Math.floor(10 / 2)
  let start = currentPage - halfWindow
  if (start < 1) {
    start = 1
  } else if (start + 9 > totalPages) {
    start = totalPages - 9
  }
  return Array.from({length: 10}, (_, index) => start + index)
    .filter(number => number > 0 && number <= totalPages)
}

export {getPaginationNumbers}
