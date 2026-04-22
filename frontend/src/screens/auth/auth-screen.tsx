import { useEffect, useRef, useState } from "react";
import { Animated, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { login, register } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/store/auth-store";
import { AppButton } from "@/components/buttons";
import { getReadableNetworkError } from "@/services/api/network-error";
import type { RootStackParamList } from "@/navigation/root-stack";

console.log("AUTH SCREEN LOADED");

type Mode = "login" | "register";
type Role = "customer" | "truck_owner";
type FieldErrorKey = "fullName" | "phone" | "email" | "password";

const COUNTRY_CODES = [
  { code: "+966", label: "السعودية" },
  { code: "+971", label: "الإمارات" },
  { code: "+965", label: "الكويت" },
  { code: "+973", label: "البحرين" },
  { code: "+974", label: "قطر" },
  { code: "+20", label: "مصر" }
] as const;

type AuthRoute = RouteProp<RootStackParamList, "Auth">;

export const AuthScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<AuthRoute>();
  const setSession = useAuthStore((s) => s.setSession);
  const [mode, setMode] = useState<Mode>("login");
  const [role, setRole] = useState<Role>("customer");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState<(typeof COUNTRY_CODES)[number]["code"]>("+966");
  const [isCountryModalVisible, setIsCountryModalVisible] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldErrorKey, string>>>({});
  const [formError, setFormError] = useState("");
  const [successToastMessage, setSuccessToastMessage] = useState("");
  const toastTranslateY = useRef(new Animated.Value(-24)).current;
  const toastOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const initial = route.params?.initialMode;
    if (initial === "login" || initial === "register") {
      setMode(initial);
    }
  }, [route.params?.initialMode]);

  const showSuccessToastAndGoHome = (message: string) => {
    setSuccessToastMessage(message);
    Animated.parallel([
      Animated.timing(toastOpacity, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.spring(toastTranslateY, { toValue: 0, useNativeDriver: true, speed: 20, bounciness: 4 })
    ]).start();

    setTimeout(() => {
      navigation.replace("MainTabs");
    }, 900);
  };

  const loginMutation = useMutation({
    mutationFn: () => login(email.trim(), password),
    onSuccess: (data) => {
      setSession({ accessToken: data.accessToken, user: data.user });
      setFormError("");
      setFieldErrors({});
      showSuccessToastAndGoHome("تم تسجيل الدخول بنجاح، جاري تحويلك للرئيسية.");
    },
    onError: (error) => {
      setSuccessToastMessage("");
      setFormError(getReadableNetworkError(error));
    }
  });

  const registerMutation = useMutation({
    mutationFn: () =>
      register({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: `${selectedCountryCode}${phoneDigits}`,
        password,
        roleCode: role
      }),
    onSuccess: async () => {
      await loginMutation.mutateAsync();
      setFormError("");
      setFieldErrors({});
    },
    onError: (error) => {
      setSuccessToastMessage("");
      setFormError(getReadableNetworkError(error));
    }
  });

  const isLoading = loginMutation.isPending || registerMutation.isPending;
  const phoneDigits = phone.replace(/\D/g, "");
  const validateForm = (): boolean => {
    const nextErrors: Partial<Record<FieldErrorKey, string>> = {};

    if (mode === "register" && !fullName.trim()) {
      nextErrors.fullName = "الاسم الكامل مطلوب.";
    }

    if (!email.trim()) {
      nextErrors.email = "البريد الإلكتروني مطلوب.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "صيغة البريد الإلكتروني غير صحيحة.";
    }

    if (mode === "register") {
      if (!phoneDigits) {
        nextErrors.phone = "رقم الجوال مطلوب.";
      } else if (phoneDigits.length < 10) {
        nextErrors.phone = "رقم الجوال يجب ألا يقل عن 10 أرقام.";
      }
    }

    if (!password.trim()) {
      nextErrors.password = "كلمة المرور مطلوبة.";
    } else if (password.trim().length < 8) {
      nextErrors.password = "كلمة المرور يجب أن تكون 8 أحرف/أرقام على الأقل.";
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = () => {
    setFormError("");
    setSuccessToastMessage("");
    if (!validateForm()) {
      return;
    }

    if (mode === "login") {
      loginMutation.mutate();
      return;
    }
    registerMutation.mutate();
  };

  return (
    <View style={styles.screen}>
      {successToastMessage ? (
        <Animated.View
          style={[
            styles.successToast,
            {
              opacity: toastOpacity,
              transform: [{ translateY: toastTranslateY }]
            }
          ]}
        >
          <Ionicons name="checkmark-circle" size={20} color="#22C55E" />
          <Text style={styles.successToastText}>{successToastMessage}</Text>
        </Animated.View>
      ) : null}

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View>
          <Text style={styles.title}>{mode === "login" ? "تسجيل الدخول" : "إنشاء حساب جديد"}</Text>
          <Text style={styles.subtitle}>سجّل بحسابك الحقيقي وابدأ تجربة التطبيق.</Text>
        </View>

        <View style={styles.formCard}>
          <View style={styles.switchRow}>
            <Pressable style={[styles.segmentTab, mode === "login" && styles.segmentTabActive]} onPress={() => setMode("login")}>
              <Text style={[styles.segmentTabText, mode === "login" && styles.segmentTabTextActive]}>دخول</Text>
            </Pressable>
            <Pressable style={[styles.segmentTab, mode === "register" && styles.segmentTabActive]} onPress={() => setMode("register")}>
              <Text style={[styles.segmentTabText, mode === "register" && styles.segmentTabTextActive]}>تسجيل</Text>
            </Pressable>
          </View>

          {mode === "register" ? (
            <>
              <TextInput style={styles.input} placeholder="الاسم الكامل" placeholderTextColor="#7E8CA7" value={fullName} onChangeText={setFullName} />
              {fieldErrors.fullName ? <Text style={styles.fieldError}>{fieldErrors.fullName}</Text> : null}
              <View style={styles.phoneRow}>
                <Pressable style={styles.countryPickerButton} onPress={() => setIsCountryModalVisible(true)}>
                  <Ionicons name="chevron-down" size={16} color="#E2E8F0" />
                  <Text style={styles.countryPickerText}>{selectedCountryCode}</Text>
                </Pressable>
                <View style={styles.phoneInputWrap}>
                  <Ionicons name="keypad-outline" size={18} color="#7E8CA7" />
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="رقم الجوال"
                    placeholderTextColor="#7E8CA7"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>
              {fieldErrors.phone ? <Text style={styles.fieldError}>{fieldErrors.phone}</Text> : null}
              <View style={styles.switchRow}>
                <Pressable style={[styles.segmentTab, role === "customer" && styles.segmentTabActive]} onPress={() => setRole("customer")}>
                  <Text style={[styles.segmentTabText, role === "customer" && styles.segmentTabTextActive]}>زبون</Text>
                </Pressable>
                <Pressable style={[styles.segmentTab, role === "truck_owner" && styles.segmentTabActive]} onPress={() => setRole("truck_owner")}>
                  <Text style={[styles.segmentTabText, role === "truck_owner" && styles.segmentTabTextActive]}>صاحب ترك</Text>
                </Pressable>
              </View>
            </>
          ) : null}

          <TextInput
            style={styles.input}
            placeholder="البريد الإلكتروني"
            placeholderTextColor="#7E8CA7"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          {fieldErrors.email ? <Text style={styles.fieldError}>{fieldErrors.email}</Text> : null}
          <View style={styles.passwordWrap}>
            <TextInput
              style={styles.passwordInput}
              placeholder="كلمة المرور"
              placeholderTextColor="#7E8CA7"
              secureTextEntry={!isPasswordVisible}
              value={password}
              onChangeText={setPassword}
            />
            <Pressable onPress={() => setIsPasswordVisible((prev) => !prev)}>
              <Ionicons name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} size={20} color="#B6C4DE" />
            </Pressable>
          </View>
          {fieldErrors.password ? <Text style={styles.fieldError}>{fieldErrors.password}</Text> : null}

          <View>
            <AppButton
              label={mode === "login" ? "دخول" : "إنشاء الحساب"}
              onPress={submit}
              variant="primary"
              disabled={isLoading}
              loading={isLoading}
              fullWidth
              style={styles.submitButton}
            />
          </View>
          {formError ? <Text style={styles.error}>{formError}</Text> : null}
        </View>
      </ScrollView>

      <Modal visible={isCountryModalVisible} transparent animationType="slide" onRequestClose={() => setIsCountryModalVisible(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setIsCountryModalVisible(false)}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>اختر الدولة</Text>
            <ScrollView>
              {COUNTRY_CODES.map((country) => (
                <Pressable
                  key={country.code}
                  style={styles.modalOption}
                  onPress={() => {
                    setSelectedCountryCode(country.code);
                    setIsCountryModalVisible(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>
                    {country.label} ({country.code})
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F8FCFF" },
  content: {
    paddingTop: 70,
    paddingHorizontal: 20,
    paddingBottom: 38
  },
  successToast: {
    position: "absolute",
    top: 16,
    left: 20,
    right: 20,
    zIndex: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#14532D",
    backgroundColor: "rgba(5, 46, 22, 0.95)",
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  successToastText: {
    color: "#DCFCE7",
    fontWeight: "800",
    flex: 1
  },
  title: { color: "#0F172A", fontSize: 30, fontWeight: "800" },
  subtitle: { color: "#475569", marginTop: 8, marginBottom: 14 },
  formCard: {
    marginTop: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#CDE7FF",
    backgroundColor: "#FFFFFF",
    padding: 12,
    shadowColor: "#60A5FA",
    shadowOpacity: 0.14,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CDE7FF",
    borderRadius: 14,
    color: "#0F172A",
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginTop: 10
  },
  phoneRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10
  },
  countryPickerButton: {
    minWidth: 90,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#CDE7FF",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingHorizontal: 10
  },
  countryPickerText: {
    color: "#0F172A",
    fontWeight: "700"
  },
  phoneInputWrap: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#CDE7FF",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  phoneInput: {
    flex: 1,
    color: "#0F172A"
  },
  passwordWrap: {
    marginTop: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#CDE7FF",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  passwordInput: {
    flex: 1,
    color: "#0F172A"
  },
  submitButton: { marginTop: 14 },
  switchRow: { flexDirection: "row", gap: 10, marginTop: 8 },
  segmentTab: {
    flex: 1,
    minHeight: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CDE7FF",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10
  },
  segmentTabActive: {
    backgroundColor: "#EAF5FF",
    borderColor: "#60A5FA"
  },
  segmentTabText: {
    color: "#334155",
    fontWeight: "800"
  },
  segmentTabTextActive: {
    color: "#0F172A"
  },
  fieldError: { color: "#FCA5A5", marginTop: 6, marginHorizontal: 4, fontSize: 12 },
  error: { color: "#FCA5A5", marginTop: 10 },
  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.55)"
  },
  modalCard: {
    backgroundColor: "#0B122A",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#24324D",
    maxHeight: "60%"
  },
  modalTitle: {
    color: "#F8FAFC",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 10
  },
  modalOption: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#24324D",
    backgroundColor: "#111C33",
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 8
  },
  modalOptionText: {
    color: "#E2E8F0",
    fontWeight: "600"
  }
});
