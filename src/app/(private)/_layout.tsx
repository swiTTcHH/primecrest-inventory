import { Redirect, Tabs } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useSelector } from "react-redux"
import { useThemeColors } from "@/utils/helpers";

export default function PrivateLayout() {
    const {isAuthenticated, isAdmin} = useSelector((state: any) => state.authStore);
    const theme = useThemeColors()

    if (!isAuthenticated){
      return <Redirect href="/login" />
    }

    return (
        <Tabs screenOptions={{ headerShown: false,  tabBarActiveTintColor: theme.accentDark, tabBarInactiveTintColor: theme.text, tabBarStyle: { backgroundColor: theme.backgroundElement, paddingBottom: 5, paddingTop: 5, height: 70 } }}>
            <Tabs.Screen name="shop" options={{tabBarLabel: "Shop", tabBarIcon: ({color, size}) => (<Ionicons name="storefront" color={color} size={24} />)}} />
            <Tabs.Screen name="cart" options={{tabBarLabel: "Cart", tabBarIcon: ({color, size}) => (<Ionicons name="cart" color={color} size={24} />)}} />
            <Tabs.Screen name="(admin)" options={{href: isAdmin ? "/" : null, tabBarLabel: "Management", tabBarIcon: ({color, size}) => (<Ionicons name="lock-closed" color={color} size={24} />)}} />
            {/* <Tabs.Screen name="(admin)/management" options={{href: isAdmin ? "/management" : null, tabBarLabel: "Admin", tabBarIcon: ({color, size}) => (<Ionicons name="lock-closed" color={color} size={size} />)}} /> */}
            <Tabs.Screen name="profile" options={{tabBarLabel: "Profile", tabBarIcon: ({color, size}) => (<Ionicons name="person" color={color} size={24} />)}} />
        </Tabs>
    )
}