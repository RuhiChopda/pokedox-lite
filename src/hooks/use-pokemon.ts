import { useQuery } from '@tanstack/react-query';
import { fetchPokemonList, fetchPokemonDetail, fetchAllPokemonTypes, fetchPokemonByType } from '@/lib/api';

export function usePokemonList(limit: number, offset: number, typeFilter?: string | null) {
  // If type filter is active, we fetch by type
  const isTypeFiltered = !!typeFilter && typeFilter !== 'all';

  const listQuery = useQuery({
    queryKey: ['pokemon-list', limit, offset],
    queryFn: () => fetchPokemonList(limit, offset),
    enabled: !isTypeFiltered,
  });

  const typeQuery = useQuery({
    queryKey: ['pokemon-by-type', typeFilter],
    queryFn: () => fetchPokemonByType(typeFilter!),
    enabled: isTypeFiltered,
  });

  return {
    data: isTypeFiltered ? typeQuery.data : listQuery.data?.results,
    totalCount: isTypeFiltered ? typeQuery.data?.length : listQuery.data?.count,
    isLoading: isTypeFiltered ? typeQuery.isLoading : listQuery.isLoading,
    error: isTypeFiltered ? typeQuery.error : listQuery.error,
    isTypeFiltered,
  };
}

export function usePokemonDetail(name: string) {
  return useQuery({
    queryKey: ['pokemon-detail', name],
    queryFn: () => fetchPokemonDetail(name),
    enabled: !!name,
  });
}

export function usePokemonTypes() {
  return useQuery({
    queryKey: ['pokemon-types'],
    queryFn: fetchAllPokemonTypes,
  });
}
