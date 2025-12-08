import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('pokedex-favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('pokedex-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (name: string) => {
    setFavorites(prev => {
      const isFav = prev.includes(name);
      const newFavs = isFav 
        ? prev.filter(n => n !== name)
        : [...prev, name];
      
      if (!isFav) {
        toast({
          title: "Added to Favorites",
          description: `${name} has been added to your collection.`,
        });
      } else {
        toast({
          title: "Removed from Favorites",
          description: `${name} has been removed from your collection.`,
        });
      }
      
      return newFavs;
    });
  };

  const isFavorite = (name: string) => favorites.includes(name);

  return { favorites, toggleFavorite, isFavorite };
}
