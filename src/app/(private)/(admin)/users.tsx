import AdminUserCard from "@/components/AdminUserCard";
import AddUser from "@/components/modals/AddUser";
import DeleteUser from "@/components/modals/DeleteUser";
import api from "@/lib/api";
import { User } from "@/types/types";
import { useThemeColors } from "@/utils/helpers";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const Users = () => {
  const theme = useThemeColors();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);

  const addUserRef = useRef<BottomSheet>(null);
  const deleteUserRef = useRef<BottomSheet>(null);

  const closeModal = (ref: React.RefObject<BottomSheet | null>) => {
    ref.current?.close();
  };

  // Query users
  const { data: usersResponse, isLoading, refetch, isRefetching } = useQuery<any>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await api.get("users");
      return response;
    },
  });

  // Safe parsing to support both paginated object {data: User[]} and raw array [User]
  const usersList: User[] = Array.isArray(usersResponse)
    ? usersResponse
    : Array.isArray(usersResponse?.data)
    ? usersResponse.data
    : Array.isArray(usersResponse?.users)
    ? usersResponse.users
    : [];

  // Client-side fallback filter for search term
  const filteredUsers = usersList.filter((u) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      u.name?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      (u.role && u.role.toLowerCase().includes(term))
    );
  });

  const handleOpenAddUser = () => {
    setIsAddOpen(true);
    addUserRef.current?.expand();
  };

  const handleOpenDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteUserOpen(true);
    deleteUserRef.current?.expand();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerTitle: "User Management" }} />

      {/* Search Header */}
      <View style={styles.headerContainer}>
        <View
          style={[
            styles.searchBar,
            { borderColor: theme.text, backgroundColor: theme.backgroundElement },
          ]}
        >
          <Ionicons name="search-outline" size={20} color={theme.text} style={styles.searchIcon} />
          <TextInput
            onChangeText={setSearchTerm}
            value={searchTerm}
            placeholder="Search users by name, email..."
            placeholderTextColor="gray"
            style={{ flex: 1, fontSize: 16, color: theme.text }}
            clearButtonMode="while-editing"
            keyboardType="default"
          />
          {searchTerm.length > 0 && (
            <Pressable onPress={() => setSearchTerm("")}>
              <Ionicons name="close" size={24} color="red" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Users List */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.accent} />
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id || (item as any)._id}
          contentContainerStyle={[
            styles.listContainer,
            { opacity: isAddOpen || isDeleteUserOpen ? 0.2 : 1 },
          ]}
          onRefresh={refetch}
          refreshing={isRefetching}
          renderItem={({ item }) => (
            <AdminUserCard
              user={item}
              onDeletePress={handleOpenDeleteUser}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={48} color="gray" />
              <Text style={[styles.emptyText, { color: theme.text }]}>No users found</Text>
            </View>
          }
        />
      )}

      {/* FAB to Add User */}
      <Pressable
        onPress={handleOpenAddUser}
        style={({ pressed }) => [
          styles.addUserButton,
          { backgroundColor: theme.accentDark, opacity: pressed ? 0.8 : 1 },
        ]}
      >
        <Ionicons name="person-add-outline" size={24} color="white" />
      </Pressable>

      {/* Add User Modal */}
      <BottomSheet
        ref={addUserRef}
        onClose={() => setIsAddOpen(false)}
        snapPoints={["75%"]}
        index={-1}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: theme.backgroundElement }}
      >
        <AddUser onClose={() => closeModal(addUserRef)} />
      </BottomSheet>

      {/* Delete User Modal */}
      <BottomSheet
        ref={deleteUserRef}
        onClose={() => setIsDeleteUserOpen(false)}
        snapPoints={["25%"]}
        index={-1}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: theme.backgroundElement }}
      >
        <BottomSheetView>
          {selectedUser && (
            <DeleteUser
              user={selectedUser}
              onClose={() => closeModal(deleteUserRef)}
            />
          )}
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchIcon: {
    marginRight: 4,
  },
  listContainer: {
    paddingBottom: 80,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  addUserButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default Users;