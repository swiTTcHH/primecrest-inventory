import api from "@/lib/api";
import { AddProductResponse } from "@/types/apiTypes";
import { generateSKU, useThemeColors } from "@/utils/helpers";
import { BottomSheetTextInput, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import CategoryDropdown from "../CategoryDropdown";
import Select from "../Select";

type ProductFormData = {
	name: string;
	sku: string;
	category: string;
	price: number;
	costPrice: number;
	stockQuantity: number;
	minStockLevel: number;
	unit: string;
};

const AddProduct = ({ onClose }: { onClose: () => void }) => {
	const theme = useThemeColors();
	const styles = createStyles(theme);
	const [category, setCategory] = useState("");

	const queryClient = useQueryClient();

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
		setError,
	} = useForm<ProductFormData>({
		defaultValues: {
			name: "",
			// description: "",
			sku: "",
			category: "",
			price: 0,
			costPrice: 0,
			stockQuantity: 1,
			minStockLevel: 3,
			// image: null,
			unit: "piece",
		},
	});

	const { mutate, isPending } = useMutation<
		AddProductResponse,
		AxiosError<{ message: string }>,
		ProductFormData
	>({
		mutationFn: async (data) => {
			const payload = {
				...data,
				sku: generateSKU(data.name),
			};

			const response = await api.post("products", payload);
			return response.data;
		},
		onSuccess: () => {
			(queryClient.invalidateQueries({ queryKey: ["products"] }),
				reset());
			onClose();
		},
		onError: (error) => {
			ToastAndroid.show(
				error.response?.data?.message || "Something went wrong",
				ToastAndroid.LONG,
			);
			reset();
			onClose();
		},
	});

	const onSubmit = (data: ProductFormData) => {
		// Convert string values to numbers for comparison
		const price = parseFloat(data.price.toString());
		const costPrice = parseFloat(data.costPrice.toString());
		const stockQuantity = parseInt(data.stockQuantity.toString());

		if (price < 1) {
			setError("price", {
				message: "Price cannot be less than 1 naira",
			});
			return;
		}

		if (stockQuantity < 1) {
			setError("stockQuantity", {
				message: "Stock must be greater than 1",
			});
			return;
		}

		if (price <= costPrice) {
			setError("price", {
				message: "Selling Price must be greater than Cost Price",
			});
			setError("costPrice", {
				message: "Cost Price must be less than Selling Price",
			});
			return;
		}

		mutate(data);
	};

	return (
		<BottomSheetScrollView contentContainerStyle={[styles.container]}>
			<Text style={[styles.heading]}>Add Product</Text>

			<View style={styles.formContainer}>
				<Controller
					control={control}
					rules={{ required: "Product Name is required" }}
					name="name"
					render={({ field: { onChange, onBlur, value } }) => (
						<View>
							<Text style={styles.label}>
								Product Name
							</Text>
							<BottomSheetTextInput
								onChangeText={onChange}
								onBlur={onBlur}
								placeholder="Product Name"
								value={value}
								returnKeyType="next"
								style={[
									styles.input,
									{ color: theme.text },
								]}
								placeholderTextColor={"gray"}
							/>

							{errors.name && (
								<Text style={[styles.errorText]}>
									{errors.name.message}
								</Text>
							)}
						</View>
					)}
				/>

				<Controller
					control={control}
					rules={{ required: "Product Price is required" }}
					name="price"
					render={({ field: { onChange, onBlur, value } }) => (
						<View>
							<Text style={styles.label}>
								Product Selling Price
							</Text>
							<BottomSheetTextInput
								onChangeText={onChange}
								onBlur={onBlur}
								placeholder="0"
								style={[
									styles.input,
									{ color: theme.text },
								]}
								value={value.toString()}
								returnKeyType="next"
								placeholderTextColor={"gray"}
								keyboardType="numeric"
							/>
							{errors.price && (
								<Text style={styles.errorText}>
									{errors.price.message}
								</Text>
							)}
						</View>
					)}
				/>

				<Controller
					control={control}
					rules={{ required: "Product Category is required" }}
					name="category"
					render={({ field: { onChange, onBlur, value } }) => (
						<View>
							<CategoryDropdown
								category={value}
								// setCategory={(cat) => {
								// 	// setCategory(cat);
								// 	onChange(cat);
								// }}
								setCategory={onChange}
								label="Product Category"
								resultDisabled={true}
								identifier="_id"
							/>
							{errors.category && (
								<Text style={styles.errorText}>
									{errors.category.message}
								</Text>
							)}
						</View>
					)}
				/>

				<Controller
					control={control}
					rules={{ required: "Stock Quantity is required" }}
					name="stockQuantity"
					render={({ field: { onChange, onBlur, value } }) => (
						<View>
							<Text style={styles.label}>
								Stock Quantity
							</Text>
							<BottomSheetTextInput
								onChangeText={onChange}
								onBlur={onBlur}
								style={[
									styles.input,
									{ color: theme.text },
								]}
								placeholder="1"
								value={value.toString()}
								returnKeyType="next"
								placeholderTextColor={"gray"}
								keyboardType="numeric"
							/>
							{errors.stockQuantity && (
								<Text style={styles.errorText}>
									{errors.stockQuantity.message}
								</Text>
							)}
						</View>
					)}
				/>

				<Controller
					control={control}
					rules={{ required: "Cost Price is required" }}
					name="costPrice"
					render={({ field: { onChange, onBlur, value } }) => (
						<View>
							<Text style={styles.label}>
								Cost Price (in Naira)
							</Text>
							<BottomSheetTextInput
								onChangeText={onChange}
								onBlur={onBlur}
								style={[
									styles.input,
									{ color: theme.text },
								]}
								placeholder="0"
								value={value.toString()}
								returnKeyType="next"
								placeholderTextColor={"gray"}
								keyboardType="numeric"
							/>
							{errors.costPrice && (
								<Text style={styles.errorText}>
									{errors.costPrice.message}
								</Text>
							)}
						</View>
					)}
				/>

				<Controller
					control={control}
					rules={{ required: "Unit of Measurement is required" }}
					name="unit"
					render={({ field: { onChange, onBlur, value } }) => (
						<View>
							<Select
								data={[
									{ name: "Piece", value: "piece" },
									{ name: "Pack", value: "pack" },
								]}
								value={value}
								setValue={onChange}
								identifier="value"
								resultDisabled
								label="Unit of Measurement"
							/>
							{errors.unit && (
								<Text style={styles.errorText}>
									{errors.unit.message}
								</Text>
							)}
						</View>
					)}
				/>

				<Controller
					control={control}
					rules={{ required: "Minimum Stock Level is required" }}
					name="minStockLevel"
					render={({ field: { onChange, onBlur, value } }) => (
						<View>
							<Text style={styles.label}>
								Minimum Stock Level
							</Text>
							<BottomSheetTextInput
								onChangeText={onChange}
								onBlur={onBlur}
								style={[
									styles.input,
									{ color: theme.text },
								]}
								placeholder="minStockLevel"
								value={value.toString()}
								returnKeyType="next"
								placeholderTextColor={"gray"}
								keyboardType="numeric"
							/>
							{errors.minStockLevel && (
								<Text style={styles.errorText}>
									{errors.minStockLevel.message}
								</Text>
							)}
						</View>
					)}
				/>
			</View>
			<Pressable
				style={[
					styles.button,
					isPending && {
						opacity: 0.7,
						backgroundColor: theme.accent,
					},
				]}
				onPress={handleSubmit(onSubmit)}
				disabled={isPending}
			>
				{isPending ? (
					<ActivityIndicator color="white" />
				) : (
					<Text style={styles.buttonText}>Add Product</Text>
				)}
			</Pressable>
		</BottomSheetScrollView>
	);
};

const createStyles = (theme: any) =>
	StyleSheet.create({
		container: {
			padding: 40,
		},
		heading: {
			color: theme.text,
			fontWeight: "bold",
			fontSize: 24,
		},
		formContainer: {
			marginVertical: 10,
			gap: 10,
		},
		label: {
			color: "#dbd9d9ff",
			marginVertical: 5,
			fontSize: 16,
		},
		input: {
			borderColor: "gray",
			borderWidth: 1,
			padding: 12,
			fontSize: 18,
			marginVertical: 4,
			borderRadius: 8,
		},
		button: {
			padding: 12,
			marginTop: 20,
			borderRadius: 8,
			alignItems: "center",
			backgroundColor: theme.accentDark,
		},
		buttonText: {
			color: "white",
			fontWeight: "bold",
		},
		errorText: {
			color: "red",
			fontSize: 12,
			marginTop: 4,
			marginLeft: 4,
		},
	});

export default AddProduct;
