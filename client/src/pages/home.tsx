import { useState, useMemo } from 'react';
import { usePokemonList } from '@/hooks/use-pokemon';
import { useFavorites } from '@/hooks/use-favorites';
import { PokemonGrid } from '@/components/pokemon-grid';
import { SearchFilter } from '@/components/search-filter';
import { Pagination } from '@/components/pagination';
import { PokemonDetailModal } from '@/components/pokemon-detail-modal';
import { Zap } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const PAGE_SIZE = 20;

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPokemon, setSelectedPokemon] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'favorites'>('all');

  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  
  // If filtering by type or favorites, we need to handle pagination differently
  // For simplicity in this "Lite" version:
  // 1. Main list: Server-side pagination via API
  // 2. Search/Type Filter: API supports type filtering, but searching by name across ALL pokemon requires fetching all or using a specific endpoint.
  //    The PokeAPI doesn't have a partial search endpoint. We have to list all to search all efficiently client side, OR search exactly by name.
  //    For a good UX, let's fetch a larger chunk or handle search by filtering the current view if it's just a prototype, 
  //    BUT the requirements say "Filter ... as the user types". 
  //    Strategy: 
  //    - Default: Fetch page by page.
  //    - Type selected: Fetch all of that type (API returns list), then paginate client-side.
  //    - Search active: This is tricky with PokeAPI without a backend proxy. 
  //      Option A: Search only within current page (bad UX).
  //      Option B: Fetch ALL pokemon names (lightweight, 100KB) once on load, and filter client side. This is the best "Lite" approach.
  
  // Let's switch to Option B for the most robust "Search/Filter" experience.
  // We'll fetch a large list (limit=10000) to get all names/urls, then paginate/filter client side.
  // This satisfies "Search by name" and "Filter by type" perfectly.
  
  const { data: allPokemonData, isLoading } = usePokemonList(2000, 0, selectedType === 'all' ? null : selectedType);
  // Note: The usePokemonList hook I wrote earlier handles basic pagination or type fetching.
  // If I want true client-side search, I should probably fetch "all" names if search is active.
  // Let's refine the hook usage or logic here.
  
  // Actually, fetching 1300 items is fast. Let's do that if the user searches.
  // But wait, usePokemonList was designed for server pagination.
  // Let's stick to the current hook:
  // - If type is 'all' and no search: Use server pagination (limit=20, offset=page*20).
  // - If type is selected: The hook returns ALL pokemon of that type. We paginate client-side.
  // - If search is active: This is the bottleneck. 
  // Let's modify the strategy: ALWAYS fetch by type (or all), then filter/paginate client side. 
  // This ensures search works across the whole set.
  
  // Re-evaluating usePokemonList:
  // It has `limit` and `offset`. 
  // If I pass limit=2000, I get everything.
  
  const { data: rawData, isLoading: isLoadingData } = usePokemonList(1500, 0, selectedType === 'all' ? null : selectedType);
  
  const filteredPokemon = useMemo(() => {
    if (!rawData) return [];
    
    let result = rawData;
    
    // Filter by search
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(lower));
    }

    // Filter by Favorites tab
    if (viewMode === 'favorites') {
      result = result.filter(p => isFavorite(p.name));
    }

    return result;
  }, [rawData, searchTerm, viewMode, favorites]); // Added favorites to dependency array to auto-update

  // Client-side pagination
  const totalItems = filteredPokemon.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  
  // Reset page when filters change
  useMemo(() => {
    setCurrentPage(0);
  }, [searchTerm, selectedType, viewMode]);

  const currentPokemon = filteredPokemon.slice(
    currentPage * PAGE_SIZE, 
    (currentPage + 1) * PAGE_SIZE
  );

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-12 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm mb-6">
            <Zap className="w-8 h-8 text-primary fill-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Pokédex <span className="text-primary">Lite</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl font-medium">
            Search, filter, and collect your favorite Pokémon in this modern, responsive application.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-6 mb-8">
          <Tabs defaultValue="all" value={viewMode} onValueChange={(v) => setViewMode(v as 'all' | 'favorites')} className="w-full max-w-md">
             <TabsList className="grid w-full grid-cols-2 h-12 rounded-xl bg-white dark:bg-slate-900 p-1 shadow-sm border border-slate-100 dark:border-slate-800">
              <TabsTrigger value="all" className="rounded-lg text-base font-medium data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800 data-[state=active]:text-primary">All Pokémon</TabsTrigger>
              <TabsTrigger value="favorites" className="rounded-lg text-base font-medium data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800 data-[state=active]:text-primary">My Favorites</TabsTrigger>
            </TabsList>
          </Tabs>

          <SearchFilter 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
          />
        </div>

        {/* Content */}
        {isLoadingData ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pt-10">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-64 bg-white dark:bg-slate-900 rounded-3xl shadow-sm animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm font-medium text-muted-foreground ml-1">
              Showing {currentPokemon.length} of {totalItems} Pokémon
            </div>
            
            <PokemonGrid 
              pokemons={currentPokemon}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onSelectPokemon={setSelectedPokemon}
            />

            {totalPages > 1 && (
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                hasNext={currentPage < totalPages - 1}
                hasPrev={currentPage > 0}
              />
            )}
          </>
        )}

        <PokemonDetailModal 
          pokemonName={selectedPokemon}
          isOpen={!!selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
        />

      </div>
    </div>
  );
}
