import { useEffect, useRef, useState } from "react";
import PokemonCard from "./components/PokemonCard";
import SearchComponent from "./components/SearchComponent";
import Pagination from "./components/Pagination";
import PokemonModal from "./components/PokemonModal";
import useDebounce from "./hooks/useDebounce";
import Loader from "./components/Loader";

function App() {
  const [loading, setLoading] = useState(false);
  const [pokemons, setPokemons] = useState([]);
  const [error, setError] = useState('');
  
  // Search & Filter State
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const [selectedType, setSelectedType] = useState('');
  const [typesList, setTypesList] = useState([]);

  // Pagination State
  const [currPage, setCurrPage] = useState(1);
  const totalPages = useRef(1);
  const limit = 12;

  // Favorites & Modal State
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('poke-favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  // Fetch Types for the Filter Dropdown
  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/type')
      .then(res => res.json())
      .then(data => setTypesList(data.results))
      .catch(console.error);
  }, []);

  // Main Data Fetching Logic
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        let urlsToFetch = [];

        if (debouncedQuery) {
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${debouncedQuery.toLowerCase()}`);
          if (!res.ok) throw new Error('No Pokémon found with that name');
          const data = await res.json();
          if (isMounted) {
            setPokemons([data]);
            totalPages.current = 1;
            setLoading(false);
          }
          return;
        } 
        else if (selectedType) {
          const res = await fetch(`https://pokeapi.co/api/v2/type/${selectedType}`);
          const data = await res.json();
          const allOfType = data.pokemon.map(p => p.pokemon);
          totalPages.current = Math.ceil(allOfType.length / limit);
          
          urlsToFetch = allOfType.slice((currPage - 1) * limit, currPage * limit).map(p => p.url);
        } 
        else {
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${(currPage - 1) * limit}&limit=${limit}`);
          const data = await res.json();
          totalPages.current = Math.ceil(data.count / limit);
          urlsToFetch = data.results.map(r => r.url);
        }

        const detailsPromises = urlsToFetch.map(url => fetch(url).then(res => res.json()));
        const detailsData = await Promise.all(detailsPromises);
        
        if (isMounted) setPokemons(detailsData);
      } catch (err) {
        if (isMounted) {
          setPokemons([]);
          setError(err.message || 'Something went wrong');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, [currPage, debouncedQuery, selectedType]);

  useEffect(() => {
    setCurrPage(1);
  }, [debouncedQuery, selectedType]);

  const toggleFavorite = (id) => {
    let updatedFavorites;
    if (favorites.includes(id)) {
      updatedFavorites = favorites.filter(favId => favId !== id);
    } else {
      updatedFavorites = [...favorites, id];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem('poke-favorites', JSON.stringify(updatedFavorites));
  };

  return (
    <div className="min-h-screen pb-10 flex flex-col">
      <header className="bg-purple-900 text-white font-bold text-3xl py-6 text-center shadow-md fixed top-0 w-full z-40">
        Pokédex Lite
      </header>
     
      <div className="pt-32 px-6 md:px-12 max-w-7xl mx-auto w-full flex-grow flex flex-col">
        
        {/* Controls Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <SearchComponent value={query} setValue={setQuery} />
          </div>
          
          {/* Improved Filter Dropdown UI */}
          <div className="relative w-full md:w-64">
            {/* Filter Icon (Left) */}
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            
            <select 
              className="w-full appearance-none bg-white border border-gray-300 text-gray-700 py-4 pl-12 pr-10 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent font-medium cursor-pointer hover:border-purple-400 transition-colors capitalize"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">All Types</option>
              {typesList.map(type => (
                <option key={type.name} value={type.name} className="capitalize">{type.name}</option>
              ))}
            </select>
            
            {/* Chevron Down Icon (Right) */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
               <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
               </svg>
            </div>
          </div>
        </div>
            
        {/* Content Area (Minimum height prevents pagination from jumping) */}
        <div className="flex-grow min-h-[50vh]">
          {loading && (
           <Loader/>
          )}

          {error && (
            <div className="flex items-center justify-center h-full pt-10">
              <h2 className="text-2xl font-semibold text-red-600 bg-red-50 py-4 px-8 rounded-xl">{error}</h2>
            </div>
          )}
          
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {pokemons.length ? pokemons.map((item) => (
                <PokemonCard 
                  key={item.id} 
                  item={item} 
                  isFavorite={favorites.includes(item.id)}
                  onToggleFavorite={() => toggleFavorite(item.id)}
                  onClick={() => setSelectedPokemon(item)}
                />
              )) : (
                <div className="col-span-full text-center text-xl mt-10">No Pokémon found.</div>
              )}
            </div>
          )}
        </div>

        {/* Pagination sticks to the bottom of the flex layout if content is short */}
        <div className="mt-8">
          <Pagination totalPages={totalPages.current} currPage={currPage} setCurrPage={setCurrPage} />
        </div>
      </div>

      {/* Detail Modal */}
      {selectedPokemon && (
        <PokemonModal pokemon={selectedPokemon} onClose={() => setSelectedPokemon(null)} />
      )}
    </div>
  )
}

export default App;