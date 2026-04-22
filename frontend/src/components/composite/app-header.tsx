import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type AppHeaderProps = {
  title?: string;
  locationLabel?: string;
  onChangeLocation?: () => void;
};

export const AppHeader = ({ title, locationLabel, onChangeLocation }: AppHeaderProps) => {
  if (title) {
    return (
      <View style={styles.containerTitleMode}>
        <Text style={styles.titleModeText}>{title}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Ionicons name="location" size={18} color="#5CA8FF" />
        <View>
          <Text style={styles.kicker}>التوصيل إلى</Text>
          <Text style={styles.location}>{locationLabel}</Text>
        </View>
      </View>
      <Pressable style={styles.action} onPress={onChangeLocation}>
        <Text style={styles.actionText}>تغيير</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  containerTitleMode: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#CDE7FF",
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start"
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  kicker: {
    color: "#7E8CA7",
    fontSize: 12
  },
  location: {
    color: "#F8FAFC",
    fontWeight: "700",
    fontSize: 16
  },
  titleModeText: {
    color: "#0F172A",
    fontWeight: "800",
    fontSize: 15
  },
  action: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#24324D",
    backgroundColor: "#111C33",
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  actionText: {
    color: "#E2E8F0",
    fontWeight: "700",
    fontSize: 12
  }
});
