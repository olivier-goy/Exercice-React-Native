import { Card } from '@/components/Card';
import { ThemedText } from '@/components/ThemedText';
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColors } from './pokemon/hooks/useThemeColors';

export default function Index() {
  const colors = useThemeColors();
  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.tint}]}>
      <Card>
        <ThemedText variant="headline" color="grayDark">Pokédex</ThemedText>
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})