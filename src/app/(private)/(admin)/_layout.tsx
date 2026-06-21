import { Redirect, Slot, Stack, Tabs } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useSelector } from "react-redux"
import { useThemeColors } from "@/utils/helpers"
import { StatusBar } from "expo-status-bar"

export default function PrivateLayout() {
    const {isAdmin} = useSelector((state: any) => state.authStore);
    const theme = useThemeColors()

    if (!isAdmin){
      return <Redirect href="/profile" />
    }

    return <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: true, headerStyle: { backgroundColor: theme.accentDark }, headerTitleStyle: { color: "white" }, headerTintColor: "white" }} />
    </>
}