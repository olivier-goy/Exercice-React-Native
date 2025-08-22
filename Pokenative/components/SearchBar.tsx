import { useThemeColors } from "@/app/pokemon/hooks/useThemeColors";
import { Image, StyleSheet, TextInput } from "react-native";
import { Row } from "./Row";

type Props = {
    value: string,
    onChange: (s: string) => void,
};

export function SearchBar({value, onChange}: Props) {
    const colors = useThemeColors();
    const cleanedValue = value.includes(" ") ? value.replace(/\s+/g, "") : value;
    return (
        <Row gap={8} style={[styles.wrapper, { backgroundColor: colors.grayWhite }]}>
            <Image 
            source={require("@/assets/images/search.png")} 
            width={16} 
            height={16} 
            />
            <TextInput 
            onChangeText={onChange} 
            value={cleanedValue} 
            style={styles.input} 
            placeholder="SEARCH"
            />
        </Row>
        )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        borderRadius: 16,
        height: 32,
        paddingHorizontal: 12,
    },
    input: {
        flex: 1,
        height: 40,
        fontSize: 11,
        lineHeight: 16,
    }
});