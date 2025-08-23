import { useThemeColors } from '@/app/pokemon/hooks/useThemeColors';
import { Card } from '@/components/Card';
import { RootView } from '@/components/RootView';
import { Row } from '@/components/Row';
import { SearchBar } from '@/components/SearchBar';
import { SortBottom } from '@/components/SortButton';
import { ThemedText } from '@/components/ThemedText';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet } from "react-native";
import { PokemonCard } from '../components/pokemon/PokemonCard';
import { getPokemonId } from './pokemon/functions/pokemon';
import { useFetchQuery, useInfinitFetchQuery } from './pokemon/hooks/useFetchQuery';

export default function Index() {
  
  const colors = useThemeColors();

  const { data: allData } = useFetchQuery("/pokemon?limit=151");
  const { data, isFetching, fetchNextPage } = useInfinitFetchQuery("/pokemon?limit=21");

  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<"id" | "name">("id");

  const allPokemons = allData?.results.map(r => ({name: r.name, id: getPokemonId(r.url)})) ?? [];
  const pokemons = data?.pages.flatMap(page => page.results.map(result => ({name: result.name, id: getPokemonId(result.url)}))) ?? [];

  const cleanedSearch = search.trim();

  const filteredPokemons = [
    ...(cleanedSearch 
      ? allPokemons.filter(
        (p) => 
          p.name.includes(search.toLowerCase()) || 
        p.id.toString() === search,
      ) 
      : pokemons),
    ].sort((a, b) => (a[sortKey] < b[sortKey] ? -1 : 1));
    
  return (    
    <RootView>
      <Row style={styles.header} gap={16}>
        <Image source={require("@/assets/images/pokeball.png")} width={24} height={24} />
        <ThemedText variant="headline" color="grayWhite">Pokédex</ThemedText>        
      </Row>
      <Row gap={16} style={styles.form}>
        <SearchBar value={search} onChange={setSearch} />
        <SortBottom value={sortKey} onChange={setSortKey} />
      </Row>
      <Card style={styles.body}>
        <FlatList
          data={filteredPokemons}
          numColumns={3}
          contentContainerStyle={[styles.gridGap, styles.list]}
          columnWrapperStyle={styles.gridGap}
          ListFooterComponent={
            isFetching ? <ActivityIndicator color={colors.tint} /> : null
          }
          onEndReached={search ? undefined : () => fetchNextPage()}
          renderItem={({ item }) => <PokemonCard id={item.id} name={item.name} style={{ flex: 1 / 3 }} />} keyExtractor={(item) => item.id.toString()} />
      </Card>
    </RootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4,
  },
  header: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  body: {
    flex: 1,
    marginTop: 16,
  },
  gridGap: {
    gap: 8,
  },
  list: {
    padding: 12,
  },
  form: {
    paddingHorizontal: 12,
  }
});