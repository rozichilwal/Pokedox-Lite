import React, { useEffect, useRef } from 'react'

const SearchComponent = ({ value, setValue }) => {
  const inputRef = useRef(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [])

  return (
    <div className="relative w-full">
      {/* Search Icon */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
      
      <input 
        ref={inputRef} 
        type="text" 
        placeholder="Search Pokémon by exact name or ID..." 
        className="w-full py-4 pl-12 pr-12 rounded-2xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 shadow-sm  focus:border-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-600/20 focus:shadow-lg transition-all text-lg"
        value={value} 
        onChange={(e) => setValue(e.target.value)} 
      />

      {/* Clear Button (only shows when there is text) */}
      {value && (
        <button 
          onClick={() => setValue('')}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-purple-600 transition-colors focus:outline-none"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      )}
    </div>
  )
}

export default SearchComponent