import { useState, useMemo } from 'react';
import { usePokemonList } from '@/hooks/use-pokemon';
import { useFavorites } from '@/hooks/use-favorites';
import { PokemonGrid } from '@/components/pokemon-grid';
import { SearchFilter } from '@/components/search-filter';
import { Pagination } from '@/components/pagination';
import { PokemonDetailModal } from '@/components/pokemon-detail-modal';
import { Zap, Shuffle } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';

const PAGE_SIZE = 20;

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPokemon, setSelectedPokemon] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'favorites'>('all');

  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  
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
  }, [rawData, searchTerm, viewMode, favorites]); 

  const totalItems = filteredPokemon.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  
  useMemo(() => {
    setCurrentPage(0);
  }, [searchTerm, selectedType, viewMode]);

  const currentPokemon = filteredPokemon.slice(
    currentPage * PAGE_SIZE, 
    (currentPage + 1) * PAGE_SIZE
  );

  const handleRandomPokemon = () => {
    if (!rawData?.length) return;
    const random = rawData[Math.floor(Math.random() * rawData.length)];
    setSelectedPokemon(random.name);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-12 text-center relative">
          <div className="absolute right-0 top-0 hidden md:block">
             <ModeToggle />
          </div>
          
          <div className="inline-flex items-center justify-center p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm mb-6 ring-1 ring-slate-100 dark:ring-slate-800">
            <Zap className="w-8 h-8 text-primary fill-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Pokédex <span className="text-primary">Lite</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl font-medium">
            Search, filter, and collect your favorite Pokémon in this modern, responsive application.
          </p>

          <div className="md:hidden mt-4">
             <ModeToggle />
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-6 mb-8">
          <div className="flex items-center gap-4 w-full max-w-md">
            <Tabs defaultValue="all" value={viewMode} onValueChange={(v) => setViewMode(v as 'all' | 'favorites')} className="flex-1">
              <TabsList className="grid w-full grid-cols-2 h-12 rounded-xl bg-white dark:bg-slate-900 p-1 shadow-sm border border-slate-100 dark:border-slate-800">
                <TabsTrigger value="all" className="rounded-lg text-base font-medium data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800 data-[state=active]:text-primary">All Pokémon</TabsTrigger>
                <TabsTrigger value="favorites" className="rounded-lg text-base font-medium data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800 data-[state=active]:text-primary">Favorites</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button 
               variant="outline" 
               size="icon" 
               className="h-12 w-12 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:text-primary"
               onClick={handleRandomPokemon}
               title="Surprise Me!"
            >
              <Shuffle className="w-5 h-5" />
            </Button>
          </div>

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
            <div className="mb-4 text-sm font-medium text-muted-foreground ml-1 flex justify-between items-center">
              <span>Showing {currentPokemon.length} of {totalItems} Pokémon</span>
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
