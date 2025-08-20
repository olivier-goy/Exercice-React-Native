import { Colors } from "@/app/pokemon/constants/Colors";
import { Card } from "@/components/Card";
import { PokemonSpec } from "@/components/pokemon/PokemonSpec";
import { PokemonStat } from "@/components/pokemon/PokemonStat";
import { PokemonType } from "@/components/pokemon/PokemonType";
import { RootView } from "@/components/RootView";
import { Row } from "@/components/Row";
import { ThemedText } from "@/components/ThemedText";
import { Audio } from "expo-av";
import { router, useLocalSearchParams } from "expo-router";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { basePokemonStats, formatSize, formatWeight, getPokemonArtWork } from "./functions/pokemon";
import { useFetchQuery } from "./hooks/useFetchQuery";
import { useThemeColors } from "./hooks/useThemeColors";

export default function Pokemon() {

    const colors = useThemeColors();
    const params = useLocalSearchParams() as { id: string };
    const { data: pokemon } = useFetchQuery("/pokemon/[id]", { id: params.id });
    const { data: species } = useFetchQuery("/pokemon-species/[id]", { id: params.id });
    const id = parseInt(params.id, 10)
    const mainType = pokemon?.types?.[0].type.name;
    const colorType = mainType ? Colors.type[mainType] : colors.tint;
    const types = pokemon?.types ?? [];
    const bio = species?.flavor_text_entries?.find(({ language }) => language.name === "en")?.flavor_text.replaceAll("\n", ". ");
    const stats = pokemon?.stats ?? basePokemonStats;
    const onImagePress = async () => {
        const cry = pokemon?.cries.latest;
        if(!cry) {
            return;
        }
        const {sound} = await Audio.Sound.createAsync({
            uri: cry
        }, {shouldPlay: true});
        sound.playAsync();
    }

    const onPrevious = () => {
        router.replace({pathname: '/pokemon/[id]', params: {id: Math.max(id - 1, 1)}});
    }
    const onNext = () => {
        router.replace({ pathname: '/pokemon/[id]', params: { id: Math.min(id + 1, 151)} });
    }

    const isFirst = id === 1;
    const isLast = id === 151;

    return (
        <RootView backgroundColor={colorType}>
            <View>
                <Image style={styles.pokeball} source={require("@/assets/images/pokeball_big.png")} width={208} height={208} />
                <Row style={styles.header}>
                    <Row gap={8}>
                        <Pressable onPress={router.back}>
                            <Image source={require("@/assets/images/arrow_back.png")} width={32} height={32} />
                        </Pressable>
                        <ThemedText color="grayWhite" variant="headline" style={{ textTransform: "capitalize" }}>{pokemon?.name}</ThemedText>
                    </Row>
                    <ThemedText color="grayWhite" variant="subtitle2">
                        #{params.id.padStart(3, "0")}
                    </ThemedText>
                </Row>
                <View style={styles.body}>
                    <Row style={styles.rowImage}>
                        { isFirst ? <View style={{width: 24, height: 24}}></View> : <Pressable onPress={onPrevious}>
                            <Image source={require("@/assets/images/chevron_left.png")} width={24} height={24} />
                        </Pressable>}
                        <Pressable onPress={onImagePress}>
                            <Image
                                style={styles.artWork}
                                source={{ uri: getPokemonArtWork(params.id) }}
                                width={200}
                                height={200}
                            />
                        </Pressable>
                        {isLast ? <View style={{ width: 24, height: 24 }}></View> : <Pressable onPress={onNext}>
                            <Image source={require("@/assets/images/chevron_right.png")} width={24} height={24} />
                        </Pressable>}
                    </Row>
                    <Card style={styles.card}>
                        <Row gap={16} style={{ height: 20 }}>
                            {types.map(type => <PokemonType name={type.type.name} key={type.type.name} />)}
                        </Row>
                        <ThemedText style={{ color: colorType }} variant="subtitle1">About</ThemedText>
                        <Row>
                            <PokemonSpec style={[styles.pokemonSpec, { borderColor: colors.grayLight }]} title={formatWeight(pokemon?.weight)} description="Weight" image={require("@/assets/images/weight.png")} />
                            <PokemonSpec style={[styles.pokemonSpec, { borderColor: colors.grayLight }]} title={formatSize(pokemon?.height)} description="Size" image={require("@/assets/images/straighten.png")} />
                            <PokemonSpec title={pokemon?.moves.slice(0, 2).map((m) => m.move.name).join("\n")} description="Moves" />
                        </Row>
                        <ThemedText>{bio}</ThemedText>

                        {/* Stats */}
                        <ThemedText style={{ color: colorType }} variant="subtitle1">Bases Stats</ThemedText>

                        <View style={{ alignSelf: "stretch" }}>
                            {stats.map(stat => <PokemonStat key={stat.stat.name} name={stat.stat.name} value={stat.base_stat} color={colorType} />)}
                        </View>
                    </Card>
                </View>
            </View>
        </RootView>
    )
}

const styles = StyleSheet.create({
    header: {
        margin: 20,
        justifyContent: "space-between",
    },
    pokeball: {
        position: "absolute",
        right: 8,
        top: 8,
    },
    rowImage: {
        position: "absolute",
        alignSelf: "center",
        marginTop: -140,
        zIndex: 2,
        justifyContent: "space-between",
        left: 0,
        right: 0,
        paddingHorizontal: 20,
    },
    artWork: {

    },
    body: {
        marginTop: 144,
    },
    card: {
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        gap: 16,
        alignItems: "center",
    },
    pokemonSpec: {
        borderStyle: "solid",
        borderRightWidth: 1,
    }
})