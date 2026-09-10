import Logo from "@/assets/images/Logo.png";
import api, { getRefreshedAccessToken } from "@/lib/api";
import { authenticateWithBiometrics, isBiometricUnlockEnabled } from "@/lib/biometrics";
import { setUser } from "@/store/slice/authSlice";
import type { RootState } from "@/store/storeTypes";
import type { LoginResponse } from "@/types/apiTypes";
import { useThemeColors } from "@/utils/helpers";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
	ActivityIndicator,
	Alert,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	ToastAndroid,
	View
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function Login() {
	const theme = useThemeColors();
	const [showPassword, setShowPassword] = useState(false);
	const [isBiometricPending, setIsBiometricPending] = useState(false);
	const passwordInputRef = useRef<TextInput>(null);

	const [biometricEnabled, setBiometricEnabled] = useState<boolean | null>(null);
	
	const dispatch = useDispatch();

	const { user, refreshToken } = useSelector((state: RootState) => state.authStore);

	const { control, handleSubmit, formState: { errors } } = useForm({
		defaultValues: {
			email: user?.email || "",
			password: "",
		},
	});

	const queryClient = useQueryClient();

	// login mutation
	const { mutate, isPending } = useMutation< LoginResponse, AxiosError, { email: string; password: string }>({
		mutationFn: async (data) => {
			const response = (await api.post( "/auth/login/", data )) as LoginResponse;
			return response;
		},
		onSuccess: (response) => {
			queryClient.setQueryData(["auth"], response);
			dispatch( setUser( { user: response.user, accessToken: response.tokens.accessToken, refreshToken: response.tokens.refreshToken, isAuthenticated: true } ) );
			ToastAndroid.show("Login successful", ToastAndroid.LONG);
			router.replace("/shop");
		},
		onError: (error: any) => {
			ToastAndroid.show( error.response?.data?.message || "Error logging in", ToastAndroid.LONG );
		},
	});

	const onSubmit = async (data: any) => {
		mutate(data);
	};

	//Check if user has enabled biometric unlock
	useEffect(() => {
		const checkBiometrics = async () => {
			const enabled = await isBiometricUnlockEnabled();
			setBiometricEnabled(enabled);
		};
		checkBiometrics();
	}, []);

	const unlockWithFingerprint = async () => {
		// 1. Check if a refresh token exists from a previous login
		if (!refreshToken || !user) {
			Alert.alert(
				"Fingerprint Login",
				"No saved session found on this device. Please log in with your email and password first."
			);
			return;
		}

		// 2. Perform biometric prompt
		const response = await authenticateWithBiometrics();
		if (!response.success) {
			return;
		}

		// 3. Exchange the 7-day refresh token for a fresh 5-minute access token
		try {
			setIsBiometricPending(true);
			await getRefreshedAccessToken(refreshToken);

			if (Platform.OS === "android") {
				ToastAndroid.show("Login successful", ToastAndroid.SHORT);
			}
			router.replace("/shop");
		} catch (error: any) {
			console.error("Biometric refresh failed:", error);
			// 4. Handle 7-day expired refresh token
			Alert.alert(
				"Session Expired",
				"You haven't logged in for 7 days and your session has expired. Please sign in with your password to continue."
			);
		} finally {
			setIsBiometricPending(false);
		}
	};

	return (
		<KeyboardAvoidingView
			behavior="padding"
			style={{ flex: 1, backgroundColor: theme.background, justifyContent: "center" }}
		>
			<View style={styles.container}>
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

				<View style={{ marginTop: 20, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10}}>
					<Pressable onPress={handleSubmit(onSubmit)} style={[ styles.button, {opacity: isPending ? 0.6 : 1, backgroundColor: theme.accent,}, ]}
						disabled={isPending}
					>
						{isPending ? (
							<ActivityIndicator color="white" />
						) : (
							<View style={{ flexDirection: "row", justifyContent: "center", gap: 5, alignItems: "center" }}>
								<Text style={[styles.buttonText, { color: theme.accentText }]} >
									Login
								</Text>
								<Ionicons name="log-in-outline" color={theme.accentText} size={24} />
							</View>
						)}
					</Pressable>

					<Pressable
						onPress={unlockWithFingerprint}
						disabled={isPending || isBiometricPending}
						style={[styles.biometric, {borderColor: theme.accent, backgroundColor: theme.accent, opacity: isBiometricPending ? 0.6 : 1 }]}
					>
						{biometricEnabled && (isBiometricPending ? (
							<ActivityIndicator size="small" color={theme.text} />
						) : (
							<Ionicons
								name="finger-print-outline"
								size={24}
								color={theme.text}
							/>
						))}
					</Pressable>
				</View>
			</View>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	logo: {
		width: 200,
		height: 200,
		alignSelf: "center",
		marginBottom: 20,
		backgroundColor: "white",
		borderRadius: 100,
		boxShadow: "inset 5px 5px 20px rgba(0, 0, 0, 0.52)",
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
		borderRadius: 8,
		alignItems: "center",
		width: "85%"
	},
	buttonText: {
		color: "white",
		fontWeight: "bold",
	},
	container: {
		padding: 20,
		gap: 10,
	},
	biometric: {
		width: 44,
		height: 44,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 50,
		borderWidth: 1,
	}
});
