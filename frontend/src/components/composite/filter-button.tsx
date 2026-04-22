import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text } from "react-native";

export const FilterButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <Pressable onPress={onPress} style={styles.button}>
      <Ionicons name="options-outline" size={16} color="#0369A1" />
      <Text style={styles.label}>الفلاتر</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 14,
    backgroundColor: "#EAF5FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  label: {
    color: "#0369A1",
    fontWeight: "700",
    fontSize: 14
  }
});
