import { View } from "react-native";
import { Text, useTheme } from "react-native-magnus";

export default function Transfers() {
  const {
    theme: { colors },
  } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors?.gray900 }}>
      <View style={{ flex: 1, backgroundColor: colors?.gray900 }}>
        <Text fontSize="2xl" fontWeight="bold">
          Transfers
        </Text>
      </View>
    </View>
  );
}
