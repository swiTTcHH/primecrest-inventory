import AdminModuleCard from "@/components/AdminModuleCard";
import api from "@/lib/api";
import { formatMoney, useThemeColors } from "@/utils/helpers";
import { useQuery } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Index = () => {
	const router = useRouter();
	const theme = useThemeColors();

  const {data: productSummary, isLoading: productLoading} = useQuery({
    queryKey: ["productReport"],
    queryFn: async () => {
      const res = await api.get("reports/inventory")
      return res.data
    }
  })
  
  const {data: salesSummary, isLoading: salesLoading} = useQuery({
    queryKey: ["salesReport"],
    queryFn: async () => {
      const res = await api.get("reports/sales")
      return res.data
    }
  })

  const {data: usersSummary, isLoading: usersLoading} = useQuery({
    queryKey: ["usersReport"],
    queryFn: async () => {
      const res = await api.get("users")
      return res
    }
  }) 
  const {data: overView, isLoading: overViewLoading	} = useQuery({
    queryKey: ["overView"],
    queryFn: async () => {
      const res = await api.get("dashboard/overview")
      return res.data
    }
  }) 

  const { data: dashboardSales, isPending } = useQuery({
    queryKey: ["dashboardSales"],
    queryFn: async () => {
      const res = await api.get("dashboard/sales-summary");
      return res.data;
    },
  });

	return (
		<SafeAreaView
			style={[styles.container, { backgroundColor: theme.background }]}
		>
			<Stack.Screen options={{ headerShown: false }} />

			<ScrollView
				showsVerticalScrollIndicator={false}
				style={styles.scrollView}
			>
				<Text style={[styles.headerTitle, { color: theme.text }]}>
					Admin Dashboard
				</Text>

				<View style={styles.cardsContainer}>
					<AdminModuleCard
						title="Summary"
						icon="document-text-outline"
						subtitle="Business overview"
						stats={overViewLoading ? [{label: "", value: "-"}, {label: "", value: "-"}, {label: "", value: "-"}, {label: "", value: "-"}] : [
							{ label: "Total Stock Value", value: formatMoney(productSummary?.metrics?.totalValue) },
							// {label: "Total Revenue", value: formatMoney(salesSummary?.summary?.totalRevenue) },
							// { label: "Total Products", value: overView?.stats?.totalProducts },
							// { label: "Total Users", value: overView?.stats?.totalUsers },
							// { label: "Today Sales", value: overView?.stats?.todaySales },
							// { label: "Low Stock Count", value: overView?.stats?.lowStockCount },
						]}
						backgroundColor={theme.backgroundElement}
						textColor={theme.text}
						accentColor="#F59E0B"
						onPress={() => {}}
					/>

					<AdminModuleCard
						title="Product Management"
						icon="cube-outline"
						subtitle="Manage all products"
						stats={productLoading ? [{label: "", value: "-"}, {label: "", value: "-"}, {label: "", value: "-"}] : [
							{ label: "Total Products", value: productSummary?.metrics?.totalProducts },
							{ label: "Low Stock", value: productSummary?.metrics?.lowStockCount },
							{ label: "Out of Stock", value: productSummary?.metrics?.outOfStockCount },
						]}
						backgroundColor={theme.backgroundElement}
						textColor={theme.text}
						accentColor="#3B82F6"
						onPress={() => router.push("/products")}
					/>

					<AdminModuleCard
						title="User Management"
						icon="people-outline"
						subtitle="Manage customers & admins"
						stats={usersLoading ? [{label: "", value: "-"}, {label: "", value: "-"}, {label: "", value: "-"}] : [
							{ label: "Total Users", value: usersSummary?.meta?.total },
							{ label: "Active", value: usersSummary?.meta?.total },
							{ label: "Inactive", value: 0 },
						]}
						backgroundColor={theme.backgroundElement}
						textColor={theme.text}
						accentColor="#8B5CF6"
						onPress={() => {router.push("/users")}}
					/>

					<AdminModuleCard
						title="Sales in the last 30 days"
						icon="bar-chart-outline"
						subtitle="View full sales analytics"
						stats={salesLoading ? [{label: "", value: "-"}, {label: "", value: "-"}, {label: "", value: "-"}] : [
							{ label: "Total Sales", value: salesSummary?.summary?.totalSales },
							{ label: "Total Revenue", value: formatMoney(salesSummary?.summary?.totalRevenue) },
							// { label: "This Year", value: "$523K" },
						]}
						backgroundColor={theme.backgroundElement}
						textColor={theme.text}
						accentColor="#10B981"
						onPress={() => {router.push("/sales")}}
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default Index;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollView: {
		flex: 1,
		paddingHorizontal: 16,
		paddingVertical: 12,
	},
	headerTitle: {
		fontSize: 28,
		fontWeight: "700",
		marginBottom: 20,
		marginTop: 8,
	},
	cardsContainer: {
		paddingBottom: 20,
	},
});
