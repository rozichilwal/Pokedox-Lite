import React, { useEffect } from 'react';

const PokemonModal = ({ pokemon, onClose }) => {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const imageUrl = pokemon.sprites?.other?.['official-artwork']?.front_default || pokemon.sprites?.front_default;

  const formatStatName = (name) => {
    const statMap = {
      'hp': 'HP',
      'attack': 'ATK',
      'defense': 'DEF',
      'special-attack': 'Sp. ATK',
      'special-defense': 'Sp. DEF',
      'speed': 'SPD'
    };
    return statMap[name] || name;
  };

  const getStatColor = (baseStat) => {
    if (baseStat < 50) return 'bg-red-400';
    if (baseStat < 80) return 'bg-orange-400';
    if (baseStat < 100) return 'bg-yellow-400';
    return 'bg-green-400';
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-gray-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div 
        className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col relative transform transition-all"
        onClick={(e) => e.stopPropagation()} 
      >
        
        {/* Floating Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-white/40 hover:bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center shadow-sm backdrop-blur-md transition-all focus:outline-none hover:scale-110 active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        {/* Scrollable Content Wrapper - ADDED custom-scrollbar HERE */}
        <div className="overflow-y-auto custom-scrollbar rounded-[2.5rem] w-full">
          
          {/* Header/Image Section with Gradient */}
          <div className="relative pt-12 pb-10 flex justify-center bg-gradient-to-br from-purple-400 via-purple-300 to-indigo-200">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <div className="w-64 h-64 border-[24px] border-white rounded-full"></div>
            </div>
            
            <div className="absolute top-6 left-6 z-10">
               <span className="bg-white/60 backdrop-blur-md text-purple-900 px-4 py-2 rounded-full font-black text-lg shadow-sm">
                #{String(pokemon.id).padStart(3, '0')}
              </span>
            </div>

            <img 
              src={imageUrl} 
              alt={pokemon.name} 
              className="h-56 w-56 object-contain relative z-10 drop-shadow-2xl" 
            />
          </div>
          
          {/* Detail Content Section */}
          <div className="p-8 bg-white -mt-6 rounded-t-[2rem] relative z-20">
            <h2 className="text-4xl font-extrabold capitalize text-center text-gray-800 mb-4 tracking-tight">
              {pokemon.name}
            </h2>
            
            <div className="flex justify-center gap-3 mb-8">
              {pokemon.types.map(t => (
                <span key={t.type.name} className="bg-purple-100 text-purple-800 border border-purple-200 px-4 py-1.5 rounded-xl text-sm font-bold capitalize tracking-wide shadow-sm">
                  {t.type.name}
                </span>
              ))}
            </div>

            {/* Physical Traits & Abilities Box */}
            <div className="grid grid-cols-3 gap-4 mb-8 text-center bg-gray-50 p-4 rounded-2xl border border-gray-100 shadow-inner">
              <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Height</p>
                <p className="font-semibold text-gray-800">{pokemon.height / 10} m</p>
              </div>
              <div className="border-l border-r border-gray-200">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Weight</p>
                <p className="font-semibold text-gray-800">{pokemon.weight / 10} kg</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Ability</p>
                <p className="font-semibold text-gray-800 text-sm capitalize truncate px-1">
                  {pokemon.abilities[0]?.ability?.name.replace('-', ' ')}
                </p>
              </div>
            </div>

            {/* Stats Section with Progress Bars */}
            <div className="pb-4">
              <h3 className="font-extrabold text-gray-800 text-lg mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                Base Stats
              </h3>
              <div className="space-y-3">
                {pokemon.stats.map(stat => (
                  <div key={stat.stat.name} className="flex items-center text-sm">
                    <span className="w-16 font-bold text-gray-400">{formatStatName(stat.stat.name)}</span>
                    <span className="w-10 font-black text-gray-700 text-right pr-3">{stat.base_stat}</span>
                    {/* Progress Bar Track */}
                    <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      {/* Progress Bar Fill */}
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${getStatColor(stat.base_stat)}`} 
                        style={{ width: `${Math.min((stat.base_stat / 255) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonModal;