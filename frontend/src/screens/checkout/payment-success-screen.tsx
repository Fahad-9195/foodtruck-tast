import { StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import { AppButton } from "@/components/buttons";
import { AppContainer } from "@/components/layout/app-container";
import type { RootStackParamList } from "@/navigation/root-stack";
import { colors, iconSize, radius, shadows, spacing, typography } from "@/theme/tokens";

type Props = NativeStackScreenProps<RootStackParamList, "PaymentSuccess">;

const statusLabel = (status: "pending" | "paid") => (status === "paid" ? "تم الدفع بنجاح" : "الدفع قيد المعالجة");

const methodLabel = (method: "card" | "apple_pay" | "mada" | "stc_pay") => {
  if (method === "apple_pay") return "Apple Pay";
  if (method === "mada") return "مدى";
  if (method === "stc_pay") return "STC Pay";
  return "بطاقة بنكية";
};

export const PaymentSuccessScreen = ({ route, navigation }: Props) => {
  const { orderId, paymentStatus, paymentMethod } = route.params;

  return (
    <AppContainer edges={["top"]}>
      <View style={styles.wrap}>
        <View style={styles.card}>
          <View style={[styles.iconRing, paymentStatus === "paid" ? styles.iconRingOk : styles.iconRingPending]}>
            <Ionicons
              name={paymentStatus === "paid" ? "checkmark-circle" : "time-outline"}
              size={iconSize.xl}
              color={paymentStatus === "paid" ? colors.success : colors.warning}
            />
          </View>
          <Text style={styles.title}>{statusLabel(paymentStatus)}</Text>
          <Text style={styles.body}>رقم الطلب #{orderId.toLocaleString("ar-SA")} • طريقة الدفع {methodLabel(paymentMethod)}</Text>
          <Text style={styles.hint}>يمكنك متابعة حالة الطلب من شاشة الطلبات.</Text>
        </View>

        <AppButton
          label="عرض طلباتي"
          onPress={() => navigation.replace("MainTabs", { screen: "Orders" })}
          variant="primary"
          fullWidth
        />
        <AppButton
          label="العودة للرئيسية"
          onPress={() => navigation.replace("MainTabs", { screen: "Home" })}
          variant="secondary"
          fullWidth
        />
      </View>
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    gap: spacing.md
  },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
    padding: spacing.xl,
    gap: spacing.sm,
    ...shadows.soft
  },
  iconRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1
  },
  iconRingOk: {
    borderColor: "rgba(25, 195, 125, 0.35)",
    backgroundColor: colors.successMuted
  },
  iconRingPending: {
    borderColor: "rgba(255, 176, 32, 0.45)",
    backgroundColor: colors.warningMuted
  },
  title: {
    color: colors.text,
    fontSize: typography.h2,
    fontWeight: "900",
    textAlign: "center"
  },
  body: {
    color: colors.textSecondary,
    fontSize: typography.bodySm,
    textAlign: "center",
    lineHeight: 22
  },
  hint: {
    color: colors.textMuted,
    fontSize: typography.caption,
    textAlign: "center"
  }
});
