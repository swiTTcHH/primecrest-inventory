import { View, Text, Pressable, ToastAndroid } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/storeTypes'
import { logout } from '@/store/slice/authSlice'
import { Link, router } from 'expo-router'
import { useThemeColors } from '@/utils/helpers'

const Profile = () => {
    const dispatch = useDispatch();
    const theme = useThemeColors()
    const { user } = useSelector((state: RootState) => state.authStore);
    const [isEmailVisible, setIsEmailVisible] = useState(false)


    const handleLogout = () => {
        dispatch(logout());
        ToastAndroid.show("Logout successful", ToastAndroid.LONG);
        router.replace("/login");
    }
  return (
    <SafeAreaView style={{backgroundColor: theme.background,paddingHorizontal: "5%", gap: 10, height: "100%"}}>
      <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 15, paddingHorizontal: 20}}>
        <Text style={{fontSize: 24, fontWeight: "bold", color: theme.text}}>Profile</Text>
        <Pressable onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="red" />
        </Pressable>
      </View>

      <View>
        <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 15, paddingHorizontal: 20}}>
            <Text style={{color: theme.text}}>Full Name</Text>
            <Text style={{color: theme.text}}>{user?.name}</Text>
        </View>
        <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 15, paddingHorizontal: 20}}>
            <Text style={{color: theme.text}}>Email</Text>
            
            {/* Show only the first 3 letters of the email */}
            <Pressable onPress={() => setIsEmailVisible(!isEmailVisible)}>
              {!isEmailVisible ? <Text style={{color: theme.text}}>{user?.email?.split("@")[0].substring(0, 2).padEnd(user?.email?.split("@")[0].length, "*") + "@" + user?.email?.split("@")[1]}</Text> : <Text style={{color: theme.text}}>{user?.email}</Text>}
            </Pressable>
        </View>
        <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 15, paddingHorizontal: 20}}>
            <Text style={{color: theme.text}}>Role</Text>
            <Text style={{textTransform: "capitalize", color: theme.text}}>{user?.role}</Text>
        </View>
      </View>

      <Text style={{fontSize: 12, textAlign: "center", color: "gray", marginTop: "auto"}}>
        Thank you for using Primecrest Inventory
      </Text>
      
      <Text style={{fontSize: 12, textAlign: "center", color: "gray", marginTop: 4}}>
        Developed by <Link href="https://github.com/swiTTcHH" style={{fontWeight: "bold", color: theme.textSecondary}}>swiTcH</Link>
      </Text>
    </SafeAreaView>
  )
}

export default Profile