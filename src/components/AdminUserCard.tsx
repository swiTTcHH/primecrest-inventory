import { User } from "@/types/types";
import { useThemeColors } from "@/utils/helpers";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface AdminUserCardProps {
  user: User;
  onDeletePress: (user: User) => void;
}

const AdminUserCard = ({ user, onDeletePress }: AdminUserCardProps) => {
  const theme = useThemeColors();

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  const isUserAdmin = user.role?.toLowerCase() === "admin";

  return (
    <View style={[styles.card, { backgroundColor: theme.backgroundElement }]}>
      <View style={styles.cardHeader}>
        {/* Avatar */}
        <View
          style={[
            styles.avatar,
            { backgroundColor: isUserAdmin ? theme.accent + "20" : theme.text + "10" },
          ]}
        >
          <Text
            style={[
              styles.avatarText,
              { color: isUserAdmin ? theme.accent : theme.text },
            ]}
          >
            {getInitials(user.name)}
          </Text>
        </View>

        {/* User Details */}
        <View style={styles.details}>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
            {user.name}
          </Text>
          <Text style={[styles.email, { color: theme.textSecondary || "gray" }]} numberOfLines={1}>
            {user?.email?.split("@")[0].substring(0, 2).padEnd(user?.email?.split("@")[0].length, "*") + "@" + user?.email?.split("@")[1]}
          </Text>
          
          {/* Role Badge */}
          <View style={styles.badgeRow}>
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: isUserAdmin
                    ? "#FEF3C7" // Warm Amber for admin
                    : "#E0F2FE", // Soft blue for user
                },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  {
                    color: isUserAdmin ? "#D97706" : "#0284C7",
                  },
                ]}
              >
                {user.role || "User"}
              </Text>
            </View>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.changePasswordBtn,
            { backgroundColor: theme.accent + "15" },
            pressed && { opacity: 0.7 },
          ]}
          onPress={() => onDeletePress(user)}
        >
          <Ionicons name="trash-outline" size={18} color={theme.accent} />
          <Text style={[styles.changePasswordBtnText, { color: theme.accent }]}>
            Delete
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "700",
  },
  details: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  email: {
    fontSize: 13,
    marginBottom: 6,
  },
  badgeRow: {
    flexDirection: "row",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  changePasswordBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: "center",
    marginLeft: 8,
  },
  changePasswordBtnText: {
    fontSize: 12,
    fontWeight: "700",
  },
});

export default AdminUserCard;
