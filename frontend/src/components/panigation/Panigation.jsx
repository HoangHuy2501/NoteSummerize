"use client"

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  totalPages: propTotalPages
}) {
  const totalPages = propTotalPages || (totalItems && itemsPerPage ? Math.ceil(totalItems / itemsPerPage) : 1);
  
  // Nếu không có trang nào hoặc không có dữ liệu, không hiển thị phân trang
  if (totalPages <= 0) {
    return null;
  }
  
  const pageNumbers = []
  const maxPageButtons = 5
  const maxMobileButtons = 3
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640
  const buttonsToShow = isMobile ? maxMobileButtons : maxPageButtons

  const showAllPages = totalPages <= buttonsToShow + 2

  if (showAllPages) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i)
    }
  } else {
    if (currentPage <= 4) {
      // Hiển thị đầu: 1 2 3 4 5 ... totalPages
      for (let i = 1; i <= 5; i++) pageNumbers.push(i)
      pageNumbers.push("...")
      pageNumbers.push(totalPages)
    } else if (currentPage >= totalPages - 3) {
      // Gần cuối: 1 ... totalPages-4 → totalPages
      pageNumbers.push(1)
      pageNumbers.push("...")
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Ở giữa: 1 ... currentPage-1, currentPage, currentPage+1 ... totalPages
      pageNumbers.push(1)
      pageNumbers.push("...")
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pageNumbers.push(i)
      }
      pageNumbers.push("...")
      pageNumbers.push(totalPages)
    }
  }

  return (
    <div className="w-full px-4 md:px-6 py-3 md:py-4 flex justify-end items-center bg-transparent">
      <div className="flex gap-1 md:gap-2">
        {/* Prev */}
        <button
          className={`px-2 md:px-3 py-1 md:py-2 border rounded-full text-xs md:text-sm bg-transparent
          ${currentPage > 1
            ? " text-gray-700  hover:border-blue-500"
            : "bg-gray-200 text-gray-400 cursor-not-allowed "}`}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          «
        </button>

        {/* Page numbers */}
        {pageNumbers.map((number, index) =>
          number === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 md:px-3 py-1 md:py-2 text-gray-400 text-xs md:text-sm"
            >
              ...
            </span>
          ) : (
            <button
              key={number}
              className={`px-2 md:px-3 py-1 md:py-2 border rounded-full text-xs md:text-sm bg-transparent
              ${currentPage === number
                ? "bg-blue-50 text-blue-600 font-medium border-blue-500"
                : " text-gray-700  hover:border-blue-500"}`}
              onClick={() => onPageChange(number)}
            >
              {number}
            </button>
          )
        )}
        {/* Next */}
        <button
          className={`px-2 md:px-3 py-1 md:py-2 border rounded-full text-xs md:text-sm bg-transparent
          ${currentPage < totalPages
            ? " text-gray-700  hover:border-blue-500 "
            : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          »
        </button>
      </div>
    </div>
  )
}