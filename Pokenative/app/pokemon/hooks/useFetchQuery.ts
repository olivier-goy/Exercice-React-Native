import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const endpoint = "https://pokeapi.co/api/v2";

type API = {
  "/pokemon?limit=151": {
    count: number;
    next: string | null;
    results: { name: string; url: string }[];
  };
  "/pokemon?limit=21": {
    count: number;
    next: string | null;
    results: { name: string; url: string }[];
  };
  "/pokemon/[id]": {
    id: number;
    name: string;
    url: string;
    weight: number;
    height: number;
    moves: { move: { name: string } }[];
    stats: {
      base_stat: number;
      stat: {
        name: string;
      };
    }[];
    cries: {
      latest: string;
    };
    types: {
      type: {
        name: keyof (typeof Colors)["type"];
      };
    }[];
  };
  "/pokemon-species/[id]": {
    flavor_text_entries: {
      flavor_text: string;
      language: {
        name: string;
      };
    }[];
  };
};

export function useFetchQuery<T extends keyof API>(path: T, params?: Record<string, string | number>) {
    const localUrl = endpoint + Object.entries(params ?? {}).reduce((acc, [key, value]) => acc.replaceAll(`[${key}]`, value), path);
    return useQuery({
        queryKey: [localUrl],
        queryFn: async () => {
            return fetch(localUrl, {
              headers: {
                Accept: "application/json",
              },
            }).then((result) => result.json() as Promise<API[T]>); 
        }
    })
};

export function useInfinitFetchQuery<T extends keyof API>(path: T) {
    return useInfiniteQuery({
        queryKey: [path],
        initialPageParam: endpoint + path,
        queryFn: async ({pageParam}) => {
            return fetch(pageParam, {
                headers: {
                    Accept: "application/json"
                }
            }).then(result => result.json() as Promise<API[T]>)
        },
        getNextPageParam: (lastPage) => {
            if("next" in lastPage) {
                return lastPage.next
            }
            return null
        }
    })
};