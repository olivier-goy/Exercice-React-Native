import { RootView } from "@/components/RootView";
import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native";

export default function Pokemon () {

    const params = useLocalSearchParams()
    
        return <RootView>
            <Text>Pokemon {params.id}</Text>
        </RootView>
}