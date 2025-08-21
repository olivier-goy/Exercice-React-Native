import { useThemeColors } from "@/app/pokemon/hooks/useThemeColors";
import { useEffect } from "react";
import { View, ViewProps, ViewStyle } from "react-native";
import Animated, { Easing, interpolateColor, ReduceMotion, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = ViewProps & {
    backgroundColor?: string,
};

export function RootView({ style, backgroundColor, ...rest }: Props) {
    const colors = useThemeColors();
    const progress = useSharedValue(0);
    const animatedStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                progress.value,
                [0, 1],
                [colors.tint, backgroundColor ?? colors.tint],
            ),
        }
    }, [backgroundColor]);

    useEffect(() => {
        if (backgroundColor) {
            progress.value = 0;
            progress.value = withTiming(1, {
                duration: 700,
                easing: Easing.out(Easing.quad),
                reduceMotion: ReduceMotion.System,
            });
        }
    }, [backgroundColor]);

    if (!backgroundColor) {
        return (
            <SafeAreaView style={[rootStyle, { backgroundColor: colors.tint }, style]} {...rest} />
        )
    }

    return (
        <Animated.View style={[{ flex: 1 }, animatedStyle, style]}>
            <View style={[{ flex: 1 }, animatedStyle, style]}>
                <SafeAreaView style={rootStyle} {...rest}></SafeAreaView>
            </View>
        </Animated.View>
    )
}

const rootStyle = {
    flex: 1,
    padding: 4,
} satisfies ViewStyle;