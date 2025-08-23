import { Shadows } from "@/app/pokemon/constants/Shadows";
import { useThemeColors } from "@/app/pokemon/hooks/useThemeColors";
import { View, type ViewProps, type ViewStyle } from "react-native";

type Props = ViewProps;


export function Card({style, ...rest}: Props) {

    const colors = useThemeColors();

    return <View style={[styles, { backgroundColor: colors.grayWhite }, style]} {...rest}/>
}

const styles = {
    borderRadius: 8,
    ...Shadows.dp2,
} satisfies ViewStyle;