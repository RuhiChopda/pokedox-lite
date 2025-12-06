import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePokemonTypes } from '@/hooks/use-pokemon';

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
}

export function SearchFilter({ searchTerm, onSearchChange, selectedType, onTypeChange }: SearchFilterProps) {
  const { data: typesData } = usePokemonTypes();

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-3xl mx-auto mb-8">
      <div className="relative flex-1 group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          type="text"
          placeholder="Search Pokémon by name..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm rounded-xl focus-visible:ring-primary/20 focus-visible:border-primary"
          data-testid="input-search"
        />
        {searchTerm && (
          <button 
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      <div className="w-full sm:w-48">
        <Select value={selectedType} onValueChange={onTypeChange}>
          <SelectTrigger className="h-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm rounded-xl capitalize" data-testid="select-type">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {typesData?.results.map((type) => (
              <SelectItem key={type.name} value={type.name} className="capitalize">
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
