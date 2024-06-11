// src/api/autocomplete.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

type Suggestion = {
  name: string;
  category: string;
  value: number | string;
  id: string;
};

const fetchSuggestions = async (): Promise<Suggestion[]> => {
  const { data } = await axios.get<Suggestion[]>('https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete');
  return data;
};

export const useAutocomplete = (query: string) => {
  return useQuery({
    queryKey: ['autocomplete'],
    queryFn: fetchSuggestions,
    enabled: query.length > 0,
    select: (data) => data.filter(item => item.name.toLowerCase().includes(query.toLowerCase())),
  });
};
