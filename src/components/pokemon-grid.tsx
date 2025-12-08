import { PokemonListResult } from '@/lib/api';
import { PokemonCard } from './pokemon-card';

interface PokemonGridProps {
  pokemons: PokemonListResult[];
  favorites: string[];
  onToggleFavorite: (name: string) => void;
  onSelectPokemon: (name: string) => void;
}

export function PokemonGrid({ pokemons, favorites, onToggleFavorite, onSelectPokemon }: PokemonGridProps) {
  if (!pokemons?.length) {
    return (
      <div className="col-span-full text-center py-20">
        <div className="text-lg font-medium text-muted-foreground">No Pokémon found</div>
        <p className="text-sm text-muted-foreground mt-2">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12 pt-10 pb-10">
      {pokemons.map((pokemon) => (
        <PokemonCard
          key={pokemon.name}
          pokemon={pokemon}
          isFavorite={favorites.includes(pokemon.name)}
          onToggleFavorite={onToggleFavorite}
          onClick={onSelectPokemon}
        />
      ))}
    </div>
  );
}
