import { useEffect, useMemo, useState } from "react";
import { AppButton } from "@/components/buttons";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useMutation, useQuery } from "@tanstack/react-query";

import { AppContainer } from "@/components/layout/app-container";
import { createAdminAccount } from "@/features/admin/api/admin.api";
import { changeMyPassword, updateMyProfile } from "@/features/auth/api/auth.api";
import { getMyOwnerTruckDraft } from "@/features/trucks/api/trucks.api";
import type { RootStackParamList } from "@/navigation/root-stack";
import { getReadableNetworkError } from "@/services/api/network-error";
import { useAuthStore } from "@/store/auth-store";
import { colors, iconSize, radius, shadows, spacing, typography } from "@/theme/tokens";

export const ProfileScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const accessToken = useAuthStore((s) => s.accessToken) ?? "";
  const user = useAuthStore((s) => s.user);
  const setSession = useAuthStore((s) => s.setSession);
  const clearSession = useAuthStore((s) => s.clearSession);
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [adminFullName, setAdminFullName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPhone, setAdminPhone] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const isAuthenticated = !!accessToken && !!user;
  const normalizedRoleCode = (user?.roleCode ?? "").trim().toLowerCase().replace(/[-\s]/g, "_");
  const isAdmin = isAuthenticated && normalizedRoleCode === "admin";
  const isCustomer = isAuthenticated && normalizedRoleCode === "customer";
  const isTruckOwner =
    isAuthenticated &&
    (normalizedRoleCode === "truck_owner" || normalizedRoleCode === "truckowner" || normalizedRoleCode === "owner");
  const canEditProfile = isCustomer || isTruckOwner || isAdmin;

  const ownerTruckDraftQuery = useQuery({
    queryKey: ["owner-truck-draft", accessToken],
    queryFn: () => getMyOwnerTruckDraft(accessToken),
    enabled: !!accessToken && isTruckOwner
  });

  const draft = ownerTruckDraftQuery.data;
  const truckStatusLabel =
    draft?.approval_status === "pending"
      ? "قيد المراجعة"
      : draft?.approval_status === "rejected"
        ? "يحتاج تعديل"
        : draft?.approval_status === "approved"
          ? "معتمد"
          : null;

  useEffect(() => {
    setFullName(user?.fullName ?? "");
    setEmail(user?.email ?? "");
    setPhone(user?.phone ?? "");
  }, [user?.fullName, user?.email, user?.phone]);

  const canSaveProfile = useMemo(() => {
    if (!user) return false;
    if (!fullName.trim() || !email.trim() || !phone.trim()) return false;
    return fullName.trim() !== user.fullName || email.trim() !== user.email || phone.trim() !== user.phone;
  }, [email, fullName, phone, user]);

  const profileErrors = useMemo(() => {
    const e: string[] = [];
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.push("صيغة البريد غير صحيحة");
    if (phone.trim() && phone.trim().length < 8) e.push("رقم الجوال قصير جدًا");
    return e;
  }, [email, phone]);

  const updateProfileMutation = useMutation({
    mutationFn: () =>
      updateMyProfile(
        {
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim()
        },
        accessToken
      ),
    onSuccess: (updatedUser) => {
      if (!user || !accessToken) return;
      setSession({
        accessToken,
        user: {
          id: updatedUser.id,
          fullName: updatedUser.fullName,
          email: updatedUser.email,
          phone: updatedUser.phone,
          roleCode: updatedUser.roleCode
        }
      });
      setSuccessMessage("تم حفظ بياناتك بنجاح.");
      setErrorMessage("");
    },
    onError: (error) => {
      setErrorMessage(getReadableNetworkError(error));
      setSuccessMessage("");
    }
  });

  const changePasswordMutation = useMutation({
    mutationFn: () =>
      changeMyPassword(
        {
          currentPassword,
          newPassword
        },
        accessToken
      ),
    onSuccess: () => {
      setCurrentPassword("");
      setNewPassword("");
      setSuccessMessage("تم تغيير كلمة المرور.");
      setErrorMessage("");
    },
    onError: (error) => {
      setErrorMessage(getReadableNetworkError(error));
      setSuccessMessage("");
    }
  });

  const createAdminMutation = useMutation({
    mutationFn: () =>
      createAdminAccount(
        {
          fullName: adminFullName.trim(),
          email: adminEmail.trim(),
          phone: adminPhone.trim(),
          password: adminPassword
        },
        accessToken
      ),
    onSuccess: () => {
      setAdminFullName("");
      setAdminEmail("");
      setAdminPhone("");
      setAdminPassword("");
      setSuccessMessage("تم إنشاء حساب أدمن.");
      setErrorMessage("");
    },
    onError: (error) => {
      setErrorMessage(getReadableNetworkError(error));
      setSuccessMessage("");
    }
  });

  const isBusy = updateProfileMutation.isPending || changePasswordMutation.isPending || createAdminMutation.isPending;

  return (
    <AppContainer edges={["top"]}>
      <ScrollView style={styles.flex} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <View style={styles.avatar}>
            <Ionicons
              name={isTruckOwner ? "storefront" : "person"}
              size={iconSize.xl}
              color={colors.primary}
            />
          </View>
          <Text style={styles.displayName}>{user?.fullName ?? "زائر"}</Text>
          {isTruckOwner ? (
            <View style={styles.roleTag}>
              <Text style={styles.roleTagText}>صاحب ترك</Text>
            </View>
          ) : isAdmin ? (
            <View style={styles.roleTag}>
              <Text style={styles.roleTagText}>أدمن</Text>
            </View>
          ) : null}
          <Text style={styles.displayEmail}>{user?.email ?? "سجّل الدخول للمتابعة"}</Text>
          {user?.phone ? <Text style={styles.displayPhone}>{user.phone}</Text> : null}
        </View>

        {!user ? (
          <View style={styles.guestAuthCard}>
            <Text style={styles.guestTitle}>سجّل دخولك</Text>
            <Text style={styles.guestBody}>أنشئ حسابًا لمتابعة الطلبات وحفظ تفضيلاتك، أو سجّل الدخول إن كان لديك حساب بالفعل.</Text>
            <View style={styles.guestActions}>
              <View>
                <AppButton label="تسجيل الدخول" onPress={() => navigation.navigate("Auth", { initialMode: "login" })} variant="primary" />
              </View>
              <View>
                <AppButton label="إنشاء حساب" onPress={() => navigation.navigate("Auth", { initialMode: "register" })} variant="secondary" />
              </View>
            </View>
          </View>
        ) : null}

        <View style={styles.section}>
          {isTruckOwner ? (
            <View style={styles.truckOwnerCard}>
              <View style={styles.truckOwnerCardHeader}>
                <Text style={styles.cardTitle}>بيانات الترك</Text>
                {draft?.approval_status === "pending" ? (
                  <View style={styles.statusBadgePending}>
                    <Text style={styles.statusBadgePendingText}>قيد المراجعة</Text>
                  </View>
                ) : null}
              </View>
              {draft?.display_name ? (
                <Text style={styles.truckNamePreview} numberOfLines={1}>
                  {draft.display_name}
                </Text>
              ) : (
                <Text style={styles.truckNamePreviewMuted}>أكمل أو حدّث بيانات الترك من النموذج</Text>
              )}
              {truckStatusLabel && draft?.approval_status !== "pending" ? (
                <Text style={styles.truckStatusLine}>الحالة: {truckStatusLabel}</Text>
              ) : null}
              {draft?.approval_status === "pending" ? (
                <Text style={styles.truckPendingNotice}>
                  يوجد طلب تحديث قيد المراجعة حاليًا. يمكنك متابعة الحالة من هذا القسم.
                </Text>
              ) : null}
              <Text style={styles.truckOwnerHint}>
                تُعرض الحقول من بيانات تسجيلك. عند الحفظ يُرسل طلب تحديث للإدارة ولا يُعتمد مباشرة لدى الزبائن قبل الموافقة.
              </Text>
              <View style={styles.truckOwnerActionBlock}>
                <AppButton
                  label="تحديث بيانات الترك"
                  icon="create-outline"
                  onPress={() => navigation.navigate("OwnerOnboarding", { flow: draft ? "update" : "register" })}
                  variant="primary"
                  size="lg"
                  fullWidth
                />
              </View>
            </View>
          ) : null}

          {canEditProfile ? (
            <>
              {isAdmin ? (
                <View style={styles.inlineHintCard}>
                  <Ionicons name="shield-checkmark-outline" size={iconSize.md} color={colors.primaryDark} />
                  <Text style={styles.inlineHintText}>
                    يمكنك تحديث بيانات حسابك من هنا، وسيتم مزامنة الجلسة مباشرة بعد الحفظ.
                  </Text>
                </View>
              ) : null}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{isAdmin ? "بياناتي الشخصية" : isTruckOwner ? "بياناتك الشخصية" : "البيانات الشخصية"}</Text>
                {profileErrors.map((msg) => (
                  <Text key={msg} style={styles.fieldError}>
                    {msg}
                  </Text>
                ))}
                <TextInput style={styles.input} placeholder="الاسم" placeholderTextColor={colors.textMuted} value={fullName} onChangeText={setFullName} />
                <TextInput
                  style={styles.input}
                  placeholder="البريد"
                  placeholderTextColor={colors.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                <TextInput
                  style={styles.input}
                  placeholder="الجوال"
                  placeholderTextColor={colors.textMuted}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
                <AppButton
                  label="حفظ التعديلات"
                  variant="secondary"
                  onPress={() => {
                    setErrorMessage("");
                    setSuccessMessage("");
                    updateProfileMutation.mutate();
                  }}
                  disabled={!canSaveProfile || isBusy || profileErrors.length > 0}
                  loading={updateProfileMutation.isPending}
                  fullWidth
                />
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>كلمة المرور</Text>
                <TextInput
                  style={styles.input}
                  placeholder="الحالية"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                />
                <TextInput
                  style={styles.input}
                  placeholder="الجديدة"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <AppButton
                  label="تحديث كلمة المرور"
                  variant="secondary"
                  onPress={() => {
                    setErrorMessage("");
                    setSuccessMessage("");
                    changePasswordMutation.mutate();
                  }}
                  disabled={isBusy || !currentPassword || !newPassword || newPassword.length < 6}
                  loading={changePasswordMutation.isPending}
                  fullWidth
                />
                {newPassword.length > 0 && newPassword.length < 6 ? (
                  <Text style={styles.fieldError}>ستة أحرف على الأقل للكلمة الجديدة</Text>
                ) : null}
              </View>

              {isAdmin ? (
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>إضافة أدمن</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="الاسم الكامل"
                    placeholderTextColor={colors.textMuted}
                    value={adminFullName}
                    onChangeText={setAdminFullName}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="البريد"
                    placeholderTextColor={colors.textMuted}
                    value={adminEmail}
                    onChangeText={setAdminEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="الجوال"
                    placeholderTextColor={colors.textMuted}
                    value={adminPhone}
                    onChangeText={setAdminPhone}
                    keyboardType="phone-pad"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="كلمة المرور"
                    placeholderTextColor={colors.textMuted}
                    value={adminPassword}
                    onChangeText={setAdminPassword}
                    secureTextEntry
                  />
                  <AppButton
                    label="إنشاء حساب أدمن"
                    variant="secondary"
                    onPress={() => {
                      setErrorMessage("");
                      setSuccessMessage("");
                      createAdminMutation.mutate();
                    }}
                    disabled={isBusy || !adminFullName.trim() || !adminEmail.trim() || !adminPhone.trim() || !adminPassword}
                    loading={createAdminMutation.isPending}
                    fullWidth
                  />
                </View>
              ) : null}
            </>
          ) : null}

          {successMessage ? (
            <View style={styles.bannerOk}>
              <Ionicons name="checkmark-circle" size={iconSize.md} color={colors.success} />
              <Text style={styles.bannerOkText}>{successMessage}</Text>
            </View>
          ) : null}
          {errorMessage ? (
            <View style={styles.bannerErr}>
              <Ionicons name="alert-circle" size={iconSize.md} color={colors.danger} />
              <Text style={styles.bannerErrText}>{errorMessage}</Text>
            </View>
          ) : null}

          {user ? (
            <View>
              <AppButton label="تسجيل الخروج" onPress={clearSession} variant="danger" fullWidth />
            </View>
          ) : null}
        </View>
      </ScrollView>
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: 120
  },
  headerCard: {
    alignItems: "center",
    paddingVertical: spacing.xl,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginBottom: spacing.lg,
    ...shadows.soft
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface2,
    alignItems: "center",
    justifyContent: "center"
  },
  displayName: {
    marginTop: spacing.md,
    color: colors.text,
    fontSize: typography.h1,
    fontWeight: "800"
  },
  displayEmail: {
    marginTop: 6,
    color: colors.textSecondary,
    fontSize: typography.bodySm
  },
  displayPhone: {
    marginTop: 4,
    color: colors.textMuted,
    fontSize: typography.caption
  },
  roleTag: {
    marginTop: spacing.xs,
    alignSelf: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryMuted,
    borderWidth: 1,
    borderColor: colors.borderStrong
  },
  roleTagText: {
    color: colors.primaryDark,
    fontWeight: "800",
    fontSize: typography.caption
  },
  truckOwnerCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.sm,
    ...shadows.soft
  },
  truckOwnerCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm
  },
  statusBadgePending: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.warningMuted,
    borderWidth: 1,
    borderColor: "rgba(255, 176, 32, 0.45)"
  },
  statusBadgePendingText: {
    color: colors.text,
    fontWeight: "800",
    fontSize: typography.micro
  },
  truckNamePreview: {
    color: colors.text,
    fontWeight: "800",
    fontSize: typography.bodySm,
    textAlign: "right"
  },
  truckNamePreviewMuted: {
    color: colors.textMuted,
    fontSize: typography.bodySm,
    textAlign: "right"
  },
  truckStatusLine: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    fontWeight: "600",
    textAlign: "right"
  },
  truckOwnerHint: {
    color: colors.textSecondary,
    fontSize: typography.bodySm,
    lineHeight: 22
  },
  truckOwnerActionBlock: {
    marginTop: spacing.md,
    marginBottom: spacing.sm
  },
  truckPendingNotice: {
    color: colors.warning,
    fontSize: typography.caption,
    fontWeight: "700",
    lineHeight: 20
  },
  guestAuthCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.md,
    ...shadows.soft
  },
  guestTitle: {
    color: colors.text,
    fontSize: typography.h2,
    fontWeight: "800",
    textAlign: "center"
  },
  guestBody: {
    color: colors.textSecondary,
    fontSize: typography.bodySm,
    lineHeight: 22,
    textAlign: "center"
  },
  guestActions: {
    gap: spacing.sm
  },
  section: {
    gap: spacing.md
  },
  inlineHintCard: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.section,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm
  },
  inlineHintText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: typography.bodySm,
    lineHeight: 21,
    textAlign: "right",
    writingDirection: "rtl"
  },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadows.soft
  },
  cardTitle: {
    color: colors.text,
    fontWeight: "800",
    fontSize: typography.h3
  },
  input: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: typography.bodySm,
    textAlign: "right",
    writingDirection: "rtl"
  },
  fieldError: {
    color: colors.warning,
    fontSize: typography.caption,
    fontWeight: "600"
  },
  bannerOk: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "rgba(52,211,153,0.35)",
    backgroundColor: colors.successMuted
  },
  bannerOkText: {
    flex: 1,
    color: colors.success,
    fontWeight: "700",
    fontSize: typography.bodySm
  },
  bannerErr: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "rgba(248,113,113,0.4)",
    backgroundColor: colors.dangerMuted
  },
  bannerErrText: {
    flex: 1,
    color: colors.danger,
    fontWeight: "700",
    fontSize: typography.bodySm
  }
});
