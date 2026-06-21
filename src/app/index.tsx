import { useEffect } from "react";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";

export default function Index() {
  const router = useRouter();
  // Read auth state right out of Redux
  const { isAuthenticated } = useSelector((state: any) => state.authStore);

  useEffect(() => {
    if (isAuthenticated) {
      // If logged in, push them directly to their destination
      router.replace("/shop");
    } else {
      // If not, push them out to login
      router.replace("/login");
    }
  }, [isAuthenticated]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#012849" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
});
