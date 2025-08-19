import { Image, ImageSourcePropType, StyleSheet, View, ViewProps } from "react-native";
import { Row } from "../Row";
import { ThemedText } from "../ThemedText";

type Props = ViewProps & {
    title?: string,
    description?: string,
    image?: ImageSourcePropType,
}

export function PokemonSpec ({style, image, title, description, ...rest}: Props) {
    return (
    <View style={[style, styles.root]} {...rest}>
        <Row style={styles.rowPokemon}>
            {image && <Image source={image} width={16} height={16} />}
            <ThemedText>{title}</ThemedText>
        </Row>
        <ThemedText variant="caption" color="grayMedium">{description}</ThemedText>
    </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        gap: 4,
        alignItems: "center",
    },
    rowPokemon: {
        height: 32,
        alignItems: "center",
    }
})