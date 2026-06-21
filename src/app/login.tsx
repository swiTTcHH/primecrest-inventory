import Logo from "@/assets/images/Logo.png";
import api from "@/lib/api";
import { setUser } from "@/store/slice/authSlice";
import type { LoginResponse } from "@/types/apiTypes";
import { useThemeColors } from "@/utils/helpers";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	ToastAndroid,
	View
} from "react-native";
import { useDispatch } from "react-redux";

export default function Login() {
	const theme = useThemeColors();
	const [showPassword, setShowPassword] = useState(false);
	const passwordInputRef = useRef<TextInput>(null);
	const dispatch = useDispatch();

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const queryClient = useQueryClient();
	const { mutate, isPending } = useMutation<
		LoginResponse,
		AxiosError,
		{ email: string; password: string }
	>({
		mutationFn: async (data) => {
			const response = (await api.post(
				"/auth/login/",
				data,
			)) as LoginResponse;
			return response;
		},
		onSuccess: (response) => {
			queryClient.setQueryData(["auth"], response);
			dispatch(
				setUser({
					user: response.user,
					accessToken: response.tokens.accessToken,
					refreshToken: response.tokens.refreshToken,
					isAuthenticated: true,
				}),
			);
			ToastAndroid.show("Login successful", ToastAndroid.LONG);
			router.replace("/shop");
		},
		onError: (error: any) => {
			ToastAndroid.show(
				error.response.data.message || "Error logging in",
				ToastAndroid.LONG,
			);
		},
	});

	const onSubmit = async (data: any) => {
		mutate(data);
	};

	return (
		<KeyboardAvoidingView
			behavior="padding"
			style={{ flex: 1, backgroundColor: theme.background, justifyContent: "center" }}
		>
			<View
				style={[styles.container, { backgroundColor: theme.background }]}
			>
				<Image source={Logo} style={styles.logo} />
				<Controller
					control={control}
					rules={{
						required: true,
						pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
					}}
					render={({ field: { onChange, onBlur, value } }) => (
						<View>
							<TextInput
								placeholder="Email"
								onBlur={onBlur}
								onChangeText={onChange}
								value={value}
								style={[styles.input, { color: theme.text }]}
								returnKeyType="next"
								onSubmitEditing={() =>
									passwordInputRef.current?.focus()
								}
								placeholderTextColor={theme.text}
								// Critical email configurations
								keyboardType="email-address"
								inputMode="email"
								autoComplete="email"
								textContentType="emailAddress"
								autoCapitalize="none"
								autoCorrect={false}
							/>

							{errors.email && (
								<Text style={styles.errorText}>
									Please enter a valid email.
								</Text>
							)}
						</View>
					)}
					name="email"
				/>

				<Controller
					control={control}
					rules={{
						required: true,
						minLength: 8,
					}}
					render={({ field: { onChange, onBlur, value } }) => (
						<View>
							<View style={[styles.passwordContainer]}>
								<TextInput
									placeholder="Password"
									onBlur={onBlur}
									secureTextEntry={
										showPassword ? false : true
									}
									onChangeText={onChange}
									value={value}
									style={[
										styles.input,
										{
											width: "90%",
											borderWidth: 0,
											color: theme.text,
										},
									]}
									ref={passwordInputRef}
									placeholderTextColor={theme.text}
									returnKeyType="go"
									onSubmitEditing={handleSubmit(onSubmit)}
									keyboardType="default"
									inputMode="text"
									autoComplete="password"
									textContentType="password"
									autoCapitalize="none"
									autoCorrect={false}
								/>

								<Pressable
									onPress={() =>
										setShowPassword(!showPassword)
									}
								>
									{showPassword ? (
										<Ionicons
											name="eye-off-outline"
											size={24}
											color={theme.text}
										/>
									) : (
										<Ionicons
											name="eye-outline"
											size={24}
											color={theme.text}
										/>
									)}
								</Pressable>
							</View>

							{errors.password && (
								<Text style={styles.errorText}>
									Password must be at least 8 characters.
								</Text>
							)}
						</View>
					)}
					name="password"
				/>

				<Pressable
					onPress={handleSubmit(onSubmit)}
					style={[
						styles.button,
						{
							opacity: isPending ? 0.6 : 1,
							backgroundColor: theme.accent,
						},
					]}
					disabled={isPending}
				>
					{isPending ? (
						<ActivityIndicator color="white" />
					) : (
						<View
							style={{
								flexDirection: "row",
								justifyContent: "center",
								gap: 5,
								alignItems: "center",
							}}
						>
							<Text
								style={[
									styles.buttonText,
									{ color: theme.accentText },
								]}
							>
								Login
							</Text>
							<Ionicons
								name="log-in-outline"
								color={theme.accentText}
								size={24}
							/>
						</View>
					)}
				</Pressable>
			</View>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	logo: {
		width: 200,
		height: 200,
		// contentFit: "contain",
		alignSelf: "center",
		marginBottom: 20,
		backgroundColor: "white",
		borderRadius: 100,
		boxShadow: "inset 5px 5px 20px rgba(0, 0, 0, 0.52)",
	},
	form: {
		backgroundColor: "red",
		marginVertical: "auto",
		justifyContent: "center",
		gap: 10,
	},
	errorText: {
		color: "red",
		fontSize: 12,
		marginTop: 4,
		marginLeft: 4,
	},
	input: {
		borderColor: "gray",
		borderWidth: 1,
		padding: 12,
		marginVertical: 4,
		borderRadius: 8,
	},
	passwordContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		borderColor: "gray",
		borderWidth: 1,
		paddingHorizontal: 3,
		paddingVertical: 0,
		borderRadius: 8,
	},
	button: {
		padding: 12,
		marginTop: 20,
		borderRadius: 8,
		alignItems: "center",
	},
	buttonText: {
		color: "white",
		fontWeight: "bold",
	},
	container: {
		height: "auto",
		// marginVertical: "auto",
		justifyContent: "center",
		padding: 20,
		gap: 10,
	},
});
