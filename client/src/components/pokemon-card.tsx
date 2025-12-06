import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
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
  const id = pokemon.url.split('/').filter(Boolean).pop();
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  const { data: details, isLoading } = usePokemonDetail(pokemon.name);

  // 3D Tilt Effect Setup
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    x.set(clientX - left - width / 2);
    y.set(clientY - top - height / 2);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const rotateX = useTransform(mouseY, [-100, 100], [10, -10]);
  const rotateY = useTransform(mouseX, [-100, 100], [-10, 10]);
  
  return (
    <motion.div
      style={{ 
        perspective: 1000,
      }}
      className="group"
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
        }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        whileHover={{ scale: 1.05, zIndex: 10 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="relative preserve-3d"
      >
        <Card 
          className="relative overflow-visible border-none shadow-sm group-hover:shadow-2xl transition-shadow duration-300 cursor-pointer bg-white dark:bg-slate-900 rounded-2xl h-full"
          onClick={() => onClick(pokemon.name)}
          data-testid={`card-pokemon-${pokemon.name}`}
        >
          {/* Holographic Shine Effect */}
          <div 
             className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none z-20 transition-opacity duration-500 bg-gradient-to-tr from-transparent via-white/20 to-transparent"
             style={{
               backgroundSize: '200% 200%',
               backgroundPosition: '0% 0%',
             }}
          />
          
          <CardContent className="p-4 pt-12 flex flex-col items-center h-full">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(pokemon.name);
              }}
              className={cn(
                "absolute top-3 right-3 p-2 rounded-full transition-colors z-30",
                isFavorite 
                  ? "text-red-500 bg-red-50 dark:bg-red-900/20" 
                  : "text-gray-300 hover:text-red-400 hover:bg-gray-50 dark:hover:bg-slate-800"
              )}
              data-testid={`button-favorite-${pokemon.name}`}
            >
              <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
            </button>

            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-28 h-28 drop-shadow-lg z-10 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-2">
               <img 
                 src={imageUrl} 
                 alt={pokemon.name}
                 className="w-full h-full object-contain"
                 loading="lazy"
               />
            </div>

            <div className="mt-6 text-center w-full flex flex-col flex-grow justify-end">
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
    </motion.div>
  );
}
