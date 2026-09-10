import { useEffect, useState } from "react";
import { StyleSheet, ActivityIndicator, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slice/authSlice";
import { useThemeColors } from "@/utils/helpers";
import {
  authenticateWithBiometrics,
  canUseBiometrics,
  isBiometricUnlockEnabled,
} from "@/lib/biometrics";
import { RootState } from "@/store/storeTypes";

export default function Index() {
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useThemeColors();
  const { isAuthenticated } = useSelector((state: RootState) => state.authStore);
  const [isChecking, setIsChecking] = useState(true);

  const unlock = async () => {
    setIsChecking(true);

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    const shouldAuthenticate = await isBiometricUnlockEnabled();
    if (!shouldAuthenticate || !(await canUseBiometrics())) {
      router.replace("/shop");
      return;
    }

    const result = await authenticateWithBiometrics();
    setIsChecking(false);

    if (result.success) router.replace("/shop");
  };

  useEffect(() => {
    unlock();
  }, [isAuthenticated]);

  if (isChecking) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Unlock required</Text>
      <Text style={[styles.message, { color: theme.text }]}>Use your device authentication to continue.</Text>
      <Pressable onPress={unlock} style={[styles.button, { backgroundColor: theme.accent }]}>
        <Text style={{ color: theme.accentText }}>Try again</Text>
      </Pressable>
      <Pressable onPress={() => { dispatch(logout()); router.replace("/login"); }}>
        <Text style={[styles.logout, { color: theme.textSecondary }]}>Use a different account</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "bold" },
  message: { marginTop: 8, marginBottom: 20 },
  button: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  logout: { marginTop: 20 },
});
