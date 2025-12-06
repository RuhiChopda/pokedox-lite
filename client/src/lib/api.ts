
export interface PokemonListResult {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListResult[];
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  stats: {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }[];
  abilities: {
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }[];
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
}

const BASE_URL = 'https://pokeapi.co/api/v2';

export async function fetchPokemonList(limit = 20, offset = 0): Promise<PokemonListResponse> {
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  if (!response.ok) {
    throw new Error('Failed to fetch pokemon list');
  }
  return response.json();
}

export async function fetchPokemonDetail(nameOrId: string | number): Promise<PokemonDetail> {
  const response = await fetch(`${BASE_URL}/pokemon/${nameOrId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch pokemon: ${nameOrId}`);
  }
  return response.json();
}

export async function fetchAllPokemonTypes(): Promise<{ results: { name: string; url: string }[] }> {
  const response = await fetch(`${BASE_URL}/type`);
  if (!response.ok) {
    throw new Error('Failed to fetch types');
  }
  return response.json();
}

export async function fetchPokemonByType(type: string): Promise<PokemonListResult[]> {
  const response = await fetch(`${BASE_URL}/type/${type}`);
  if (!response.ok) {
    throw new Error('Failed to fetch pokemon by type');
  }
  const data = await response.json();
  return data.pokemon.map((p: any) => p.pokemon);
}
