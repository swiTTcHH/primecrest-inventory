import { formatDate, formatMoney, useThemeColors } from "@/utils/helpers";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TopProduct {
	productId: string;
	productName: string;
	quantitySold: number;
	revenue: number;
}

interface DailyBreakdown {
	_id: string; // date string e.g. "2026-06-17"
	totalSales: number;
	totalRevenue: number;
}

/** Shape returned by GET sales/daily */
export interface DailySalesData {
	date: string;
	totalSales: number;
	totalRevenue: number;
	averageOrderValue: number;
	totalItems: number;
	topProducts: TopProduct[];
}

/** Shape returned by GET sales/weekly */
export interface WeeklySalesData {
	startDate: string;
	endDate: string;
	summary: {
		_id: null;
		totalSales: number;
		totalRevenue: number;
		averageOrderValue: number;
	};
	dailyBreakdown: DailyBreakdown[];
}

/** Shape returned by an "all-time" endpoint (same structure as weekly summary) */
export interface AllTimeSalesData {
	totalSales: number;
	totalRevenue: number;
	averageOrderValue: number;
}

type Variant = "daily" | "weekly" | "alltime";

interface AdminSalesCardProps {
	variant: Variant;
	data?: DailySalesData | WeeklySalesData | AllTimeSalesData;
	isLoading?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const VARIANT_META: Record<
	Variant,
	{ title: string; icon: keyof typeof Ionicons.glyphMap; subtitle: string }
> = {
	daily: {
		title: "Today's Sales",
		icon: "today-outline",
		subtitle: "Daily summary",
	},
	weekly: {
		title: "This Week's Sales",
		icon: "calendar-outline",
		subtitle: "Weekly summary",
	},
	alltime: {
		title: "All-Time Sales",
		icon: "stats-chart-outline",
		subtitle: "Cumulative summary",
	},
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatBox = ({
	label,
	value,
	accentColor,
	textColor,
	isLast,
}: {
	label: string;
	value: string | number;
	accentColor: string;
	textColor: string;
	isLast: boolean;
}) => (
	<View
		style={[
			styles.statItem,
			!isLast && { borderRightWidth: 1, borderRightColor: textColor + "20" },
		]}
	>
		<Text style={[styles.statValue, { color: accentColor }]}>{value}</Text>
		<Text style={[styles.statLabel, { color: textColor + "99" }]}>{label}</Text>
	</View>
);

const TopProductRow = ({
	product,
	index,
	accentColor,
	textColor,
	dividerColor,
}: {
	product: TopProduct;
	index: number;
	accentColor: string;
	textColor: string;
	dividerColor: string;
}) => (
	<View
		style={[
			styles.productRow,
			index > 0 && { borderTopWidth: 1, borderTopColor: dividerColor },
		]}
	>
		<View style={[styles.productRank, { backgroundColor: accentColor + "20" }]}>
			<Text style={[styles.productRankText, { color: accentColor }]}>
				{index + 1}
			</Text>
		</View>
		<View style={styles.productInfo}>
			<Text style={[styles.productName, { color: textColor }]} numberOfLines={1}>
				{product.productName}
			</Text>
			<Text style={[styles.productMeta, { color: textColor + "80" }]}>
				{product.quantitySold} sold
			</Text>
		</View>
		<Text style={[styles.productRevenue, { color: accentColor }]}>
			{formatMoney(product.revenue)}
		</Text>
	</View>
);

const DailyBreakdownRow = ({
	item,
	index,
	accentColor,
	textColor,
	dividerColor,
}: {
	item: DailyBreakdown;
	index: number;
	accentColor: string;
	textColor: string;
	dividerColor: string;
}) => (
	<View
		style={[
			styles.productRow,
			index > 0 && { borderTopWidth: 1, borderTopColor: dividerColor },
		]}
	>
		<View style={styles.productInfo}>
			<Text style={[styles.productName, { color: textColor }]}>
				{formatDate(item._id)}
			</Text>
		</View>
		<View style={{ alignItems: "flex-end" }}>
			<Text style={[styles.productRevenue, { color: accentColor }]}>
				{formatMoney(item.totalRevenue)}
			</Text>
			<Text style={[styles.productMeta, { color: textColor + "80" }]}>
				{item.totalSales} orders
			</Text>
		</View>
	</View>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const AdminSalesCard = ({ variant, data, isLoading }: AdminSalesCardProps) => {
	const theme = useThemeColors();
	const meta = VARIANT_META[variant];

	const dividerColor = theme.text + "15";

	// Derive common stats regardless of variant
	const getSummaryStats = () => {
		if (!data) return null;

		if (variant === "daily") {
			const d = data as DailySalesData;
			return {
				totalSales: d.totalSales,
				totalRevenue: d.totalRevenue,
				avgOrder: d.averageOrderValue,
			};
		}
		if (variant === "weekly") {
			const d = data as WeeklySalesData;
			return {
				totalSales: d.summary?.totalSales,
				totalRevenue: d.summary?.totalRevenue,
				avgOrder: d.summary?.averageOrderValue,
			};
		}
		// alltime
		const d = data as AllTimeSalesData;
		return {
			totalSales: d.totalSales,
			totalRevenue: d.totalRevenue,
			avgOrder: d.averageOrderValue,
		};
	};

	const stats = getSummaryStats();

	const topProducts =
		variant === "daily" ? (data as DailySalesData)?.topProducts : null;

	const dailyBreakdown =
		variant === "weekly" ? (data as WeeklySalesData)?.dailyBreakdown : null;

	const dateLabel = (() => {
		if (variant === "daily" && data)
			return formatDate((data as DailySalesData).date);
		if (variant === "weekly" && data) {
			const d = data as WeeklySalesData;
			return `${formatDate(d.startDate)} – ${formatDate(d.endDate)}`;
		}
		return null;
	})();

	return (
		<View
			style={[
				styles.card,
				{ backgroundColor: theme.backgroundElement },
			]}
		>
			{/* ── Header ── */}
			<View style={styles.header}>
				<View
					style={[
						styles.iconContainer,
						{ backgroundColor: theme.accent + "20" },
					]}
				>
					<Ionicons name={meta.icon} size={28} color={theme.accent} />
				</View>
				<View style={{ flex: 1 }}>
					<Text style={[styles.title, { color: theme.text }]}>{meta.title}</Text>
					{dateLabel ? (
						<Text style={[styles.subtitle, { color: theme.text + "80" }]}>
							{dateLabel}
						</Text>
					) : (
						<Text style={[styles.subtitle, { color: theme.text + "80" }]}>
							{meta.subtitle}
						</Text>
					)}
				</View>
			</View>

			{/* ── Loading state ── */}
			{isLoading && (
				<View style={styles.loadingContainer}>
					<ActivityIndicator color={theme.accent} />
				</View>
			)}

			{/* ── Stats row ── */}
			{!isLoading && stats && (
				<View style={[styles.statsRow, { borderTopColor: dividerColor }]}>
					<StatBox
						label="Orders"
						value={stats.totalSales ?? 0}
						accentColor={theme.accent}
						textColor={theme.text}
						isLast={false}
					/>
					<StatBox
						label="Revenue"
						value={formatMoney(stats.totalRevenue ?? 0)}
						accentColor={theme.accent}
						textColor={theme.text}
						isLast={false}
					/>
					<StatBox
						label="Avg Order"
						value={formatMoney(stats.avgOrder ?? 0)}
						accentColor={theme.accent}
						textColor={theme.text}
						isLast={true}
					/>
				</View>
			)}

			{/* ── Top Products (daily only) ── */}
			{!isLoading &&
				topProducts &&
				topProducts.length > 0 && (
					<View style={[styles.listSection, { borderTopColor: dividerColor }]}>
						<Text style={[styles.listHeading, { color: theme.text + "99" }]}>
							Top Products
						</Text>
						{topProducts.map((p, i) => (
							<TopProductRow
								key={p.productId}
								product={p}
								index={i}
								accentColor={theme.accent}
								textColor={theme.text}
								dividerColor={dividerColor}
							/>
						))}
					</View>
				)}

			{/* ── Daily Breakdown (weekly only) ── */}
			{!isLoading &&
				dailyBreakdown &&
				dailyBreakdown.length > 0 && (
					<View style={[styles.listSection, { borderTopColor: dividerColor }]}>
						<Text style={[styles.listHeading, { color: theme.text + "99" }]}>
							Daily Breakdown
						</Text>
						{dailyBreakdown.map((item, i) => (
							<DailyBreakdownRow
								key={item._id}
								item={item}
								index={i}
								accentColor={theme.accent}
								textColor={theme.text}
								dividerColor={dividerColor}
							/>
						))}
					</View>
				)}

			{/* ── Empty state ── */}
			{!isLoading && stats && stats.totalSales === 0 && (
				<View style={styles.emptyState}>
					<Ionicons
						name="receipt-outline"
						size={32}
						color={theme.text + "40"}
					/>
					<Text style={[styles.emptyText, { color: theme.text + "60" }]}>
						No sales recorded yet
					</Text>
				</View>
			)}
		</View>
	);
};

export default AdminSalesCard;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
	card: {
		borderRadius: 16,
		marginBottom: 20,
		overflow: "hidden",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.12,
		shadowRadius: 8,
		elevation: 4,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		gap: 14,
		padding: 18,
	},
	iconContainer: {
		width: 52,
		height: 52,
		borderRadius: 14,
		justifyContent: "center",
		alignItems: "center",
	},
	title: {
		fontSize: 17,
		fontWeight: "700",
	},
	subtitle: {
		fontSize: 12,
		marginTop: 2,
	},
	loadingContainer: {
		paddingVertical: 28,
		alignItems: "center",
	},
	statsRow: {
		flexDirection: "row",
		borderTopWidth: 1,
	},
	statItem: {
		flex: 1,
		alignItems: "center",
		paddingVertical: 16,
	},
	statValue: {
		fontSize: 16,
		fontWeight: "700",
	},
	statLabel: {
		fontSize: 11,
		marginTop: 3,
		textAlign: "center",
	},
	listSection: {
		borderTopWidth: 1,
		paddingHorizontal: 18,
		paddingBottom: 12,
	},
	listHeading: {
		fontSize: 11,
		fontWeight: "600",
		letterSpacing: 0.8,
		textTransform: "uppercase",
		marginTop: 14,
		marginBottom: 8,
	},
	productRow: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 10,
		gap: 12,
	},
	productRank: {
		width: 28,
		height: 28,
		borderRadius: 8,
		justifyContent: "center",
		alignItems: "center",
	},
	productRankText: {
		fontSize: 13,
		fontWeight: "700",
	},
	productInfo: {
		flex: 1,
	},
	productName: {
		fontSize: 14,
		fontWeight: "600",
	},
	productMeta: {
		fontSize: 12,
		marginTop: 1,
	},
	productRevenue: {
		fontSize: 14,
		fontWeight: "700",
	},
	emptyState: {
		alignItems: "center",
		paddingVertical: 24,
		gap: 8,
	},
	emptyText: {
		fontSize: 13,
	},
});
