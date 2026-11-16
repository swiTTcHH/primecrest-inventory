import { PRODUCT } from "@/types/types";
import { formatMoney, useThemeColors } from "@/utils/helpers";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const AdminProductCard = ({ product }: { product: PRODUCT }) => {
	const theme = useThemeColors();
	const cart = useSelector((state: any) => state.cartStore);
	const dispatch = useDispatch();

	// Get quantity if product is in cart
	const cartItem = cart?.cartItems?.find(
		(cartItem: any) => cartItem.product?._id === product?._id,
	);
	const quantityInCart = cartItem?.quantity || 0;

	// Determine stock status
	const getStockStatus = () => {
		if (product?.stockQuantity === 0) {
			return {
				status: "Out of Stock",
				color: "#EF4444",
				bgColor: "#FEE2E2",
			};
		} else if (product?.stockQuantity <= 5) {
			return {
				status: "Low Stock",
				color: "#F59E0B",
				bgColor: "#FEF3C7",
			};
		} else {
			return {
				status: "In Stock",
				color: "#10B981",
				bgColor: "#ECFDF5",
			};
		}
	};

	const stockStatus = getStockStatus();

	return (
		<View
			style={[
				styles.card,
				{ backgroundColor: theme.backgroundElement },
			]}
		>
			<View style={styles.content}>
				<View style={{flexDirection: "row", justifyContent: "space-between"}}>
					<Text style={{fontSize: 10, color: theme.textSecondary}}>SKU: {product.sku}</Text>
					<View
						style={[
							styles.statusBadge,
							{ backgroundColor: stockStatus.bgColor },
						]}
					>
						<Text
							style={[
								styles.statusText,
								{ color: stockStatus.color },
							]}
							>
							{product?.stockQuantity} in stock
						</Text>
					</View>
				</View>
				<Text style={[styles.name, { color: theme.text }]}>
					{product?.name}
				</Text>

				<View style={{flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap"}}>
					<View>
						<Text style={[styles.price, { color: theme.text, fontWeight: "400", fontSize: 10 }]}>
							Cost Price
						</Text>

						<Text style={[styles.price, { color: theme.text, fontSize: 14 }]}>
							{formatMoney(product?.costPrice)}
						</Text>
					</View>

					<View>
						<Text style={[styles.price, { color: theme.text, fontWeight: "400", fontSize: 10 }]}>
							Selling Price
						</Text>

						<Text style={[styles.price, { color: theme.text }]}>
							{formatMoney(product?.price)}
						</Text>
					</View>
				</View>

				<View style={{flexDirection: "row", justifyContent: "space-between", backgroundColor: theme.backgroundSelected, borderRadius: 4, marginTop: 10}}>
					<Text style={{color: theme.text}}>Profit Margin</Text>
					<Text style={{color: "white", paddingHorizontal: 4, backgroundColor: "green", borderRadius: 4}}><Ionicons name="trending-up-outline" /> {(((product.price - product.costPrice)/product.price)*100).toFixed(2)}%</Text>
				</View>
			</View>


		</View>
	);
};

export default AdminProductCard;

const styles = StyleSheet.create({
	card: {
		backgroundColor: "white",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		borderRadius: 8,
		padding: 16,
		marginVertical: 8,
		marginHorizontal: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},
	content: {
		flex: 1,
	},
	name: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#030609",
		marginBottom: 8,
	},
	price: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#012849",
	},
	stock: {
		fontSize: 14,
		color: "#9CA3AF",
	},
	statusBadge: {
		paddingHorizontal: 12,
		// paddingVertical: 6,
		borderRadius: 6,
	},
	statusText: {
		fontSize: 12,
		fontWeight: "600",
	},
});
