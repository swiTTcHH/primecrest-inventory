import { View, Text, StyleSheet, Pressable, ToastAndroid, ActivityIndicator } from 'react-native'
import { User } from '@/types/types';
import { useThemeColors } from '@/utils/helpers';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

const DeleteUser = ({ user, onClose }: { user: User; onClose: () => void }) => {
    const theme = useThemeColors()
    const queryClient = useQueryClient()

    const { isPending, mutate } = useMutation({
        mutationFn: async () => {
            const res = await api.delete(`users/${user.id}`)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["users"]})
            ToastAndroid.show("User deleted successfully", ToastAndroid.LONG)
            onClose()
        },
        onError: (error)=>{
            ToastAndroid.show(error?.message || "Something went wrong deleting this user", ToastAndroid.LONG)
            onClose()
        }
    })

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Delete User</Text>

        <View style={styles.userContainer}>
            <Text style={styles.text}>Are you sure you want to delete the user:</Text> 
            <Text style={[styles.text, {fontWeight: "800", fontSize: 24}]}>{user.name}</Text>
        </View>

      <View style={styles.buttonContainer}>
        <Pressable onPress={onClose} style={[styles.button, {backgroundColor: "pink"}]}>
            <Text style={[styles.buttonText, {color: "red"}]}>No, Cancel</Text>
        </Pressable>

        <Pressable onPress={()=> mutate()} style={[styles.button, {backgroundColor: theme.accentDark, opacity: isPending ? 0.65 : 1}]} disabled={isPending}>
            {isPending ? <ActivityIndicator color={"white"} /> : <Text style={styles.buttonText}>Yes, Confirm</Text>}
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        gap: 20,
        alignItems: "center",
    },
    heading: {
        fontSize: 32,
        color: "white",
        textAlign: "center",
    },
    userContainer: {
        flexDirection: "row",
        gap: 4,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        color: "white",
        fontSize: 20,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: "auto",
        // paddingVertical: 20,
    },
    button: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginHorizontal: 16,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold"
    }
})

export default DeleteUser