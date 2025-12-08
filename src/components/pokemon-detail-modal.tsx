import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { usePokemonDetail } from '@/hooks/use-pokemon';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Ruler, Weight, Zap } from 'lucide-react';

interface PokemonDetailModalProps {
  pokemonName: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PokemonDetailModal({ pokemonName, isOpen, onClose }: PokemonDetailModalProps) {
  const { data: pokemon, isLoading } = usePokemonDetail(pokemonName || '');

  if (!pokemonName) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-white dark:bg-slate-950 border-none shadow-2xl rounded-2xl gap-0">
        {isLoading ? (
          <div className="p-8 flex flex-col items-center gap-4">
            <Skeleton className="h-48 w-48 rounded-full" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-full max-w-md" />
          </div>
        ) : pokemon ? (
          <div className="flex flex-col md:flex-row">
            {/* Header / Visual Side */}
            <div 
              className="w-full md:w-2/5 p-8 flex flex-col items-center justify-center relative overflow-hidden"
              style={{ 
                backgroundColor: `var(--color-type-${pokemon.types[0].type.name})`,
              }}
            >
              <div className="absolute inset-0 bg-black/5 dark:bg-black/20 z-0" />
              <div className="absolute -right-12 -bottom-12 text-white/20 rotate-12 z-0">
                <Zap className="w-64 h-64" />
              </div>

              <div className="relative z-10 w-48 h-48 md:w-56 md:h-56 drop-shadow-2xl filter">
                <img 
                  src={pokemon.sprites.other['official-artwork'].front_default} 
                  alt={pokemon.name}
                  className="w-full h-full object-contain animate-in zoom-in-50 duration-500"
                />
              </div>
              
              <div className="relative z-10 mt-4 flex gap-2">
                {pokemon.types.map((t) => (
                  <Badge 
                    key={t.type.name}
                    className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm capitalize px-3 py-1"
                  >
                    {t.type.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Info Side */}
            <div className="w-full md:w-3/5 p-6 md:p-8 bg-white dark:bg-slate-900">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-sm font-bold text-muted-foreground tracking-wider">
                    #{pokemon.id.toString().padStart(3, '0')}
                  </span>
                  <DialogTitle className="text-3xl font-display font-bold capitalize text-foreground">
                    {pokemon.name}
                  </DialogTitle>
                </div>
              </div>

              {/* Physical Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl flex items-center gap-3">
                  <div className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm text-muted-foreground">
                    <Ruler className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Height</p>
                    <p className="text-sm font-bold">{pokemon.height / 10} m</p>
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl flex items-center gap-3">
                  <div className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm text-muted-foreground">
                    <Weight className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Weight</p>
                    <p className="text-sm font-bold">{pokemon.weight / 10} kg</p>
                  </div>
                </div>
              </div>

              {/* Base Stats */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Base Stats</h4>
                
                {pokemon.stats.map((stat) => (
                  <div key={stat.stat.name} className="grid grid-cols-12 items-center gap-2 group">
                    <span className="col-span-4 text-xs font-semibold capitalize text-muted-foreground group-hover:text-foreground transition-colors">
                      {stat.stat.name.replace('-', ' ')}
                    </span>
                    <span className="col-span-1 text-xs font-bold text-right pr-2">
                      {stat.base_stat}
                    </span>
                    <div className="col-span-7">
                      <Progress 
                        value={(stat.base_stat / 255) * 100} 
                        className="h-2" 
                        indicatorClassName={
                          stat.base_stat > 100 ? "bg-green-500" : 
                          stat.base_stat > 60 ? "bg-blue-500" : "bg-orange-500"
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              {/* Abilities */}
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Abilities</h4>
                <div className="flex flex-wrap gap-2">
                  {pokemon.abilities.map((a) => (
                    <Badge 
                      key={a.ability.name} 
                      variant="outline" 
                      className="capitalize py-1.5 px-3 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                    >
                      {a.ability.name.replace('-', ' ')}
                      {a.is_hidden && <span className="ml-1.5 text-[10px] text-muted-foreground">(Hidden)</span>}
                    </Badge>
                  ))}
                </div>
              </div>

            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
