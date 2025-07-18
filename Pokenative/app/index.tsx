import { useThemeColors } from '@/app/pokemon/hooks/useThemeColors';
import { Card } from '@/components/Card';
import { ThemedText } from '@/components/ThemedText';
import { ActivityIndicator, FlatList, Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PokemonCard } from './pokemon/constants/pokemon/PokemonCard';
import { getPokemonId } from './pokemon/functions/pokemon';
import { useFetchQuery } from './pokemon/hooks/useFetchQuery';

export default function Index() {
  const colors = useThemeColors();
  const {data, isFetching} = useFetchQuery("/pokemon?limit=21")
  const pokemons = data?.results ?? []
  
  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.tint}]}>
      <View style={styles.header}>
        <Image source={require("@/assets/images/pokeball.png")} width={24} height={24}/>
        <ThemedText variant="headline" color="grayWhite">Pokédex</ThemedText>
      </View>
      <Card style={styles.body}>
        <FlatList 
        data={pokemons} 
        numColumns={3}
        contentContainerStyle={[styles.gridGap, styles.list]}
        columnWrapperStyle={styles.gridGap}
        ListFooterComponent={
          isFetching ? <ActivityIndicator color={colors.tint} /> : null
        }
        renderItem={({item}) => <PokemonCard id={getPokemonId(item.url)} name={item.name} style={{flex: 1/3}}/>} keyExtractor={(item) => item.url}/>
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
    flexDirection: "row", 
    alignItems: "center",
    gap: 16,
    padding: 12,
  },
  body: {
    flex: 1,
  },
  gridGap: {
    gap: 8,
  },
  list:{
    padding: 12,
  }
})