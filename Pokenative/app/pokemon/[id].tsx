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
import { useRef, useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import PagerView from "react-native-pager-view";
import { basePokemonStats, formatSize, formatWeight, getPokemonArtWork } from "./functions/pokemon";
import { useFetchQuery } from "./hooks/useFetchQuery";
import { useThemeColors } from "./hooks/useThemeColors";

export default function Pokemon() {
    const params = useLocalSearchParams() as { id: string };
    const [id, setId] = useState(parseInt(params.id, 10));
    const offset = useRef(1);
    const pager = useRef<PagerView>(null);

    const onPageSelected = (e: { nativeEvent: { position: number } }) => {
        offset.current = e.nativeEvent.position - 1
    };

    const onPageScrollStateChanged = (e: { nativeEvent: { pageScrollState: string } }) => {        

        if (e.nativeEvent.pageScrollState !== "idle") {
            return;
        }
        if (id === 1 && offset.current === -1) {
            offset.current = 0;
            pager.current?.setPageWithoutAnimation(1);
            return;
        }
        if (id === 151 && offset.current === 1) {
            offset.current = 0;
            pager.current?.setPageWithoutAnimation(1);
            return;
        }
        if (offset.current === -1 && id === 2) {
            return;
        }
        if (offset.current === 1 && id === 150) {
            return;
        }
        if (offset.current !== 0) {
            setId(id + offset.current);
            offset.current = 0;
            pager.current?.setPageWithoutAnimation(1);
        }
    };

    const onNext = () => {
        pager.current?.setPage(2 + offset.current);    
    }
    const onPrevious = () => {
        pager.current?.setPage(0);
    }


    return (
        <PagerView ref={pager} onPageSelected={onPageSelected} onPageScrollStateChanged={onPageScrollStateChanged} initialPage={1} style={{ flex: 1 }}>
            <PokemonView key={id - 1} id={id - 1} onNext={onNext} onPrevious={onPrevious} />
            <PokemonView key={id} id={id} onNext={onNext} onPrevious={onPrevious} />
            <PokemonView key={id + 1} id={id + 1} onNext={onNext} onPrevious={onPrevious} />
        </PagerView>
    );
}

type Props = {
    id: number,
    onPrevious: () => void,
    onNext: () => void,
}

function PokemonView({ id, onPrevious, onNext }: Props) {

    const colors = useThemeColors();

    const { data: pokemon } = useFetchQuery("/pokemon/[id]", { id: id });
    const { data: species } = useFetchQuery("/pokemon-species/[id]", { id: id });

    const mainType = pokemon?.types?.[0].type.name;
    const colorType = mainType ? Colors.type[mainType] : colors.tint;
    const types = pokemon?.types ?? [];
    const bio = species?.flavor_text_entries?.find(({ language }) => language.name === "en")?.flavor_text.replaceAll("\n", ". ");
    const stats = pokemon?.stats ?? basePokemonStats;

    const onImagePress = async () => {
        const cry = pokemon?.cries.latest;
        if (!cry) {
            return;
        }
        const { sound } = await Audio.Sound.createAsync({
            uri: cry
        }, { shouldPlay: true });
        sound.playAsync();
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
                        #{id.toString().padStart(3, "0")}
                    </ThemedText>
                </Row>

                <Card style={styles.card}>
                    <Row style={styles.rowImage}>
                        {isFirst ? (<View style={{ width: 24, height: 24 }}></View>) : (<Pressable onPress={onPrevious}>
                            <Image source={require("@/assets/images/chevron_left.png")} width={24} height={24} />
                        </Pressable>)}

                        <Pressable onPress={onImagePress}>
                            <Image
                                source={{ uri: getPokemonArtWork(id) }}
                                width={200}
                                height={200}
                            />
                        </Pressable>

                        {isLast ? (<View style={{ width: 24, height: 24 }}></View>) : (<Pressable onPress={onNext}>
                            <Image source={require("@/assets/images/chevron_right.png")} width={24} height={24} />
                        </Pressable>)}
                    </Row>
                    <Row gap={16} style={{ height: 20 }}>
                        {types.map(type => <PokemonType key={type.type.name} name={type.type.name} />)}
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
        marginTop: -140,
        zIndex: 2,
        justifyContent: "space-between",
        left: 0,
        right: 0,
        paddingHorizontal: 20,
    },
    card: {
        marginTop: 144,
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