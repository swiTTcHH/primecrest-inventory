import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface AdminModuleCardProps {
	title: string;
	icon: keyof typeof Ionicons.glyphMap;
	subtitle?: string;
	stats?: Array<{
		label: string;
		value: string | number;
	}>;
	backgroundColor: string;
	textColor: string;
	accentColor: string;
	onPress?: () => void;
}

const AdminModuleCard = ({
	title,
	icon,
	subtitle,
	stats,
	backgroundColor,
	textColor,
	accentColor,
	onPress,
}: AdminModuleCardProps) => {
	return (
		<Pressable
			onPress={onPress}
			style={({ pressed }) => [
				styles.card,
				{
					backgroundColor,
					opacity: pressed ? 0.8 : 1,
				},
			]}
		>
			<View style={styles.header}>
				<View
					style={[
						styles.iconContainer,
						{ backgroundColor: accentColor + "20" },
					]}
				>
					<Ionicons name={icon} size={32} color={accentColor} />
				</View>
				<View style={{ flex: 1 }}>
					<Text style={[styles.title, { color: textColor }]}>
						{title}
					</Text>
					{subtitle && (
						<Text
							style={[
								styles.subtitle,
								{ color: textColor + "80" },
							]}
						>
							{subtitle}
						</Text>
					)}
				</View>
			</View>

			{stats && stats.length > 0 && (
				<View style={styles.statsContainer}>
					{stats.map((stat, index) => (
						<View
							key={index}
							style={[
								styles.statItem,
								index !== stats.length - 1 && {
									borderRightWidth: 1,
									borderRightColor: textColor + "20",
								},
							]}
						>
							<Text
								style={[
									styles.statValue,
									{ color: accentColor },
								]}
							>
								{stat.value}
							</Text>
							<Text
								style={[
									styles.statLabel,
									{ color: textColor + "80" },
								]}
							>
								{stat.label}
							</Text>
						</View>
					))}
				</View>
			)}
		</Pressable>
	);
};

const styles = StyleSheet.create({
	card: {
		borderRadius: 12,
		padding: 20,
		marginBottom: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	header: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: 16,
		marginBottom: 12,
	},
	iconContainer: {
		width: 56,
		height: 56,
		borderRadius: 12,
		justifyContent: "center",
		alignItems: "center",
	},
	title: {
		fontSize: 18,
		fontWeight: "600",
	},
	subtitle: {
		fontSize: 13,
		marginTop: 4,
	},
	statsContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		paddingTop: 16,
		borderTopWidth: 1,
		borderTopColor: "#00000010",
	},
	statItem: {
		flex: 1,
		alignItems: "center",
		paddingVertical: 8,
	},
	statValue: {
		fontSize: 18,
		fontWeight: "700",
	},
	statLabel: {
		fontSize: 12,
		marginTop: 4,
	},
});

export default AdminModuleCard;
