import React from 'react'

const Pagination = ({ totalPages, currPage, setCurrPage, windowSize = 5 }) => {
  if (totalPages <= 1) return null;

  const getPages = () => {
    let start = Math.max(1, currPage - Math.floor(windowSize / 2));
    let end = start + windowSize - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - windowSize + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, ind) => start + ind);
  }

  const pages = getPages()

  return (
    <div className="flex justify-center items-center gap-2 mt-10">
      <button 
        className="px-4 py-2 bg-purple-200 text-purple-900 font-semibold rounded-lg disabled:opacity-50 hover:bg-purple-300 transition-colors"
        disabled={currPage === 1} 
        onClick={() => setCurrPage(p => p - 1)}
      >
        Prev
      </button>

      {pages.map((page) => (
        <button 
          key={page} 
          className={`w-10 h-10 rounded-lg font-semibold transition-colors ${page === currPage ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-900 hover:bg-purple-200'}`}
          onClick={() => setCurrPage(page)}
        >
          {page}
        </button>
      ))}

      <button 
        className="px-4 py-2 bg-purple-200 text-purple-900 font-semibold rounded-lg disabled:opacity-50 hover:bg-purple-300 transition-colors"
        disabled={currPage === totalPages} 
        onClick={() => setCurrPage(p => p + 1)}
      >
        Next
      </button>
    </div>
  )
}

export default Pagination