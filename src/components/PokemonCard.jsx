import React from 'react'

const PokemonCard = ({ item, isFavorite, onToggleFavorite, onClick }) => {
  const imageUrl = item.sprites?.other?.['official-artwork']?.front_default || item.sprites?.front_default;

  return (
    <div 
      className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col items-center gap-4 cursor-pointer hover:-translate-y-2 hover:shadow-2xl hover:border-purple-200 transition-all duration-300 group relative overflow-hidden"
      onClick={onClick}
    >

      <div className="absolute inset-0 bg-gradient-to-b from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Heart Button */}
      <button 
        onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
        className="absolute top-4 right-4 text-2xl focus:outline-none z-10 transform hover:scale-125 transition-transform duration-200 cursor-pointer"
      >
        {isFavorite ? '❤️' : '🤍'}
      </button>


      <div className="bg-purple-200 group-hover:bg-purple-300 h-32 w-32 rounded-full flex items-center justify-center p-4 transition-colors duration-300 z-10 relative">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={item.name} 
            className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-300" 
          />
        ) : (
          <div className="text-gray-400">No Image</div>
        )}
      </div>
      

      <span className="bg-purple-100 text-purple-800 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider z-10">
        #{String(item.id).padStart(3, '0')}
      </span>

      {/* Info Section */}
      <div className="text-center z-10 mt-2">
        <h2 className="text-2xl font-extrabold capitalize text-gray-800 group-hover:text-purple-700 transition-colors">{item.name}</h2>
        
        {/*Type Badges */}
        <div className="flex gap-2 justify-center mt-3">
          {item.types.map(t => (
            <span key={t.type.name} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs capitalize font-semibold shadow-sm border border-gray-200">
              {t.type.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PokemonCard