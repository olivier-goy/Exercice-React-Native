import { useThemeColors } from '@/app/pokemon/hooks/useThemeColors';
import { Card } from '@/components/Card';
import { Row } from '@/components/Row';
import { SearchBar } from '@/components/SearchBar';
import { ThemedText } from '@/components/ThemedText';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PokemonCard } from './pokemon/constants/pokemon/PokemonCard';
import { getPokemonId } from './pokemon/functions/pokemon';
import { useInfinitFetchQuery } from './pokemon/hooks/useFetchQuery';

export default function Index() {
  const colors = useThemeColors();
  const { data, isFetching, fetchNextPage } = useInfinitFetchQuery("/pokemon?limit=21");
  const [search, setSearch] = useState(" ");
  const pokemons = data?.pages.flatMap(page => page.results) ?? [];
  const filteredPokemons = search ? pokemons.filter(p => p.name.includes(search.toLowerCase()) || getPokemonId(p.url).toString() === search) : pokemons;
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.tint }]}>
      <Row style={styles.header} gap={16}>
        <Image source={require("@/assets/images/pokeball.png")} width={24} height={24} />
        <ThemedText variant="headline" color="grayWhite">Pokédex</ThemedText>
      </Row>
      <Row>
        <SearchBar value={search} onChange={setSearch} />
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
          renderItem={({ item }) => <PokemonCard id={getPokemonId(item.url)} name={item.name} style={{ flex: 1 / 3 }} />} keyExtractor={(item) => item.url} />
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4,
  },
  header: {
    paddingHorizontal: 12,
    paddingVertical: 8,
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
  }
})