import { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PokemonListResult } from '@/lib/api';
import { usePokemonDetail } from '@/hooks/use-pokemon';
import { Skeleton } from '@/components/ui/skeleton';

interface PokemonCardProps {
  pokemon: PokemonListResult;
  isFavorite: boolean;
  onToggleFavorite: (name: string) => void;
  onClick: (name: string) => void;
}

export function PokemonCard({ pokemon, isFavorite, onToggleFavorite, onClick }: PokemonCardProps) {
  // Extract ID from URL for the image without fetching details yet
  // URL format: https://pokeapi.co/api/v2/pokemon/1/
  const id = pokemon.url.split('/').filter(Boolean).pop();
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  
  // We fetch details just for the types if we want to color code the card background slightly
  // Or we can just keep it clean white. Let's fetch details on hover or just rely on the modal for types?
  // Actually, displaying types on the card is a requirement. "Listing... with name and image" is required. 
  // "Filter by type" implies we should probably see the type.
  // To make it fast, we might need to fetch details for each card. 
  // Since it's a "Lite" app, let's fetch details. React Query handles caching well.
  
  const { data: details, isLoading } = usePokemonDetail(pokemon.name);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card 
        className="group relative overflow-visible border-none shadow-sm hover:shadow-xl transition-shadow duration-300 cursor-pointer bg-white dark:bg-slate-900"
        onClick={() => onClick(pokemon.name)}
        data-testid={`card-pokemon-${pokemon.name}`}
      >
        <CardContent className="p-4 pt-12 flex flex-col items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(pokemon.name);
            }}
            className={cn(
              "absolute top-3 right-3 p-2 rounded-full transition-colors z-10",
              isFavorite 
                ? "text-red-500 bg-red-50 dark:bg-red-900/20" 
                : "text-gray-300 hover:text-red-400 hover:bg-gray-50 dark:hover:bg-slate-800"
            )}
            data-testid={`button-favorite-${pokemon.name}`}
          >
            <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
          </button>

          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-28 h-28 drop-shadow-lg z-0 transition-transform duration-300 group-hover:scale-110">
             <img 
               src={imageUrl} 
               alt={pokemon.name}
               className="w-full h-full object-contain"
               loading="lazy"
             />
          </div>

          <div className="mt-6 text-center w-full">
            <span className="text-xs font-bold text-muted-foreground tracking-wider">#{id?.toString().padStart(3, '0')}</span>
            <h3 className="font-display text-xl font-bold capitalize mt-1 mb-3 text-foreground">
              {pokemon.name}
            </h3>
            
            <div className="flex gap-2 justify-center flex-wrap min-h-[24px]">
              {isLoading ? (
                <Skeleton className="h-5 w-16 rounded-full" />
              ) : (
                details?.types.map((t) => (
                  <Badge 
                    key={t.type.name}
                    variant="secondary"
                    className="capitalize px-2.5 py-0.5 text-xs font-medium text-white border-none shadow-sm"
                    style={{ backgroundColor: `var(--color-type-${t.type.name})` }}
                  >
                    {t.type.name}
                  </Badge>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
